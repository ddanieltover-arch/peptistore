import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function syncProducts() {
  const client = await pool.connect();
  try {
    console.log('Starting sync from scrape_products to products...');
    await client.query('BEGIN');

    // Fetch all scraped products along with their category name
    const { rows: scrapedProducts } = await client.query(`
      SELECT 
        sp.id as scrape_id,
        sp.name, 
        sp.description, 
        sp.base_price_gbp, 
        sp.thumbnail_url,
        sc.name as category_name
      FROM scrape_products sp
      LEFT JOIN scrape_categories sc ON sp.category_id = sc.id
    `);

    console.log(`Found ${scrapedProducts.length} scraped products to sync.`);

    // Truncate the existing mock products
    console.log('Clearing existing mock products...');
    await client.query('DELETE FROM products');

    let syncedCount = 0;

    for (const sp of scrapedProducts) {
      // Fetch all images for this product
      const { rows: images } = await client.query(`
        SELECT url FROM scrape_product_images WHERE product_id = $1 ORDER BY position ASC
      `, [sp.scrape_id]);

      let imageUrls = images.map(img => img.url);
      if (imageUrls.length === 0 && sp.thumbnail_url) {
        imageUrls = [sp.thumbnail_url];
      }
      
      const categoriesList = sp.category_name ? [sp.category_name] : ['Peptides'];

      await client.query(`
        INSERT INTO products (
          title, 
          description, 
          price, 
          inventory, 
          images, 
          categories,
          rating,
          review_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        sp.name,
        sp.description || 'Premium Research Peptide',
        sp.base_price_gbp,
        100, // Default inventory
        imageUrls,
        categoriesList,
        5.0, // Default rating
        10   // Default review count
      ]);

      // Mark the item as synced in the scraper table
      await client.query(`
        UPDATE scrape_products SET is_synced = TRUE WHERE id = $1
      `, [sp.scrape_id]);

      syncedCount++;
    }

    await client.query('COMMIT');
    console.log(`Sync complete! Successfully synced ${syncedCount} products to the live store.`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during sync:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

syncProducts();
