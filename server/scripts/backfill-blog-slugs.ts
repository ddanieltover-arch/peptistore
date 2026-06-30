/**
 * Backfill blog_posts.slug from titles for rows missing a slug.
 *
 * Usage: npm run db:backfill-blog-slugs
 */
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allocateBlogSlug } from '../lib/blogSlug';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env'), override: false });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query<{ id: string; title: string }>(
      `SELECT id, title FROM blog_posts WHERE slug IS NULL OR trim(slug) = '' ORDER BY created_at ASC`,
    );

    if (rows.length === 0) {
      console.log('All blog posts already have slugs.');
      return;
    }

    console.log(`Backfilling slugs for ${rows.length} post(s)...`);
    for (const row of rows) {
      const slug = await allocateBlogSlug(client, row.title, row.id);
      await client.query(`UPDATE blog_posts SET slug = $1 WHERE id = $2`, [slug, row.id]);
      console.log(`  ${row.id} → /blog/${slug}`);
    }
    console.log('Done.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
