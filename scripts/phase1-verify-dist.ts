import { existsSync, readFileSync } from 'node:fs';

const paths = [
  '/',
  '/shop',
  '/product/semaglutide',
  '/blog/custom-peptide-synthesis-in-the-uk-navigating-quality-and-laboratory-standards',
];

function distFile(path: string) {
  if (path === '/') return 'dist/index.html';
  return 'dist' + path + '/index.html';
}

function extract(html: string) {
  const title = html.match(/<title>([^<]+)/i)?.[1] ?? 'MISSING';
  const desc =
    html.match(/<meta name=['"]description['"] content=['"]([^'"]+)/i)?.[1] ?? 'MISSING';
  const jsonLd = (html.match(/application\/ld\+json/gi) ?? []).length;
  const prerender = html.includes('seo-prerender');
  const h1 = html.match(/<h1[^>]*>([^<]+)/i)?.[1] ?? 'MISSING';
  return { title, desc: desc.slice(0, 90), jsonLd, prerender, h1 };
}

console.log('Phase 1 — Local dist prerender verification\n');
let ok = true;
for (const path of paths) {
  const file = distFile(path);
  if (!existsSync(file)) {
    console.log(path, 'MISSING FILE', file);
    ok = false;
    continue;
  }
  const meta = extract(readFileSync(file, 'utf8'));
  console.log(path);
  console.log('  title:', meta.title);
  console.log('  h1:', meta.h1);
  console.log('  prerender:', meta.prerender);
  console.log('  json-ld:', meta.jsonLd);
  if (!meta.prerender || meta.jsonLd < 1 || meta.title === 'MISSING') ok = false;
  console.log('');
}
process.exit(ok ? 0 : 1);
