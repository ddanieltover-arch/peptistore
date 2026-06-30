/**
 * Insert content-calendar SEO articles into blog_posts.
 * Skips titles that already exist; skips KPV calendar item if overview post exists.
 *
 * Usage: npm run db:insert-content-calendar
 */
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTENT_CALENDAR_POSTS } from '../data/contentCalendarPosts';
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

async function titleExists(client: pg.PoolClient, title: string, prefix?: string) {
  if (prefix) {
    const { rows } = await client.query(
      `SELECT id, title FROM blog_posts WHERE title ILIKE $1 LIMIT 1`,
      [prefix + '%'],
    );
    return rows[0] as { id: string; title: string } | undefined;
  }
  const { rows } = await client.query(`SELECT id, title FROM blog_posts WHERE title = $1 LIMIT 1`, [title]);
  return rows[0] as { id: string; title: string } | undefined;
}

async function main() {
  const client = await pool.connect();
  const inserted: Array<{ id: string; title: string; slug?: string }> = [];
  const skipped: string[] = [];

  try {
    // Calendar item 4 — KPV overview already published
    const kpvExisting = await titleExists(client, '', 'KPV Peptide Research Overview');
    if (kpvExisting) {
      skipped.push(`KPV (existing: ${kpvExisting.title})`);
    } else {
      skipped.push('KPV (no existing post — add manually if needed)');
    }

    for (const post of CONTENT_CALENDAR_POSTS) {
      const dup = await titleExists(client, post.title, post.skipIfTitleStartsWith);
      if (dup) {
        skipped.push(`${post.title} (existing: ${dup.title})`);
        continue;
      }

      const imageUrl = post.imagePath.startsWith('http') ? post.imagePath : SITE + post.imagePath;
      const slug = await allocateBlogSlug(client, post.title);
      const { rows } = await client.query(
        `INSERT INTO blog_posts (title, slug, content, image_url, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id, title, slug, created_at`,
        [post.title, slug, post.content.trim(), imageUrl],
      );
      inserted.push(rows[0]);
      console.log('Inserted:', rows[0].id, '—', rows[0].title);
    }

    console.log('\nSummary');
    console.log({ inserted: inserted.length, skipped: skipped.length });
    if (skipped.length) console.log('Skipped:', skipped);
    if (inserted.length) {
      console.log('\nNew URLs:');
      inserted.forEach((p) => console.log(`  ${SITE}/blog/${p.slug || p.id}`));
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
