import type pg from 'pg';
import { slugify } from '../../src/lib/seo';

/** Allocate a unique blog slug from a title. */
export async function allocateBlogSlug(
  client: pg.PoolClient,
  title: string,
  excludeId?: string | null,
): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const { rows } = await client.query(
      excludeId
        ? `SELECT id FROM blog_posts WHERE slug = $1 AND id <> $2::uuid LIMIT 1`
        : `SELECT id FROM blog_posts WHERE slug = $1 LIMIT 1`,
      excludeId ? [candidate, excludeId] : [candidate],
    );
    if (rows.length === 0) return candidate;
    candidate = `${base.slice(0, 85)}-${suffix++}`;
  }
}
