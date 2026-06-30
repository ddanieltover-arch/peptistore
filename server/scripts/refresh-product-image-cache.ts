/**
 * Re-upload Supabase Storage product images with long cache headers (1 year).
 * Fixes PSI "Use efficient cache lifetimes" for objects uploaded without cacheControl.
 *
 * Usage:
 *   npx tsx server/scripts/refresh-product-image-cache.ts
 *   npx tsx server/scripts/refresh-product-image-cache.ts --dry-run
 */
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env'), override: false });

const BUCKET = 'products';
const CACHE_CONTROL = '31536000';
const dryRun = process.argv.includes('--dry-run');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

type ListedObject = { name: string; id: string | null; metadata?: { mimetype?: string } | null };

async function listAllKeys(prefix = ''): Promise<string[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: 1000,
    sortBy: { column: 'name', order: 'asc' },
  });
  if (error) throw error;
  if (!data?.length) return [];

  const keys: string[] = [];
  for (const item of data as ListedObject[]) {
    const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
    if (!item.id) {
      keys.push(...(await listAllKeys(itemPath)));
      continue;
    }
    keys.push(itemPath);
  }
  return keys;
}

function guessContentType(key: string, mimetype?: string) {
  if (mimetype) return mimetype;
  if (key.endsWith('.webp')) return 'image/webp';
  if (key.endsWith('.png')) return 'image/png';
  if (key.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

async function refreshKey(key: string) {
  const { data, error } = await supabase.storage.from(BUCKET).download(key);
  if (error || !data) throw error;

  const buffer = Buffer.from(await data.arrayBuffer());
  const contentType = guessContentType(key);

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(key, buffer, {
    contentType,
    upsert: true,
    cacheControl: CACHE_CONTROL,
  });
  if (uploadError) throw uploadError;

  return buffer.length;
}

async function main() {
  console.log(`Refresh product image cache headers (${dryRun ? 'DRY RUN' : 'LIVE'})`);
  const keys = await listAllKeys();
  console.log(`Found ${keys.length} objects in "${BUCKET}" bucket.\n`);

  let ok = 0;
  let failed = 0;

  for (const key of keys) {
    if (dryRun) {
      console.log(`  would refresh: ${key}`);
      ok += 1;
      continue;
    }

    try {
      const bytes = await refreshKey(key);
      console.log(`  ✓ ${key} (${(bytes / 1024).toFixed(1)} KiB, Cache-Control: max-age=${CACHE_CONTROL})`);
      ok += 1;
    } catch (error) {
      console.error(`  ✗ ${key}:`, error instanceof Error ? error.message : error);
      failed += 1;
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log('\nDone.', { ok, failed, total: keys.length });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
