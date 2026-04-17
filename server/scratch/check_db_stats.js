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

async function checkStats() {
  try {
    const productsRes = await pool.query('SELECT COUNT(*) FROM scrape_products');
    const categoriesRes = await pool.query('SELECT COUNT(*) FROM scrape_categories');
    const variantsRes = await pool.query('SELECT COUNT(*) FROM scrape_product_variants');
    const queueRes = await pool.query('SELECT status, COUNT(*) FROM scrape_queue GROUP BY status');
    
    console.log('--- Migration Stats ---');
    console.log(`Total Products: ${productsRes.rows[0].count}`);
    console.log(`Total Categories: ${categoriesRes.rows[0].count}`);
    console.log(`Total Product Variants: ${variantsRes.rows[0].count}`);
    console.log('--- Queue Status ---');
    queueRes.rows.forEach(row => {
      console.log(`${row.status}: ${row.count}`);
    });
    
    // List first 5 products as a sample
    const sample = await pool.query('SELECT name, base_price_gbp FROM scrape_products LIMIT 5');
    console.log('--- Sample Products ---');
    sample.rows.forEach(p => console.log(`- ${p.name} (${p.base_price_gbp} GBP)`));

  } catch (error) {
    console.error('Error checking stats:', error);
  } finally {
    await pool.end();
  }
}

checkStats();
