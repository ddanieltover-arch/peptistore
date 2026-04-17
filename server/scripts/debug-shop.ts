import { chromium } from 'playwright';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

(async () => {
  const proxyOpts = process.env.PROXY_URL && process.env.PROXY_URL.includes('YOUR_API_KEY_HERE') === false
    ? { server: process.env.PROXY_URL } 
    : undefined;

  const browser = await chromium.launch({ headless: true, proxy: proxyOpts });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('Navigating to shop...');
    await page.goto('https://researchpeptide.co.uk/shop/', { waitUntil: 'commit' });
    await page.waitForTimeout(10000);
    const html = await page.content();
    fs.writeFileSync('shop_debug.html', html);
    console.log('Saved shop_debug.html, length:', html.length);
    
    const anchors = await page.$$eval('a', els => els.map(a => ({ href: a.href, text: a.textContent?.trim() })));
    console.log('Found total anchors:', anchors.length);
    const productLinks = anchors.filter(a => a.href.includes('/product/'));
    console.log('Product-like links:', productLinks.slice(0, 10));
    
  } catch(e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
