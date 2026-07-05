const SITE = 'https://www.researchpeptide.uk';

const paths = [
  '/',
  '/shop',
  '/product/semaglutide',
  '/product/tb500-frag',
  '/blog/custom-peptide-synthesis-in-the-uk-navigating-quality-and-laboratory-standards',
];

function extract(html: string) {
  const title = html.match(/<title>([^<]+)/i)?.[1] ?? 'MISSING';
  const desc =
    html.match(/<meta name=["']description["'] content=["']([^"']+)/i)?.[1] ??
    html.match(/<meta name=['"]description['"] content=['"]([^'"]+)/i)?.[1] ??
    'MISSING';
  const canonical = html.match(/<link rel=["']canonical["'] href=["']([^"']+)/i)?.[1] ?? 'MISSING';
  const robots = html.match(/<meta name=["']robots["'] content=["']([^"']+)/i)?.[1] ?? 'MISSING';
  const jsonLd = (html.match(/application\/ld\+json/gi) ?? []).length;
  const prerender = html.includes('seo-prerender');
  const h1 = html.match(/<h1[^>]*>([^<]+)/i)?.[1] ?? 'MISSING';
  return { title, desc: desc.slice(0, 100), canonical, robots, jsonLd, prerender, h1 };
}

async function main() {
  console.log('Phase 1 — Live site verification\n');
  for (const path of paths) {
    const url = SITE + path;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'ResearchPeptidesSEOVerify/1.0' } });
      const html = await res.text();
      const meta = extract(html);
      console.log(path);
      console.log('  status:', res.status);
      console.log('  title:', meta.title);
      console.log('  h1:', meta.h1);
      console.log('  prerender:', meta.prerender);
      console.log('  json-ld blocks:', meta.jsonLd);
      console.log('  robots:', meta.robots);
      console.log('');
    } catch (err) {
      console.log(path, 'ERROR', err instanceof Error ? err.message : err);
    }
  }
}

main();
