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
  ssl: { rejectUnauthorized: false },
});

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://www.researchpeptide.uk').replace(/\/+$/, '');

/** Post ID → branded image from public/blog (matched to article topic). */
const BLOG_IMAGE_MAP: Record<string, string> = {
  '1cc4a3f1-eafd-486f-8f52-192c58141a7e': '/blog/igf-1-peptide.png',
  'f21bd3b3-48eb-4105-ab08-04b0c6e44e6b': '/blog/custom-peptide-synthesis.png',
  'c603f9c4-cf03-4c33-aac3-9102dcfce2f3': '/blog/kpv-peptide.png',
};

async function updateBlogImages() {
  const client = await pool.connect();
  try {
    for (const [id, imagePath] of Object.entries(BLOG_IMAGE_MAP)) {
      const imageUrl = siteUrl + imagePath;
      const { rows } = await client.query(
        `UPDATE blog_posts SET image_url = $1 WHERE id = $2 RETURNING id, title, image_url`,
        [imageUrl, id],
      );
      if (rows[0]) {
        console.log('Updated:', rows[0].title);
        console.log('  →', rows[0].image_url);
      } else {
        console.warn('No post found for id:', id);
      }
    }
  } catch (error) {
    console.error('Error updating blog images:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

updateBlogImages();
