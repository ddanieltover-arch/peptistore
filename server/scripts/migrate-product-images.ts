/**
 * Download product images → optimize as WebP → Supabase Storage (products bucket) → update DB.
 *
 * Usage:
 *   npx tsx server/scripts/migrate-product-images.ts
 *   npx tsx server/scripts/migrate-product-images.ts --dry-run
 *   npx tsx server/scripts/migrate-product-images.ts --limit 5
 *   npx tsx server/scripts/migrate-product-images.ts --legacy-only   # re-encode legacy Supabase JPEGs/PNGs
 */
import sharp from 'sharp';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { slugifyProductName } from '../../src/lib/productUrl';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env'), override: false });

const BUCKET = 'products';
const MAX_DIMENSION = 1200;
const WEBP_QUALITY = 82;
const dryRun = process.argv.includes('--dry-run');
const legacyOnly = process.argv.includes('--legacy-only');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);
const scraperApiKey = process.env.SCRAPERAPI_KEY?.trim();

type ProductRow = {
  id: string;
  slug?: string | null;
  title?: string | null;
  images?: string[] | null;
};

function storageKey(slug: string, index: number) {
  return `catalog/${slug}/${index}.webp`;
}

function isHostedOnSupabase(url: string) {
  try {
    const host = new URL(supabaseUrl!).host;
    return url.includes(host) && url.includes(`/storage/v1/object/public/${BUCKET}/`);
  } catch {
    return false;
  }
}

function fileSlug(product: ProductRow) {
  const slug = product.slug?.trim() || slugifyProductName(String(product.title || 'product'));
  return slug || String(product.id);
}

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  if (buckets?.some((b) => b.name === BUCKET)) return;
  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  });
  if (createError) throw createError;
  console.log(`Created public storage bucket "${BUCKET}".`);
}

async function downloadImage(sourceUrl: string): Promise<Buffer> {
  const tryFetch = async (url: string) => {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ResearchPeptidesUK-ImageMigration/1.0' },
      signal: AbortSignal.timeout(90_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  };

  try {
    return await tryFetch(sourceUrl);
  } catch (directError) {
    if (!scraperApiKey) throw directError;
    const proxyUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(sourceUrl)}`;
    return await tryFetch(proxyUrl);
  }
}

async function optimizeWebp(input: Buffer): Promise<Buffer> {
  let pipeline = sharp(input).rotate();
  const meta = await sharp(input).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (w && h && Math.max(w, h) > MAX_DIMENSION) {
    pipeline = pipeline.resize({
      width: w >= h ? MAX_DIMENSION : undefined,
      height: h > w ? MAX_DIMENSION : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }
  return pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
}

async function uploadWebp(key: string, body: Buffer): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(key, body, {
    contentType: 'image/webp',
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

function isCatalogWebp(url: string) {
  return isHostedOnSupabase(url) && url.includes('/catalog/') && /\.webp(\?|$)/i.test(url);
}

/** COA scans in the images array are not product photos — skip re-encoding. */
function isCoaAsset(url: string) {
  return /\/COA-/i.test(url) || /\/coa[-_]/i.test(url);
}

function needsImageMigration(images: string[]) {
  if (images.some(isCatalogWebp)) return false;
  return images.some((url) => !isCoaAsset(url));
}

async function migrateProduct(product: ProductRow): Promise<'skipped' | 'updated' | 'failed'> {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  if (images.length === 0) {
    console.log(`  skip (no images): ${product.title}`);
    return 'skipped';
  }

  if (!needsImageMigration(images)) {
    console.log(`  skip (catalog WebP): ${product.title}`);
    return 'skipped';
  }

  const slug = fileSlug(product);
  const nextUrls: string[] = [];
  let changed = false;

  for (let i = 0; i < images.length; i++) {
    const source = images[i]!;

    if (isCatalogWebp(source)) {
      nextUrls.push(source);
      continue;
    }

    if (isCoaAsset(source)) {
      nextUrls.push(source);
      continue;
    }

    const key = storageKey(slug, i);
    const label = isHostedOnSupabase(source) ? 'legacy Supabase' : 'external';
    console.log(`  [${i + 1}/${images.length}] (${label}) ${source.slice(0, 90)}…`);
    changed = true;

    if (dryRun) {
      nextUrls.push(`(dry-run) ${key}`);
      continue;
    }

    try {
      const raw = await downloadImage(source);
      const webp = await optimizeWebp(raw);
      const publicUrl = await uploadWebp(key, webp);
      nextUrls.push(publicUrl);
      console.log(`    → ${publicUrl} (${(webp.length / 1024).toFixed(1)} KiB)`);
    } catch (error) {
      console.error(`    failed:`, error instanceof Error ? error.message : error);
      nextUrls.push(source);
    }
  }

  if (!changed) return 'skipped';
  if (dryRun) return 'updated';

  const { error } = await supabase.from('products').update({ images: nextUrls }).eq('id', product.id);
  if (error) {
    console.error(`  DB update failed:`, error.message);
    return 'failed';
  }
  return 'updated';
}

async function main() {
  console.log(`Product image migration → Supabase Storage (${dryRun ? 'DRY RUN' : 'LIVE'})`);
  if (!dryRun) await ensureBucket();

  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, title, images')
    .order('title');

  if (error) throw error;
  const rows = (products ?? []) as ProductRow[];
  const filtered = legacyOnly
    ? rows.filter((p) => {
        const images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
        return images.length > 0 && images.some((url) => isHostedOnSupabase(url) && !isCatalogWebp(url));
      })
    : rows.filter((p) => {
        const images = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
        return images.length > 0 && needsImageMigration(images);
      });
  const queue = typeof limit === 'number' ? filtered.slice(0, limit) : filtered;

  console.log(`Processing ${queue.length} of ${rows.length} products (${filtered.length} need migration)…\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of queue) {
    console.log(`${product.title} (${product.id})`);
    const result = await migrateProduct(product);
    if (result === 'updated') updated += 1;
    else if (result === 'skipped') skipped += 1;
    else failed += 1;
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log('\nDone.');
  console.log({ updated, skipped, failed, total: queue.length });
  if (dryRun) console.log('Re-run without --dry-run to apply uploads and DB updates.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
