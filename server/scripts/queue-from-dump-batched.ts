import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function queueFromFile() {
  console.log('Initiating Batched Database Injection...');
  try {
    const html = fs.readFileSync('shop_dump.html', 'utf-8');
    const matches = html.match(/https:\/\/researchpeptide\.co\.uk\/product\/[a-zA-Z0-9-]+\//g);
    
    if (!matches) {
      console.log('No matches found in file.');
      return;
    }

    const discovered = Array.from(new Set(matches));
    console.log(`Found ${discovered.length} unique products in shop_dump.html`);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      console.log('Transaction started...');

      let inserted = 0;
      for (const url of discovered) {
        // We use an UPSERT-like logic to avoid duplicates in the queue
        const res = await client.query(
          `INSERT INTO scrape_queue (type, payload) 
           SELECT 'SCRAPE_PRODUCT', $1 
           WHERE NOT EXISTS (SELECT 1 FROM scrape_queue WHERE payload->>'url' = $2 AND status IN ('pending', 'processing'))`,
          [JSON.stringify({ url }), url]
        );
        if (res.rowCount && res.rowCount > 0) inserted++;
      }

      await client.query('COMMIT');
      console.log(`Successfully enqueued ${inserted} products into the queue table via transaction.`);
    } catch (dbErr) {
      await client.query('ROLLBACK');
      throw dbErr;
    } finally {
      client.release();
    }

  } catch (e: any) {
    console.error('CRITICAL ERROR DURING QUEUEING:', e);
  } finally {
    process.exit(0);
  }
}

queueFromFile();
