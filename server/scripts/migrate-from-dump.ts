import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrateFromDump() {
  try {
    console.log('Reading shop_dump.html...');
    const html = fs.readFileSync('shop_dump.html', 'utf-8');
    
    // Regex to find product blocks. 
    // Each product seems to be contained in a loop-item div.
    const productBlocks = html.split('data-elementor-type="loop-item"').slice(1);
    console.log(`Found ${productBlocks.length} product blocks in HTML.`);

    let migrated = 0;
    let errors = 0;

    for (const block of productBlocks) {
      try {
        // Extract Product Name and URL
        const titleMatch = block.match(/<span class="product_title[^>]*><a href="([^"]+)">([^<]+)<\/a><\/span>/);
        if (!titleMatch) continue;
        
        const url = titleMatch[1];
        const name = titleMatch[2].replace(/&ndash;/g, '-').replace(/&mdash;/g, '-').trim();

        // Extract Image URL
        const imgMatch = block.match(/<img[^>]*src="([^"]+)"/);
        const imageUrl = imgMatch ? imgMatch[1] : null;

        // Extract Price (we take the first price found)
        const priceMatch = block.match(/<span class="woocommerce-Price-currencySymbol">[^<]*<\/span>([\d,.]+)/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;

        if (!name || price === 0) continue;

        // Upsert into scrape_products
        const productRes = await pool.query(
          `INSERT INTO scrape_products (name, base_price_gbp, source_url, thumbnail_url, description)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (source_url) DO UPDATE SET
             name = EXCLUDED.name,
             base_price_gbp = EXCLUDED.base_price_gbp,
             thumbnail_url = EXCLUDED.thumbnail_url
           RETURNING id`,
          [name, price, url, imageUrl, 'Premium research chemical for laboratory use.']
        );
        const productId = productRes.rows[0].id;

        // Insert Image
        if (imageUrl) {
          await pool.query(
            `INSERT INTO scrape_product_images (product_id, url)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [productId, imageUrl]
          );
        }

        migrated++;
        if (migrated % 10 === 0) console.log(`Migrated ${migrated} products...`);

      } catch (err) {
        errors++;
      }
    }

    console.log(`--- Migration Complete ---`);
    console.log(`Successfully migrated: ${migrated}`);
    console.log(`Errors/Skipped: ${errors}`);

    // Mark corresponding queue items as completed
    await pool.query("UPDATE scrape_queue SET status = 'completed', completed_at = NOW() WHERE status = 'pending' AND type = 'SCRAPE_PRODUCT'");

  } catch (e) {
    console.error('Migration failed:', e);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrateFromDump();
