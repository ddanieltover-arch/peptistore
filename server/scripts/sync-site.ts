import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_KEY = '57598939deeac0e6fcd3c03247788a03';
const TARGET_BASE = 'https://researchpeptide.co.uk/shop/';

async function scanViaApi() {
  console.log('Initiating Site-Sync via ScraperAPI (Direct Mode)...');
  
  let currentPage = 1;
  let hasMore = true;
  const discovered = new Set<string>();

  try {
    while (hasMore && currentPage < 15) { // Increased limit
      const targetUrl = currentPage === 1 ? TARGET_BASE : `${TARGET_BASE}page/${currentPage}/`;
      const apiUrl = `https://api.scraperapi.com?api_key=${API_KEY}&url=${encodeURIComponent(targetUrl)}&render=true`;
      
      console.log(`Scanning page ${currentPage}: ${targetUrl}`);
      
      let html = '';
      try {
        const curlCmd = `curl -s -L "https://api.scraperapi.com?api_key=${API_KEY}&url=${encodeURIComponent(targetUrl)}&render=true"`;
        const { execSync } = await import('child_process');
        html = execSync(curlCmd, { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 5 }); // 5MB buffer
        
        if (!html || html.length < 500) {
            throw new Error('Empty or too short response from proxy.');
        }
      } catch (e: any) {
        console.error(`Curl failed on page ${currentPage}:`, e.message);
        break;
      }

      // Regex to find product links
      const matches = html.match(/https:\/\/researchpeptide\.co\.uk\/product\/[a-zA-Z0-9-]+\//g);
      
      if (matches && matches.length > 0) {
        let countBefore = discovered.size;
        matches.forEach(m => discovered.add(m));
        let newlyFound = discovered.size - countBefore;
        
        console.log(`Page ${currentPage} processed. Unique product URLs found so far: ${discovered.size}`);
        
        if (newlyFound === 0) {
           console.log('No new products found on this page. Stopping scan.');
           hasMore = false;
        } else {
           currentPage++;
        }
      } else {
        console.log('No product links found on page HTML.');
        hasMore = false;
      }
    }

    console.log(`\nScan Finished. Total unique products discovered: ${discovered.size}`);

    if (discovered.size > 0) {
      console.log('Queuing jobs in Postgres database...');
      let total = 0;
      for (const url of discovered) {
        await pool.query(
          `INSERT INTO scrape_queue (type, payload) 
           SELECT 'SCRAPE_PRODUCT', $1 
           WHERE NOT EXISTS (SELECT 1 FROM scrape_queue WHERE payload->>'url' = $2 AND status IN ('pending', 'processing'))`,
          [JSON.stringify({ url }), url]
        );
        total++;
      }
      console.log(`Successfully enqueued resources. Scraper worker will now begin processing.`);
    }

  } catch(e: any) {
    console.error('Scan Error:', e.message);
  } finally {
    process.exit(0);
  }
}

scanViaApi();
