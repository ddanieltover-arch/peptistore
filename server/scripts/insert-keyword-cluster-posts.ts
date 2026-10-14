/**
 * Insert keyword-cluster research articles with staggered publish dates.
 * Skips a row when the title or slug already exists.
 *
 * Usage: npm run db:insert-keyword-posts
 */
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KEYWORD_CLUSTER_POSTS } from '../data/keywordClusterPosts';
import { allocateBlogSlug } from '../lib/blogSlug';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env'), override: false });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const SITE = 'https://www.researchpeptide.uk';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Posts are in server/data/keywordClusterPosts.ts.');
    process.exit(1);
  }

  const client = await pool.connect();
  const inserted: string[] = [];
  const skipped: string[] = [];

  try {
    for (const post of KEYWORD_CLUSTER_POSTS) {
      const { rows: existing } = await client.query(
        `SELECT id, title, slug FROM blog_posts WHERE title = $1 OR slug = $2 LIMIT 1`,
        [post.title, post.slug],
      );
      if (existing[0]) {
        skipped.push(`${post.title} (existing: ${existing[0].slug || existing[0].id})`);
        continue;
      }

      const allocated = await allocateBlogSlug(client, post.title);
      const slug = allocated === post.slug ? allocated : post.slug;
      if (slug !== allocated) {
        const { rows: slugTaken } = await client.query(
          `SELECT id FROM blog_posts WHERE slug = $1 LIMIT 1`,
          [slug],
        );
        if (slugTaken[0]) {
          throw new Error(`Planned slug already taken: ${slug}`);
        }
      }
      const imageUrl = post.imagePath.startsWith('http') ? post.imagePath : SITE + post.imagePath;
      const publishedAt = new Date(post.publishedAt);
      if (Number.isNaN(publishedAt.getTime())) {
        throw new Error('Invalid publishedAt for ' + post.title);
      }

      const { rows } = await client.query(
        `INSERT INTO blog_posts (title, slug, content, image_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $5)
         RETURNING slug, created_at`,
        [post.title, slug, post.content.trim(), imageUrl, publishedAt.toISOString()],
      );
      if (rows[0].slug !== post.slug) {
        console.warn('Slug differed from planned slug:', post.slug, '->', rows[0].slug);
      }
      inserted.push(`${rows[0].created_at}  ${SITE}/blog/${rows[0].slug}`);
      console.log('Inserted', rows[0].slug);
    }

    console.log('\nSummary', { inserted: inserted.length, skipped: skipped.length });
    if (skipped.length) console.log('Skipped:\n' + skipped.join('\n'));
    if (inserted.length) console.log('\nPublished:\n' + inserted.join('\n'));
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
