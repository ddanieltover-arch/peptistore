import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: 'server/.env', override: false });

import {
  BRAND_EMAIL,
  BRAND_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_SITE_URL,
  SEO_REVISED_DATE,
  absoluteUrl,
  assetUrl,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildOrganizationJsonLd,
  buildProductJsonLd,
  buildWebsiteJsonLd,
  excerpt,
  seedKeywords,
  slugify,
  staticSeoRoutes,
  noindexRoutes,
} from '../src/lib/seo';
import { resolveBlogImagePath } from '../src/lib/blogImages';
import { getBlogEnhancement } from '../src/lib/blogEnhancements';
import { getProductSeoEnhancement, productSeoTitle } from '../src/lib/productSeoEnhancements';
import { geoCommonQuestions, pillarBlogSlugs } from '../src/lib/geoContent';

type ProductRow = { id?: string; slug?: string | null; title?: string | null; description?: string | null; price?: number | null; images?: string[] | null; categories?: string[] | null; inventory?: number | null; created_at?: string | null };
type BlogRow = { id?: string; slug?: string | null; title?: string | null; content?: string | null; image_url?: string | null; created_at?: string | null; updated_at?: string | null };

const dq = String.fromCharCode(34);
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
const today = SEO_REVISED_DATE;
const writeDist = process.argv.includes('--dist');

const fallbackProducts: ProductRow[] = [
  product('semaglutide-peptide-uk', 'Semaglutide Peptide', 'Research-use GLP pathway peptide listing for non-clinical laboratory workflows.', ['GLP Peptides']),
  product('ghrp-2-peptide', 'GHRP-2 Peptide', 'Research-use GHRP peptide listing for controlled peptide research workflows.', ['GHRP Peptides']),
  product('kpv-peptide', 'KPV Peptide', 'Research-use KPV peptide listing for inflammatory pathway and peptide science research.', ['KPV Peptides']),
  product('igf-1-peptide', 'IGF-1 Peptide', 'Research-use IGF axis peptide listing for laboratory research contexts.', ['IGF Peptides']),
];

function product(slug: string, title: string, description: string, categories: string[]): ProductRow {
  return { id: slug, slug, title, description, price: 0, images: [], categories, inventory: 1, created_at: today };
}
function ensureDir(path: string) { mkdirSync(path, { recursive: true }); }
function write(path: string, content: string) { ensureDir(dirname(path)); writeFileSync(path, content, 'utf8'); }
function csvCell(value: unknown) { const text = String(value ?? '').replace(/\r?\n/g, ' ').trim(); return text.includes(',') || text.includes(dq) ? dq + text.split(dq).join(dq + dq) + dq : text; }
function csv(rows: unknown[][]) { return rows.map((row) => row.map(csvCell).join(',')).join('\n') + '\n'; }
function xmlEscape(value: unknown) { return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;'); }
function htmlEscape(value: unknown) { return xmlEscape(value).replace(/\n/g, ' '); }

async function supabaseRows<T>(table: string, select: string, order = 'created_at.desc.nullslast'): Promise<T[]> {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (process.env.SEO_FETCH_REMOTE === 'false') return [];
  if (!url || !key) return [];
  const endpoint = url.replace(/\/+$/, '') + '/rest/v1/' + table + '?select=' + encodeURIComponent(select) + '&order=' + order;
  try {
    const res = await fetch(endpoint, { headers: { apikey: key, Authorization: 'Bearer ' + key } });
    if (!res.ok) {
      console.warn(`[SEO] Supabase ${table} fetch failed (${res.status}): ${(await res.text()).slice(0, 120)}`);
      return [];
    }
    return (await res.json()) as T[];
  } catch (error) {
    console.warn(`[SEO] Supabase ${table} fetch error:`, error instanceof Error ? error.message : error);
    return [];
  }
}
function productPath(item: ProductRow) { return '/product/' + (item.slug || slugify(item.title || 'product')); }
function blogPath(item: BlogRow) { return '/blog/' + (item.slug || item.id || slugify(item.title || 'article')); }
function routes(products: ProductRow[], posts: BlogRow[]) { return [...staticSeoRoutes.filter((r) => r.index).map((r) => ({ path: r.path, priority: r.priority, changefreq: r.changefreq, lastmod: r.revised })), ...products.map((p) => ({ path: productPath(p), priority: 0.8, changefreq: 'weekly', lastmod: p.created_at || today })), ...posts.map((p) => ({ path: blogPath(p), priority: 0.7, changefreq: 'monthly', lastmod: p.updated_at || p.created_at || today }))]; }

function sitemapXml(products: ProductRow[], posts: BlogRow[]) {
  const body = routes(products, posts).map((item) => ['  <url>', '    <loc>' + xmlEscape(absoluteUrl(item.path, siteUrl)) + '</loc>', '    <lastmod>' + xmlEscape(new Date(item.lastmod).toISOString().slice(0, 10)) + '</lastmod>', '    <changefreq>' + item.changefreq + '</changefreq>', '    <priority>' + item.priority + '</priority>', '  </url>'].join('\n')).join('\n');
  return '<?xml version=\'1.0\' encoding=\'UTF-8\'?>\n<urlset xmlns=\'http://www.sitemaps.org/schemas/sitemap/0.9\'>\n' + body + '\n</urlset>\n';
}
function robotsTxt() { return ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /checkout', 'Disallow: /cart', 'Disallow: /profile', 'Disallow: /orders', 'Disallow: /wishlist', 'Disallow: /login', 'Disallow: /search?', 'Disallow: /api/', 'Disallow: /*.json$', '', 'User-agent: GPTBot', 'Allow: /', '', 'User-agent: ChatGPT-User', 'Allow: /', '', 'User-agent: ClaudeBot', 'Allow: /', '', 'User-agent: PerplexityBot', 'Allow: /', '', 'User-agent: Googlebot-Extended', 'Allow: /', '', 'User-agent: CCBot', 'Allow: /', '', 'Sitemap: ' + siteUrl + '/sitemap.xml', ''].join('\n'); }
function llmsLink(path: string, label: string, note?: string) {
  const url = absoluteUrl(path, siteUrl);
  const link = '[' + label + '](' + url + ')';
  return '- ' + (note ? link + ': ' + note : link);
}

function llmsTxt(products: ProductRow[], posts: BlogRow[]) {
  const pillarSet = new Set<string>(pillarBlogSlugs);
  const pillarPosts = posts.filter((p) => pillarSet.has(String(p.slug || '')));
  const otherPosts = posts.filter((p) => !pillarSet.has(String(p.slug || '')));
  const geoAnswers = staticSeoRoutes
    .filter((r) => r.index)
    .slice(0, 10)
    .map((r) => '- **' + r.primaryKeyword + '** (' + r.path + '): ' + r.answer.split(/\s+/).slice(0, 55).join(' ') + '…');

  const lines = [
    '# ' + BRAND_NAME,
    '',
    '> Research-grade peptide catalog and education hub for laboratory research workflows in the UK and globally.',
    '',
    BRAND_NAME + ' supplies research-use-only peptide compounds, documentation references, and educational resources for qualified laboratory contexts. Products are not for human or veterinary use.',
    '',
    '## Key Pages',
    ...staticSeoRoutes
      .filter((r) => r.index)
      .map((r) => llmsLink(r.path, r.h1, r.description)),
    '',
    '## GEO Quick Answers',
    ...geoAnswers,
    '',
    '## Common Questions',
    ...geoCommonQuestions.map((item) => '- **' + item.q + '** ' + item.a),
    '',
    '## Primary Topics',
    ...seedKeywords.map((k) => '- ' + k),
    '',
    '## Pillar Articles',
    ...pillarPosts.map((p) => llmsLink(blogPath(p), p.title || 'Peptide research article')),
    '',
    '## Product Examples',
    ...products
      .slice(0, 30)
      .map((p) => llmsLink(productPath(p), p.title || 'Research peptide')),
    '',
    '## Research Articles',
    ...otherPosts
      .slice(0, 15)
      .map((p) => llmsLink(blogPath(p), p.title || 'Peptide research article')),
    '',
    '## Contact',
    '- Email: [' + BRAND_EMAIL + '](mailto:' + BRAND_EMAIL + ')',
    llmsLink('/terms', 'Research-use-only policy'),
    llmsLink('/faq', 'Research peptides FAQ hub'),
    '- [XML Sitemap](' + siteUrl + '/sitemap.xml)',
    '',
  ];
  return lines.join('\n');
}

function keywordMap() {
  return csv([
    ['Keyword', 'Volume', 'Difficulty', 'Intent', 'Assigned Page URL', 'Page Type', 'Gap (Y/N)', 'Priority'],
    ['research peptides', '', '', 'Commercial', '/', 'Homepage', 'N', 'High'],
    ['research peptides uk', '590', '30', 'Commercial', '/', 'Homepage', 'N', 'High'],
    ['peptides buy uk', '', '', 'Transactional', '/shop', 'Product Listing', 'N', 'High'],
    ['buy peptides uk', '1600', '53', 'Transactional', '/shop', 'Product Listing', 'N', 'High'],
    ['buy peptides online', '480', '51', 'Transactional', '/shop', 'Product Listing', 'N', 'High'],
    ['peptide buy', '170', '38', 'Informational, Transactional', '/shop', 'Product Listing', 'N', 'High'],
    ['peptides shop', '140', '53', 'Commercial', '/shop', 'Product Listing', 'N', 'High'],
    ['uk research peptides', '', '', 'Commercial', '/categories', 'Category Hub', 'N', 'High'],
    ['semaglutide peptide uk', '', '', 'Commercial', '/product/semaglutide', 'Product Page', 'N', 'High'],
    ['tirzepatide', '', '', 'Commercial', '/product/tirzepatide', 'Product Page', 'N', 'High'],
    ['peptide research uk', '90', '37', 'Informational', '/peptide-research', 'Guide', 'N', 'High'],
    ['peptide research', '140', '57', 'Informational', '/peptide-research', 'Guide', 'N', 'Medium'],
    ['peptide science uk', '170', '44', 'Informational', '/peptide-research', 'Guide', 'N', 'Medium'],
    ['glp-3', '', '', 'Informational', '/peptide-research', 'Guide', 'Y', 'Medium'],
    ['buy ghrp 2', '', '', 'Transactional', '/product/ghrp-2-acetate', 'Product Page', 'N', 'High'],
    ['ghrp-2', '590', '31', 'Informational', '/product/ghrp-2-acetate', 'Product Page', 'N', 'High'],
    ['peptides buy', '', '', 'Transactional', '/shop', 'Product Listing', 'N', 'High'],
    ['kpv peptide', '3600', '18', 'Informational', '/product/kpv', 'Product Page', 'N', 'High'],
    ['igf-1 peptide', '', '', 'Commercial', '/product/igf-1-1-3-1mg', 'Product Page', 'N', 'High'],
    ['igf-1 lr3', '1900', '38', 'Informational', '/product/igf-1-lr3', 'Product Page', 'N', 'High'],
    ['igf-1 des', '90', '17', 'Informational', '/product/igf-des', 'Product Page', 'N', 'Medium'],
    ['bacteriostatic water', '6600', '31', 'Informational', '/product/bacteriostatic-water', 'Product Page', 'N', 'High'],
    ['hospira bacteriostatic water', '880', '15', 'Informational', '/product/bacteriostatic-water-0-9-benzyl-alcohol-10ml-hospira-injection-usp', 'Product Page', 'N', 'High'],
    ['glow peptide', '4400', '16', 'Informational', '/product/glow-blend-ghk-cu-bpc157-tb500', 'Product Page', 'N', 'High'],
    ['cjc 1295 ipamorelin', '2900', '29', 'Informational', '/product/cjc-1295-no-dac-5mg-ipamorelin-5mg-10mg-total-peptide-blend', 'Product Page', 'N', 'High'],
    ['cjc 1295 dac', '480', '11', 'Informational', '/product/cjc-1295-with-dac', 'Product Page', 'N', 'High'],
    ['5 amino 1mq', '1600', '14', 'Informational', '/product/5-amino-1mq', 'Product Page', 'N', 'High'],
    ['retatrutide uk buy', '1600', '26', 'Transactional', '/product/retatrutide', 'Product Page', 'N', 'High'],
    ['peptides semax', '1300', '26', 'Informational', '/product/semax', 'Product Page', 'N', 'High'],
    ['bpc157 tb500', '1300', '13', 'Informational', '/product/bpc-10mg-tb-10mg-20mg-peptide-blend', 'Product Page', 'N', 'High'],
    ['follistatin', '1000', '53', 'Informational', '/product/follistatin', 'Product Page', 'N', 'High'],
    ['follistatin 344', '390', '18', 'Informational', '/product/follistatin', 'Product Page', 'N', 'High'],
    ['nad peptide', '1000', '20', 'Informational', '/product/nad-500mg', 'Product Page', 'N', 'High'],
    ['hgh fragment 176-191', '720', '44', 'Informational', '/product/hgh-fragment-176-191', 'Product Page', 'N', 'High'],
    ['peptide testing uk', '210', '18', 'Informational', '/blog/how-uk-laboratories-review-peptide-coa-references', 'Article', 'N', 'Medium'],
    ['oxford peptides', '', '', 'Local/Navigational', '/contact', 'Support/Local Landing', 'Y', 'Medium'],
  ]);
}
function competitorReport() { return csv([['Domain', 'Estimated Traffic', 'Top 5 Ranking Keywords', 'Domain Authority', 'Notes'], ['researchpeptide.co.uk', 'Credential required', 'research peptides; peptides buy uk; uk research peptides; peptide research; buy peptides uk', 'Credential required', 'Historical/source competitor'], ['uk-peptides.com', 'Credential required', 'buy peptides uk; research peptides uk; peptide supplier uk; bpc 157 uk; semaglutide peptide uk', 'Credential required', 'Validate with Ahrefs/SEMrush'], ['oxfordpeptides.com', 'Credential required', 'oxford peptides; custom peptide synthesis; peptide synthesis uk; research peptides', 'Credential required', 'Entity/local competitor'], ['peptidesuk.com', 'Credential required', 'peptides uk; buy peptides; research peptides uk; ghrp 2 peptide', 'Credential required', 'Validate SERP presence'], ['cambridge-research-biochemicals.com', 'Credential required', 'peptide synthesis uk; custom peptides; research peptides; peptide services', 'Credential required', 'Authority competitor']]); }
function crawlInventory(products: ProductRow[], posts: BlogRow[]) { const rows: unknown[][] = [['URL', 'HTTP Status', 'Title Tag', 'Meta Description', 'H1', 'Word Count', 'Canonical Tag', 'Indexability Status', 'Page Type']]; staticSeoRoutes.forEach((r) => rows.push([absoluteUrl(r.path, siteUrl), '200 expected', r.title, r.description, r.h1, r.answer.split(/\s+/).length, absoluteUrl(r.path, siteUrl), 'index, follow', r.pageType])); products.forEach((p) => rows.push([absoluteUrl(productPath(p), siteUrl), '200 expected', (p.title || 'Product') + ' | ' + BRAND_NAME, p.description || 'Research-use peptide product listing.', p.title || 'Research peptide', (p.description || '').split(/\s+/).filter(Boolean).length, absoluteUrl(productPath(p), siteUrl), 'index, follow', 'Product Page'])); posts.forEach((p) => rows.push([absoluteUrl(blogPath(p), siteUrl), '200 expected', (p.title || 'Article') + ' | ' + BRAND_NAME, (p.content || '').slice(0, 155), p.title || 'Peptide research article', (p.content || '').split(/\s+/).filter(Boolean).length, absoluteUrl(blogPath(p), siteUrl), 'index, follow', 'Article'])); return csv(rows); }
function contentBrief(title: string, keyword: string, type: string) { return ['TITLE: ' + title, 'PRIMARY KEYWORD: ' + keyword + ' | volume and difficulty require SEO-tool credentials', 'CONTENT TYPE: ' + type, 'INTENT: Validate against SERP data', 'TARGET WORD COUNT: 1,200-2,500 words', 'ANSWER CAPSULE: Define the query directly in 40-60 words with research-only framing.', 'SUGGESTED H2s:', '- What is ' + keyword + '?', '- How do researchers evaluate this topic?', '- What documentation or COA signals matter?', '- FAQs about ' + keyword, 'SCHEMA TO IMPLEMENT: Article, FAQPage, BreadcrumbList as applicable.', 'INTERNAL LINKS: /shop, /coas, /peptide-guide, /faq, /contact.', 'CTA: Compare research-use catalog options or request batch documentation.', ''].join('\n'); }
function contentCalendar() { return csv([['Publish Date', 'Content Title', 'Content Type', 'Primary Keyword', 'Intent', 'Word Count Target', 'Status'], ['2026-05-19', 'What Are Research Peptides?', 'Guide', 'research peptides', 'Informational', 1800, 'Planned'], ['2026-05-26', 'How to Buy Research Peptides in the UK', 'Landing Page', 'peptides buy uk', 'Transactional', 1400, 'Planned'], ['2026-06-02', 'Semaglutide Peptide UK Research Brief', 'Product Guide', 'semaglutide peptide uk', 'Commercial', 1600, 'Planned'], ['2026-06-09', 'KPV Peptide Research Overview', 'Article', 'kpv peptide', 'Commercial', 1500, 'Planned'], ['2026-06-16', 'IGF-1 Peptide Research Context', 'Article', 'igf-1 peptide', 'Commercial', 1500, 'Planned'], ['2026-06-23', 'GHRP-2 Peptide Buying and Research Notes', 'Product Guide', 'buy ghrp 2', 'Transactional', 1400, 'Planned'], ['2026-06-30', 'Oxford Peptides and UK Research Sourcing', 'Local Landing Page', 'oxford peptides', 'Local', 1200, 'Planned'], ['2026-07-14', 'Semaglutide, the GLP-1 Vial, and the Cagrilintide Blend', 'Article', 'semaglutide listing vs glp-1 vial', 'Informational', 900, 'Published'], ['2026-07-28', 'Tirzepatide Catalogue Listing and the 100mg Vial', 'Article', 'tirzepatide listing vs 100mg vial', 'Informational', 900, 'Published'], ['2026-08-07', 'Semaglutide, Tirzepatide, and Retatrutide as Separate Research Listings', 'Article', 'semaglutide tirzepatide retatrutide listings', 'Informational', 900, 'Published'], ['2026-08-18', 'How UK Laboratories Review Peptide COA References', 'Article', 'peptide testing uk', 'Informational', 900, 'Published'], ['2026-08-28', 'Bacteriostatic Water and Bacteriostatic Saline for Laboratory Dilution', 'Article', 'bacteriostatic water for peptides', 'Informational', 900, 'Published'], ['2026-09-08', 'CJC-1295 with DAC Compared with the No-DAC Ipamorelin Blend', 'Article', 'cjc-1295 dac vs no dac', 'Informational', 900, 'Published'], ['2026-09-18', 'IGF-1 LR3 and IGF-1 DES: Separate Research Listings', 'Article', 'igf-1 lr3 vs des', 'Informational', 900, 'Published'], ['2026-09-29', 'GHK-Cu, BPC-157 and TB-500 in a Glow Research Blend', 'Article', 'ghk-cu bpc-157 tb-500 blend', 'Informational', 900, 'Published'], ['2026-10-08', 'NAD 500mg and NAD 250mg Research Vial Sizes', 'Article', 'nad 500mg vs 250mg', 'Informational', 900, 'Published']]); }
function internalLinks() {
  return csv([
    ['From Page', 'To Page', 'Anchor Text', 'Priority', 'Status'],
    ['/', '/shop', 'buy research peptides UK', 'High', 'Implemented'],
    ['/', '/coas', 'tested peptides COA library', 'High', 'Implemented'],
    ['/', '/peptide-research', 'peptide research UK', 'High', 'Implemented'],
    ['/', '/about-us', 'peptide lab UK', 'High', 'Implemented'],
    ['/shop', '/coas', 'peptide COA library', 'High', 'Implemented'],
    ['/shop', '/faq', 'research peptide storage and shipping FAQ', 'Medium', 'Implemented'],
    ['/shop', '/blog/how-to-buy-research-peptides-in-the-uk', 'how to buy research peptides in the UK', 'High', 'Implemented'],
    ['/shop', '/categories', 'UK research peptide categories', 'High', 'Implemented'],
    ['/peptide-guide', '/peptide-information', 'peptide synthesis and purity information', 'High', 'Implemented'],
    ['/peptide-guide', '/peptide-research', 'peptide research UK briefs', 'High', 'Implemented'],
    ['/peptide-research', '/shop', 'research peptide catalog', 'High', 'Implemented'],
    ['/peptide-research', '/coas', 'tested peptides COA library', 'High', 'Implemented'],
    ['/peptide-research', '/blog/custom-peptide-synthesis-in-the-uk-navigating-quality-and-laboratory-standards', 'custom peptide synthesis in the UK', 'High', 'Implemented'],
    ['/categories', '/peptide-research#glp-3', 'GLP-3 research brief', 'Medium', 'Implemented'],
    ['/peptide-guide', '/blog/custom-peptide-synthesis-in-the-uk-navigating-quality-and-laboratory-standards', 'custom peptide synthesis in the UK', 'High', 'Implemented'],
    ['/peptide-information', '/blog/custom-peptide-synthesis-in-the-uk-navigating-quality-and-laboratory-standards', 'custom peptide synthesis UK guide', 'High', 'Implemented'],
    ['/coas', '/peptide-guide', 'peptide quality verification guide', 'Medium', 'Implemented'],
    ['/coas', '/contact', 'technical support', 'Medium', 'Implemented'],
    ['/about-us', '/shop', 'research peptides UK', 'High', 'Implemented'],
    ['/about-us', '/coas', 'tested peptide batches', 'High', 'Implemented'],
    ['/about-us', '/peptide-research', 'peptide research briefs', 'High', 'Implemented'],
    ['/contact', '/blog/oxford-peptides-and-uk-research-sourcing', 'Oxford peptides and UK research sourcing', 'High', 'Implemented'],
    ['/contact', '/shop', 'research peptide catalog', 'Medium', 'Implemented'],
    ['/peptide-research', '/contact', 'Oxford peptides and UK contact support', 'Medium', 'Implemented'],
    ['/faq', '/contact', 'technical peptide support', 'Medium', 'Implemented'],
    ['/product/*', '/coas', 'peptide COA library', 'High', 'Implemented'],
    ['/product/*', '/peptide-research', 'peptide research UK', 'Medium', 'Implemented'],
    ['/product/*', '/peptide-guide', 'research peptide guide', 'Medium', 'Implemented'],
    ['/product/*', '/shop', 'research peptide catalog', 'Medium', 'Implemented'],
  ]);
}

function stripMarkdown(value: string) {
  return String(value || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_>`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function prerenderDistPath(routePath: string) {
  if (routePath === '/') return 'dist/index.html';
  return join('dist', ...routePath.replace(/^\//, '').split('/'), 'index.html');
}

function stripDefaultHead(template: string) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta name=['"]description['"][^>]*>/gi, '')
    .replace(/<meta name=['"]robots['"][^>]*>/gi, '')
    .replace(/<link rel=['"]canonical['"][^>]*>/gi, '')
    .replace(/<link rel=['"]preload['"][^>]*>/gi, '')
    .replace(/<meta property=['"]og:[^'"]+['"][^>]*>/gi, '')
    .replace(/<meta name=['"]twitter:[^'"]+['"][^>]*>/gi, '');
}

function buildPrerenderHead(options: {
  path: string;
  title: string;
  description: string;
  ogImage: string;
  ogType?: string;
  preloadImage?: string;
  preloadOgImage?: boolean;
  robots?: string;
  jsonLd: unknown[];
}) {
  const canonical = absoluteUrl(options.path, siteUrl);
  const preloadHref = options.preloadImage || (options.preloadOgImage ? options.ogImage : null);
  const robots = options.robots || 'index, follow, max-image-preview:large';
  const tags = [
    '<title>' + htmlEscape(options.title) + '</title>',
    '<meta name=\'description\' content=\'' + htmlEscape(options.description) + '\'>',
    '<meta name=\'robots\' content=\'' + htmlEscape(robots) + '\'>',
    '<link rel=\'canonical\' href=\'' + htmlEscape(canonical) + '\'>',
    ...(preloadHref
      ? ['<link rel=\'preload\' as=\'image\' href=\'' + htmlEscape(preloadHref) + '\' fetchpriority=\'high\'>']
      : []),
    '<meta property=\'og:title\' content=\'' + htmlEscape(options.title) + '\'>',
    '<meta property=\'og:description\' content=\'' + htmlEscape(options.description) + '\'>',
    '<meta property=\'og:url\' content=\'' + htmlEscape(canonical) + '\'>',
    '<meta property=\'og:image\' content=\'' + htmlEscape(options.ogImage) + '\'>',
    '<meta property=\'og:type\' content=\'' + htmlEscape(options.ogType || 'website') + '\'>',
    '<meta property=\'og:site_name\' content=\'' + htmlEscape(BRAND_NAME) + '\'>',
    '<meta name=\'twitter:card\' content=\'summary_large_image\'>',
    '<meta name=\'twitter:title\' content=\'' + htmlEscape(options.title) + '\'>',
    '<meta name=\'twitter:description\' content=\'' + htmlEscape(options.description) + '\'>',
    '<meta name=\'twitter:image\' content=\'' + htmlEscape(options.ogImage) + '\'>',
    ...options.jsonLd.filter(Boolean).map((item) => '<script type=\'application/ld+json\'>' + JSON.stringify(item).replace(/</g, '\u003c') + '</script>'),
  ];
  return tags.join('\n    ');
}

function resetPrerenderRoot(template: string) {
  return template.replace(/<div id=["']root["']>[\s\S]*?<\/div>/i, '<div id="root"></div>');
}

let prerenderTemplate: string | null = null;

function getPrerenderTemplate() {
  if (prerenderTemplate) return prerenderTemplate;
  if (!existsSync('dist/index.html')) return null;
  prerenderTemplate = resetPrerenderRoot(stripDefaultHead(readFileSync('dist/index.html', 'utf8')));
  return prerenderTemplate;
}

function prerenderPage(options: {
  path: string;
  title: string;
  description: string;
  h1: string;
  answer: string;
  ogImage?: string;
  ogType?: string;
  preloadImage?: string;
  preloadOgImage?: boolean;
  robots?: string;
  bodyHtml: string;
  jsonLd: unknown[];
}) {
  const template = getPrerenderTemplate();
  if (!template) return false;
  const ogImage = options.ogImage || assetUrl(DEFAULT_OG_IMAGE, siteUrl);
  const head = buildPrerenderHead({
    path: options.path,
    title: options.title,
    description: options.description,
    ogImage,
    ogType: options.ogType,
    preloadImage: options.preloadImage,
    preloadOgImage: options.preloadOgImage ?? (options.ogType === 'product' || options.ogType === 'article'),
    robots: options.robots,
    jsonLd: options.jsonLd,
  });
  const prerenderHideStyle =
    'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
  const body = [
    '<main id=\'seo-prerender\' style=\'' + prerenderHideStyle + '\'>',
    '<article>',
    '<h1>' + htmlEscape(options.h1) + '</h1>',
    '<section id=\'answer\' aria-label=\'Quick Answer\'>',
    '<p><strong>Quick Answer:</strong> ' + htmlEscape(options.answer) + '</p>',
    '</section>',
    options.bodyHtml,
    '<nav aria-label=\'Related pages\'>',
    '<a href=\'/shop\'>Research peptide catalog</a> ',
    '<a href=\'/coas\'>COA library</a> ',
    '<a href=\'/faq\'>Researcher FAQ</a> ',
    '<a href=\'/blog\'>Peptide research blog</a>',
    '</nav>',
    '</article>',
    '</main>',
  ].join('');
  const html = template
    .replace('</head>', head + '\n  </head>')
    .replace(/<div id=["']root["']>[\s\S]*?<\/div>/i, '<div id="root">' + body + '</div>');
  write(prerenderDistPath(options.path), html);
  return true;
}

function productOgImage(product: ProductRow) {
  const image = Array.isArray(product.images) ? product.images.find(Boolean) : null;
  if (!image) return assetUrl(DEFAULT_OG_IMAGE, siteUrl);
  return /^https?:\/\//i.test(image) ? image : assetUrl(image, siteUrl);
}

function productPrerenderBody(product: ProductRow) {
  const price = Number(product.price || 0);
  const categories = Array.isArray(product.categories) ? product.categories.join(', ') : 'Research peptides';
  const stock = Number(product.inventory || 0) > 0 ? 'In stock for research dispatch' : 'Check availability';
  const hero = productOgImage(product);
  return [
    '<img src=\'' + htmlEscape(hero) + '\' alt=\'' + htmlEscape(product.title || 'Research peptide') + '\' width=\'800\' height=\'800\' fetchpriority=\'high\' loading=\'eager\' decoding=\'sync\'>',
    '<p>' + htmlEscape(product.description || 'Research-use peptide product listing for laboratory workflows.') + '</p>',
    '<ul>',
    '<li><strong>Price:</strong> £' + htmlEscape(price.toFixed(2)) + ' GBP</li>',
    '<li><strong>Category:</strong> ' + htmlEscape(categories) + '</li>',
    '<li><strong>Availability:</strong> ' + htmlEscape(stock) + '</li>',
    '</ul>',
    '<p>Products are supplied for laboratory research use only and are not intended for human or veterinary consumption.</p>',
    '<nav aria-label=\'Related research resources\'>',
    '<a href=\'/coas\'>peptide COA library</a> ',
    '<a href=\'/peptide-research\'>peptide research UK</a> ',
    '<a href=\'/peptide-guide\'>research peptide guide</a> ',
    '<a href=\'/shop\'>research peptide catalog</a>',
    '</nav>',
  ].join('');
}

function blogPrerenderBody(post: BlogRow, enhancement: ReturnType<typeof getBlogEnhancement>) {
  const plain = stripMarkdown(post.content || '');
  const preview = excerpt(plain, enhancement ? 2400 : 1200);
  const faqHtml = enhancement?.faqs.length
    ? [
        '<section id=\'faq\'>',
        '<h2>Frequently asked questions</h2>',
        ...enhancement.faqs.map(
          (item) => '<h3>' + htmlEscape(item.q) + '</h3><p>' + htmlEscape(item.a) + '</p>',
        ),
        '</section>',
      ].join('')
    : '';
  return '<p>' + htmlEscape(preview) + '</p>' + faqHtml;
}

function prerenderStaticRoute(route: (typeof staticSeoRoutes)[number]) {
  const isHome = route.path === '/';
  const heroImage = assetUrl('/hero-catalog.webp', siteUrl);
  const bodyHtml = isHome
    ? [
        '<img id=\'home-hero-lcp\' src=\'' + htmlEscape(heroImage) + '\' alt=\'Research Peptides laboratory catalog\' width=\'640\' height=\'640\' fetchpriority=\'high\' loading=\'eager\' decoding=\'sync\'>',
        '<p>' + htmlEscape(route.description) + '</p>',
      ].join('')
    : '<p>' + htmlEscape(route.description) + '</p>';

  return prerenderPage({
    path: route.path,
    title: route.title,
    description: route.description,
    h1: route.h1,
    answer: route.answer,
    ogImage: isHome ? heroImage : undefined,
    preloadImage: isHome ? heroImage : undefined,
    bodyHtml,
    jsonLd: [
      buildOrganizationJsonLd(siteUrl),
      buildWebsiteJsonLd(siteUrl),
      buildBreadcrumbJsonLd(route.path, route.title, siteUrl),
    ],
  });
}

function prerenderPrivateRoute(route: (typeof noindexRoutes)[number]) {
  return prerenderPage({
    path: route.path,
    title: route.title,
    description: route.description,
    h1: route.h1,
    answer: route.answer,
    robots: 'noindex, nofollow',
    bodyHtml: '<p>' + htmlEscape(route.description) + '</p>',
    jsonLd: [],
  });
}

function prerenderProduct(product: ProductRow) {
  const path = productPath(product);
  const enhancement = getProductSeoEnhancement(product);
  const title = productSeoTitle(enhancement, product.title || 'Research peptide');
  const description =
    enhancement?.description ||
    excerpt(product.description || 'Research-use peptide product listing for laboratory workflows.', 155);
  const heroImage = productOgImage(product);
  return prerenderPage({
    path,
    title,
    description,
    h1: product.title || 'Research peptide',
    answer:
      enhancement?.answerCapsule ||
      'This research peptide listing is supplied for laboratory use only, with product notes, documentation signals, and UK dispatch options for qualified research buyers.',
    ogImage: heroImage,
    ogType: 'product',
    preloadImage: heroImage,
    bodyHtml: productPrerenderBody(product),
    jsonLd: [
      buildOrganizationJsonLd(siteUrl),
      buildProductJsonLd(product, [], siteUrl),
      buildBreadcrumbJsonLd(path, title, siteUrl),
    ],
  });
}

function prerenderBlogPost(post: BlogRow) {
  const path = blogPath(post);
  const enhancement = getBlogEnhancement(post);
  const title = (post.title || 'Peptide research article') + ' | ' + BRAND_NAME;
  const description = enhancement?.seoDescription || excerpt(stripMarkdown(post.content || post.title || ''), 155);
  const imagePath = resolveBlogImagePath(post);
  const answer = enhancement?.answerCapsule || excerpt(stripMarkdown(post.content || post.title || ''), 60);
  const faqJsonLd = enhancement?.faqs.length ? buildFaqPageJsonLd(enhancement.faqs, siteUrl, path) : null;
  const articlePost = {
    ...post,
    updated_at: enhancement?.revisedDate || post.updated_at || post.created_at,
  };
  return prerenderPage({
    path,
    title,
    description,
    h1: post.title || 'Peptide research article',
    answer,
    ogImage: assetUrl(imagePath, siteUrl),
    ogType: 'article',
    bodyHtml: blogPrerenderBody(post, enhancement),
    jsonLd: [
      buildOrganizationJsonLd(siteUrl),
      buildArticleJsonLd(articlePost, siteUrl),
      buildBreadcrumbJsonLd(path, title, siteUrl),
      faqJsonLd,
    ].filter(Boolean),
  });
}

function validateSchemasLocally(schemas: unknown[]) {
  const errors: string[] = [];
  schemas.forEach((node, index) => {
    if (!node || typeof node !== 'object') {
      errors.push('Schema #' + index + ' is empty');
      return;
    }
    const record = node as Record<string, unknown>;
    if (record['@context'] !== 'https://schema.org') errors.push('Schema #' + index + ' missing schema.org @context');
    if (!record['@type']) errors.push('Schema #' + index + ' missing @type');
    if (record['@type'] === 'Product' && !record.name) errors.push('Product schema #' + index + ' missing name');
    if (record['@type'] === 'BlogPosting' && !record.headline) errors.push('BlogPosting schema #' + index + ' missing headline');
    if (record['@type'] === 'FAQPage' && !Array.isArray(record.mainEntity)) errors.push('FAQPage schema #' + index + ' missing mainEntity');
  });
  return { passed: errors.length === 0, errors };
}

async function main() {
  const fetchedProducts = await supabaseRows<ProductRow>('products', 'id,slug,title,description,price,images,categories,inventory,created_at');
  const fetchedPosts = await supabaseRows<BlogRow>('blog_posts', 'id,slug,title,content,image_url,created_at,updated_at');
  const products = fetchedProducts.length ? fetchedProducts : fallbackProducts;
  const posts = fetchedPosts;
  if (writeDist && posts.length === 0) {
    console.warn('\x1b[33m[SEO WARNING] No blog posts fetched for prerender. Set SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY) in the build environment so blog HTML snapshots are generated.\x1b[0m');
  }

  // Validate blog posts have internal and external links
  posts.forEach((post) => {
    const internalLinks = (post.content || '').match(/\[([^\]]+)\]\(\/([^\)]+)\)/g) || [];
    const externalLinks = (post.content || '').match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g) || [];
    const trueExternalLinks = externalLinks.filter((link) => !link.includes('researchpeptide.uk') && !link.includes('localhost'));

    if (internalLinks.length < 3) {
      console.warn(`\x1b[33m[SEO WARNING] Blog post "${post.title}" (ID: ${post.id}) has only ${internalLinks.length} internal links. Recommended: 3-5 links.\x1b[0m`);
    }
    if (trueExternalLinks.length < 1) {
      console.warn(`\x1b[33m[SEO WARNING] Blog post "${post.title}" (ID: ${post.id}) has no external authority links. Recommended: >=1 link.\x1b[0m`);
    }
  });
  write('public/robots.txt', robotsTxt());
  write('public/sitemap.xml', sitemapXml(products, posts));
  write('public/llms.txt', llmsTxt(products, posts));
  ensureDir('seo/content_briefs');
  write('seo/audit_report.json', JSON.stringify({ generatedAt: new Date().toISOString(), target: siteUrl, stack: 'Vite React SPA with build-time SEO prerender', crawlInventoryCount: routes(products, posts).length, highPriorityFindings: ['Monitor Core Web Vitals on production URLs after prerender deploy.', 'Validate prerender HTML in GSC URL Inspection for product and blog samples.', 'Ahrefs/SEMrush keyword volumes and GBP remain optional follow-ups.'], publicRoutes: staticSeoRoutes.map((r) => ({ path: r.path, title: r.title, indexable: r.index, primaryKeyword: r.primaryKeyword })), dynamicRoutes: { products: products.length, blogPosts: posts.length } }, null, 2));
  write('seo/crawl_inventory.csv', crawlInventory(products, posts));
  if (!existsSync('seo/core_web_vitals_baseline.json')) {
    write('seo/core_web_vitals_baseline.json', JSON.stringify({ generatedAt: new Date().toISOString(), status: 'Requires Lighthouse/PageSpeed execution against deployed or preview URLs', targets: { LCP: '<= 2.5s', INP: '<= 200ms', CLS: '< 0.1' } }, null, 2));
  }
  if (!existsSync('seo/seo_baseline.json')) {
    write('seo/seo_baseline.json', JSON.stringify({ generatedAt: new Date().toISOString(), gsc: 'pending', ga4: 'pending', sitemap: siteUrl + '/sitemap.xml', robots: siteUrl + '/robots.txt', indexedPages: 'pending GSC access', domainAuthority: 'pending Ahrefs/Moz access' }, null, 2));
  }
  write('seo/competitor_report.csv', competitorReport());
  if (!existsSync('seo/keyword_map.csv')) {
    write('seo/keyword_map.csv', keywordMap());
  }
  write('seo/seo_strategy.md', '# SEO + GEO Strategy\n\nTarget: ' + siteUrl + '\n\n## Positioning\n' + BRAND_NAME + ' should rank and be cited for UK research peptide sourcing, laboratory-use peptide education, COA visibility, and research-only compliance guidance.\n\n## Pillars\n- Commercial catalog: /shop, product pages, category hub.\n- Trust: /coas, /about-us, /terms, /privacy, /refund-returns.\n- Education: /peptide-guide, /peptide-information, /peptide-research, /blog.\n- GEO/AEO: quick answers, definitions, FAQ schema, Product schema, Article schema, llms.txt.\n');
  write('seo/internal_linking_plan.csv', internalLinks());
  write('seo/content_calendar.csv', contentCalendar());
  const sampleProductSchemas = products.slice(0, 5).map((p) => buildProductJsonLd(p));
  const sampleArticleSchemas = posts.slice(0, 5).map((p) => buildArticleJsonLd(p));
  const sampleStaticSchemas = [
    buildOrganizationJsonLd(siteUrl),
    buildWebsiteJsonLd(siteUrl),
    buildBreadcrumbJsonLd('/shop', 'Shop', siteUrl),
    buildFaqPageJsonLd([
      { q: 'Who can buy research peptides in the UK?', a: 'Qualified laboratories for non-clinical use only.' },
      { q: 'What documentation should I review?', a: 'COA references and batch purity records.' },
    ]),
  ];
  const localValidation = validateSchemasLocally([
    ...sampleProductSchemas,
    ...sampleArticleSchemas,
    ...sampleStaticSchemas,
  ]);
  write(
    'seo/schema_validation_report.json',
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        status: localValidation.passed
          ? 'Local JSON-LD validation passed; run Google Rich Results Test on live URLs before release.'
          : 'Local JSON-LD validation failed',
        schemasGenerated: ['Organization', 'WebSite', 'BreadcrumbList', 'Product', 'BlogPosting', 'FAQPage'],
        localValidation,
        richResultsTestUrls: [
          siteUrl + '/',
          siteUrl + '/shop',
          siteUrl + '/faq',
          siteUrl + '/product/semaglutide',
          siteUrl + '/blog/custom-peptide-synthesis-in-the-uk-navigating-quality-and-laboratory-standards',
        ],
        sampleProductSchemas,
        sampleArticleSchemas,
      },
      null,
      2,
    ),
  );
  if (!existsSync('seo/geo_content_briefs.md')) {
    write('seo/geo_content_briefs.md', contentBrief('GEO Content Expansion for Research Peptides UK', 'research peptides', 'GEO/AEO Plan'));
  }
  if (!existsSync('seo/analytics_setup.md')) {
    write('seo/analytics_setup.md', '# Analytics Setup\n\nSet VITE_GA4_MEASUREMENT_ID in the deployment environment.\n');
  }
  const preserveSeo = [
    'seo/kpis_dashboard.md',
    'seo/link_gap_opportunities.csv',
    'seo/guest_post_pipeline.csv',
    'seo/link_building_crm.csv',
    'seo/email_templates.md',
    'seo/rank_tracker.csv',
    'seo/gsc_weekly_tracker.csv',
    'seo/ai_citation_log.csv',
    'seo/weekly_monitoring_runbook.md',
    'seo/keyword_map.csv',
    'seo/seo_baseline.json',
  ];
  if (!preserveSeo.every((file) => existsSync(file))) {
    if (!existsSync('seo/kpis_dashboard.md')) {
      write('seo/kpis_dashboard.md', '# KPI Dashboard\n\nSee seo/weekly_monitoring_runbook.md for cadence.\n');
    }
    if (!existsSync('seo/link_gap_opportunities.csv')) {
      write('seo/link_gap_opportunities.csv', csv([['Domain', 'DR', 'Linking to Competitors', 'Opportunity Type'], ['researchpeptide.co.uk', 'pending', 'pending Ahrefs/SEMrush', 'Competitor overlap']]));
    }
    if (!existsSync('seo/guest_post_pipeline.csv')) {
      write('seo/guest_post_pipeline.csv', csv([['Target Site', 'DR', 'Editor Contact', 'Pitch Status', 'Published Link'], ['Lab and biotech publications', 'pending', 'pending prospecting', 'Not started', '']]));
    }
    if (!existsSync('seo/link_building_crm.csv')) {
      write('seo/link_building_crm.csv', csv([['Prospect Domain', 'DR', 'Contact Name', 'Email', 'Outreach Date', 'Follow-up 1 Date', 'Follow-up 2 Date', 'Status', 'Link Acquired (Y/N)', 'Link URL'], ['pending Ahrefs/SEMrush export', '', '', '', '', '', '', 'Pending credentials', 'N', '']]));
    }
    if (!existsSync('seo/email_templates.md')) {
      write('seo/email_templates.md', '# Outreach Email Templates\n\nSee Phase 9 setup.\n');
    }
  }
  write('seo/disavow.txt', '# No toxic backlinks identified from local/public data. Populate only after GSC/Ahrefs/Majestic review.\n');
  [['what-are-research-peptides.md', 'What Are Research Peptides?', 'research peptides', 'Guide'], ['buy-research-peptides-uk.md', 'How to Buy Research Peptides in the UK', 'peptides buy uk', 'Landing Page'], ['semaglutide-peptide-uk.md', 'Semaglutide Peptide UK Research Brief', 'semaglutide peptide uk', 'Product Guide'], ['kpv-peptide.md', 'KPV Peptide Research Overview', 'kpv peptide', 'Article'], ['igf-1-peptide.md', 'IGF-1 Peptide Research Context', 'igf-1 peptide', 'Article']].forEach(([file, title, keyword, type]) => write('seo/content_briefs/' + file, contentBrief(title, keyword, type)));
  let prerenderCount = 0;
  const prerenderManifest: string[] = [];
  if (writeDist) {
    if (!getPrerenderTemplate()) {
      console.warn('Skipping prerender: dist/index.html not found. Run vite build first.');
    } else {
    staticSeoRoutes.filter((r) => r.index).forEach((route) => {
      if (prerenderStaticRoute(route)) {
        prerenderCount += 1;
        prerenderManifest.push(route.path);
      }
    });
    products.forEach((item) => {
      const path = productPath(item);
      if (prerenderProduct(item)) {
        prerenderCount += 1;
        prerenderManifest.push(path);
      }
    });
    posts.forEach((item) => {
      const path = blogPath(item);
      if (prerenderBlogPost(item)) {
        prerenderCount += 1;
        prerenderManifest.push(path);
      }
    });
    noindexRoutes.forEach((route) => {
      if (prerenderPrivateRoute(route)) {
        prerenderCount += 1;
        prerenderManifest.push(route.path);
      }
    });
    write('seo/prerender_manifest.json', JSON.stringify({ generatedAt: new Date().toISOString(), count: prerenderCount, paths: prerenderManifest }, null, 2));
    console.log('Prerendered ' + prerenderCount + ' HTML snapshots into dist/.');
    }
  }
  console.log('SEO/GEO assets generated for ' + siteUrl + ' with ' + products.length + ' product routes and ' + posts.length + ' blog routes.');
}
main().catch((error) => { console.error(error); process.exit(1); });
