import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    console.log('Navigating...');
    // Don't wait for load to finish. Just wait for it to commit then manually delay.
    page.goto('https://researchpeptide.co.uk/product/bpc-157-5mg/', { waitUntil: 'commit' }).catch(() => {});
    await page.waitForTimeout(10000); // 10 seconds should be enough for HTML to appear
  } catch(e) {
    console.warn('Navigation failed', e);
  }
  
  try {
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    fs.writeFileSync('debug.html', html);
    console.log('Saved debug.html, length:', html.length);
  } catch(e) {
    console.error('Failed to get content', e);
  } finally {
    await browser.close();
  }
})();
