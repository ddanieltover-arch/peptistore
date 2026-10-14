/**
 * Refresh keyword-cluster article bodies without changing publish dates.
 * Usage: npx tsx server/scripts/refresh-keyword-cluster-content.ts
 */
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KEYWORD_CLUSTER_POSTS } from '../data/keywordClusterPosts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env'), override: false });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }
  const client = await pool.connect();
  try {
    for (const post of KEYWORD_CLUSTER_POSTS) {
      const { rowCount } = await client.query(
        `UPDATE blog_posts SET content = $1 WHERE slug = $2`,
        [post.content.trim(), post.slug],
      );
      console.log(rowCount, post.slug);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
