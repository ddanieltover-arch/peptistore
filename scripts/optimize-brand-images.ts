/**
 * Resize and encode raster assets as WebP for smaller bundles.
 * Run: npm run optimize:brand-images
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets');
const BRAND_DIR = path.join(ASSETS_DIR, 'brand');
const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 82;
const RECOMPRESS_MAX = 1200;
const RECOMPRESS_QUALITY = 78;

async function convertPngToWebp(inputPath: string, outputPath: string, maxDim = MAX_DIMENSION, quality = WEBP_QUALITY) {
  let pipeline = sharp(inputPath).rotate();
  const meta = await sharp(inputPath).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  if (w && h && Math.max(w, h) > maxDim) {
    pipeline = pipeline.resize({
      width: w >= h ? maxDim : undefined,
      height: h > w ? maxDim : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  await pipeline.webp({ quality, effort: 6 }).toFile(outputPath);

  const inStat = await fs.stat(inputPath);
  const outStat = await fs.stat(outputPath);
  const saved = (((inStat.size - outStat.size) / inStat.size) * 100).toFixed(1);
  console.log(
    `${path.basename(inputPath)} → ${path.basename(outputPath)} (${(inStat.size / 1024).toFixed(0)} kB → ${(outStat.size / 1024).toFixed(0)} kB, −${saved}%)`,
  );
}

async function recompressWebp(filePath: string, maxDim = RECOMPRESS_MAX, quality = RECOMPRESS_QUALITY) {
  let pipeline = sharp(filePath).rotate();
  const meta = await sharp(filePath).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  if (w && h && Math.max(w, h) > maxDim) {
    pipeline = pipeline.resize({
      width: w >= h ? maxDim : undefined,
      height: h > w ? maxDim : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const buffer = await pipeline.webp({ quality, effort: 6 }).toBuffer();
  const before = (await fs.stat(filePath)).size;
  await fs.writeFile(filePath, buffer);
  const after = buffer.length;
  const saved = before > 0 ? (((before - after) / before) * 100).toFixed(1) : '0';
  console.log(`${path.basename(filePath)} recompressed (${(before / 1024).toFixed(0)} kB → ${(after / 1024).toFixed(0)} kB, −${saved}%)`);
}

async function main() {
  const heroPng = path.join(ASSETS_DIR, 'hero_bg.png');
  const heroWebp = path.join(ASSETS_DIR, 'hero_bg.webp');
  try {
    await fs.access(heroPng);
    await convertPngToWebp(heroPng, heroWebp, 1600, 76);
    await fs.unlink(heroPng);
  } catch {
    console.log('hero_bg.png not found (already converted).');
  }

  const brandFiles = await fs.readdir(BRAND_DIR);
  const pngs = brandFiles.filter((f) => f.endsWith('.png'));

  for (const file of pngs) {
    const inputPath = path.join(BRAND_DIR, file);
    const outputPath = path.join(BRAND_DIR, file.replace(/\.png$/i, '.webp'));
    await convertPngToWebp(inputPath, outputPath);
    await fs.unlink(inputPath);
  }

  for (const file of brandFiles.filter((f) => f.endsWith('.webp'))) {
    const filePath = path.join(BRAND_DIR, file);
    const stat = await fs.stat(filePath);
    if (stat.size > 180 * 1024) {
      await recompressWebp(filePath);
    }
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
