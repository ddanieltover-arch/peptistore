import { chromium } from 'playwright';
import { pool } from '../src/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const TARGET_SHOP_URL = 'https://researchpeptide.co.uk/shop/';

async function queueFullSite() {
  console.log('Initiating Full-Site Scraper...');

  const proxyOpts = process.env.PROXY_URL && process.env.PROXY_URL.includes('YOUR_API_KEY_HERE') === false
    ? { server: process.env.PROXY_URL } 
    : undefined;

  if (!proxyOpts) {
    console.warn('WARNING: No PROXY_URL configured in .env. Cloudflare will likely block this attempt.');
  }

  const browser = await chromium.launch({ 
    headless: true,
    proxy: proxyOpts
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  let currentPage = 1;
  let hasMorePages = true;
  const productUrls = new Set<string>();

  try {
    while (hasMorePages) {
      const pageUrl = currentPage === 1 
        ? TARGET_SHOP_URL 
        : `${TARGET_SHOP_URL}page/${currentPage}/`;
      
      console.log(`Scanning page ${currentPage}: ${pageUrl}`);
      
      let retryCount = 0;
      let pageLoaded = false;
      
      while (retryCount < 2 && !pageLoaded) {
        try {
          await page.goto(pageUrl, { waitUntil: 'commit', timeout: 60000 });
          await page.waitForTimeout(5000); // Wait bit for DOM to populate
          pageLoaded = true;
        } catch (e: any) {
          retryCount++;
          console.warn(`Attempt ${retryCount} failed for ${pageUrl}: ${e.message}. Retrying...`);
        }
      }

      if (!pageLoaded) {
        console.error(`Failed to load ${pageUrl} after retries. Skipping.`);
        currentPage++;
        continue;
      }
      
      // Handle Cloudflare challenge check just in case
      const title = await page.title();
      if (title.includes('Just a moment') || title.includes('Cloudflare')) {
         throw new Error('Blocked by Cloudflare - Proxy required or failing.');
      }

      // Extract product links from standard WooCommerce layouts
      const links = await page.evaluate(() => {
        const anchors = document.querySelectorAll(
          'li.product a.woocommerce-LoopProduct-link, .product-grid-item > a, .products .product a'
        );
        return Array.from(anchors)
          .map(a => (a as HTMLAnchorElement).href)
          .filter(href => href.includes('/product/'));
      });

      if (links.length === 0) {
        console.log('No more products found. Ending pagination.');
        hasMorePages = false;
        break;
      }

      links.forEach(link => productUrls.add(link));
      console.log(`Found ${links.length} products on page ${currentPage}`);
      currentPage++;
    }

    console.log(`\nScan Complete: Extracted ${productUrls.size} unique products.`);
    
    // Connect to PG and enqueue jobs
    console.log('Injecting jobs into Postgres queue...');
    let injected = 0;
    
    for (const url of productUrls) {
      // Check if it already exists as a pending job
      const { rows } = await pool.query(
        `SELECT id FROM scrape_queue WHERE payload->>'url' = $1 AND status IN ('pending', 'processing')`,
        [url]
      );
      
      if (rows.length === 0) {
        await pool.query(
          `INSERT INTO scrape_queue (type, payload) VALUES ($1, $2)`,
          ['SCRAPE_PRODUCT', JSON.stringify({ url })]
        );
        injected++;
      }
    }

    console.log(`Successfully queued ${injected} NEW products for extraction!`);

  } catch (error: any) {
    console.error('Error during site scan:', error.message);
  } finally {
    await browser.close();
    // Allow process to exit cleanly
    process.exit(0);
  }
}

queueFullSite();
