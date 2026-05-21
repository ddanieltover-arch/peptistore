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

const BRAND_BLOG_IMAGES = [
  '/blog/storefront-street.png',
  '/blog/igf-1-peptide.png',
  '/blog/reception-lobby.png',
  '/blog/storefront-night.png',
  '/blog/kpv-peptide.png',
  '/blog/custom-peptide-synthesis.png',
  '/blog/storefront-wet-street.png',
  '/blog/reception-wide.png',
];

const BRAND_IMAGE_BY_POST_ID: Record<string, string> = {
  '1cc4a3f1-eafd-486f-8f52-192c58141a7e': '/blog/igf-1-peptide.png',
  'f21bd3b3-48eb-4105-ab08-04b0c6e44e6b': '/blog/custom-peptide-synthesis.png',
  'c603f9c4-cf03-4c33-aac3-9102dcfce2f3': '/blog/kpv-peptide.png',
  '10546e55-2007-400b-abf7-7de3e70d83b5': '/blog/kpv-peptide.png',
  '386f14c2-d1f4-4a99-8cf5-fc1ef530538d': '/blog/reception-wide.png',
};

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash;
}

function isBranded(url: string | null): boolean {
  if (!url) return false;
  return url.includes('/blog/') && !url.includes('unsplash.com');
}

function imagePathForPost(id: string): string {
  if (BRAND_IMAGE_BY_POST_ID[id]) return BRAND_IMAGE_BY_POST_ID[id];
  return BRAND_BLOG_IMAGES[hashId(id) % BRAND_BLOG_IMAGES.length];
}

async function updateBlogImages() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query<{ id: string; title: string; image_url: string | null }>(
      'SELECT id, title, image_url FROM blog_posts ORDER BY created_at ASC',
    );

    for (const post of rows) {
      const imagePath = imagePathForPost(post.id);
      const imageUrl = siteUrl + imagePath;

      if (isBranded(post.image_url) && post.image_url === imageUrl) {
        console.log('Skipped (already set):', post.title);
        continue;
      }

      const { rows: updated } = await client.query(
        `UPDATE blog_posts SET image_url = $1 WHERE id = $2 RETURNING id, title, image_url`,
        [imageUrl, post.id],
      );
      console.log('Updated:', updated[0].title);
      console.log('  →', updated[0].image_url);
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
