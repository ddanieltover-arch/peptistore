/**
 * Resize and encode brand raster assets as WebP for smaller bundles.
 * Run: npx tsx scripts/optimize-brand-images.ts
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRAND_DIR = path.join(__dirname, '..', 'src', 'assets', 'brand');
const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 82;

async function main() {
  const files = await fs.readdir(BRAND_DIR);
  const pngs = files.filter((f) => f.endsWith('.png'));

  if (pngs.length === 0) {
    console.log('No PNG files found in brand folder.');
    return;
  }

  for (const file of pngs) {
    const inputPath = path.join(BRAND_DIR, file);
    const outputPath = path.join(BRAND_DIR, file.replace(/\.png$/i, '.webp'));

    let pipeline = sharp(inputPath).rotate(); // normalize EXIF orientation
    const meta = await sharp(inputPath).metadata();
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

    await pipeline.webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(outputPath);

    const inStat = await fs.stat(inputPath);
    const outStat = await fs.stat(outputPath);
    const saved = (((inStat.size - outStat.size) / inStat.size) * 100).toFixed(1);
    console.log(`${file} → ${path.basename(outputPath)} (${(inStat.size / 1024).toFixed(0)} kB → ${(outStat.size / 1024).toFixed(0)} kB, −${saved}%)`);

    await fs.unlink(inputPath);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
