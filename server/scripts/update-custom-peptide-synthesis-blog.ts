import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  CUSTOM_PEPTIDE_SYNTHESIS_BLOG_ID,
  CUSTOM_PEPTIDE_SYNTHESIS_BLOG_SLUG,
  customPeptideSynthesisBlogContent,
} from '../data/customPeptideSynthesisBlog';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? undefined : { rejectUnauthorized: false },
});

async function updatePost() {
  const client = await pool.connect();
  try {
    const bySlug = await client.query(
      `UPDATE blog_posts SET content = $1, updated_at = NOW() WHERE slug = $2 RETURNING id, slug, title, updated_at`,
      [customPeptideSynthesisBlogContent, CUSTOM_PEPTIDE_SYNTHESIS_BLOG_SLUG],
    );

    if (bySlug.rowCount && bySlug.rowCount > 0) {
      console.log('Updated blog post by slug:');
      console.log(bySlug.rows[0]);
      return;
    }

    const byId = await client.query(
      `UPDATE blog_posts SET content = $1, slug = COALESCE(slug, $2), updated_at = NOW() WHERE id = $3 RETURNING id, slug, title, updated_at`,
      [customPeptideSynthesisBlogContent, CUSTOM_PEPTIDE_SYNTHESIS_BLOG_SLUG, CUSTOM_PEPTIDE_SYNTHESIS_BLOG_ID],
    );

    if (byId.rowCount && byId.rowCount > 0) {
      console.log('Updated blog post by id:');
      console.log(byId.rows[0]);
      return;
    }

    console.error('No matching blog post found. Expected slug or id:', CUSTOM_PEPTIDE_SYNTHESIS_BLOG_SLUG, CUSTOM_PEPTIDE_SYNTHESIS_BLOG_ID);
    process.exitCode = 1;
  } catch (error) {
    console.error('Error updating blog post:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

updatePost();
