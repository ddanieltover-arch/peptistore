import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function queueFromFile() {
  try {
    const html = fs.readFileSync('shop_dump.html', 'utf-8');
    const matches = html.match(/https:\/\/researchpeptide\.co\.uk\/product\/[a-zA-Z0-9-]+\//g);
    
    if (!matches) {
      console.log('No matches found in file.');
      return;
    }

    const discovered = new Set(matches);
    console.log(`Found ${discovered.size} unique products in shop_dump.html`);

    let injected = 0;
    for (const url of discovered) {
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

    console.log(`Successfully enqueued ${injected} products into the Postgres worker queue.`);
  } catch (e: any) {
    console.error('Error queuing from file:', e);
  } finally {
    process.exit(0);
  }
}

queueFromFile();
