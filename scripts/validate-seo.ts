import { existsSync, readFileSync } from 'node:fs';
import {
  DEFAULT_SITE_URL,
  noindexRoutes,
  staticSeoRoutes,
} from '../src/lib/seo';

const requiredFiles = [
  'public/robots.txt',
  'public/sitemap.xml',
  'public/llms.txt',
  'seo/audit_report.json',
  'seo/crawl_inventory.csv',
  'seo/keyword_map.csv',
  'seo/schema_validation_report.json',
  'seo/prerender_manifest.json',
];

const errors: string[] = [];
const warnings: string[] = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) errors.push('Missing required SEO file: ' + file);
}

const titles = new Map<string, string>();
for (const route of staticSeoRoutes) {
  if (!route.title || route.title.length > 70) errors.push('Title issue: ' + route.path);
  if (!route.description || route.description.length < 80 || route.description.length > 170) {
    errors.push('Description issue: ' + route.path);
  }
  if (!route.answer || route.answer.split(/\s+/).length < 20) errors.push('Answer capsule issue: ' + route.path);
  const prior = titles.get(route.title);
  if (prior) errors.push('Duplicate title "' + route.title + '" on ' + prior + ' and ' + route.path);
  else titles.set(route.title, route.path);
}

if (existsSync('public/sitemap.xml')) {
  const sitemap = readFileSync('public/sitemap.xml', 'utf8');
  for (const route of staticSeoRoutes.filter((item) => item.index)) {
    const url = route.path === '/' ? DEFAULT_SITE_URL + '/' : DEFAULT_SITE_URL + route.path;
    if (!sitemap.includes(url)) errors.push('Sitemap missing route: ' + route.path);
  }
  for (const route of noindexRoutes) {
    const url = DEFAULT_SITE_URL + route.path;
    if (sitemap.includes('<loc>' + url + '</loc>')) {
      errors.push('Sitemap must not include noindex route: ' + route.path);
    }
  }
}

if (existsSync('public/robots.txt')) {
  const robots = readFileSync('public/robots.txt', 'utf8');
  if (!robots.includes('Sitemap: ' + DEFAULT_SITE_URL + '/sitemap.xml')) {
    errors.push('robots.txt missing sitemap reference');
  }
  for (const route of noindexRoutes) {
    const segment = route.path.replace(/^\//, '');
    if (segment && !robots.includes('Disallow: /' + segment)) {
      warnings.push('robots.txt may not block private route: ' + route.path);
    }
  }
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Googlebot-Extended']) {
    if (!robots.includes('User-agent: ' + bot)) warnings.push('robots.txt missing AI crawler rule: ' + bot);
  }
}

function extractJsonLd(html: string): unknown[] {
  const items: unknown[] = [];
  const pattern = /<script type=['"]application\/ld\+json['"]>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    try {
      items.push(JSON.parse(match[1]));
    } catch {
      errors.push('Invalid JSON-LD block in prerender HTML');
    }
  }
  return items;
}

function validateSchemaNode(node: unknown, label: string) {
  if (!node || typeof node !== 'object') {
    errors.push('Schema node empty: ' + label);
    return;
  }
  const record = node as Record<string, unknown>;
  if (record['@context'] !== 'https://schema.org') {
    errors.push('Schema missing @context: ' + label);
  }
  if (!record['@type']) errors.push('Schema missing @type: ' + label);
}

if (existsSync('dist/index.html') && existsSync('seo/prerender_manifest.json')) {
  const manifest = JSON.parse(readFileSync('seo/prerender_manifest.json', 'utf8')) as {
    count?: number;
    paths?: string[];
  };
  const paths = manifest.paths || [];
  const expectedStatic = staticSeoRoutes.filter((r) => r.index).length;
  if (!manifest.count || manifest.count < expectedStatic + 5) {
    errors.push('Prerender manifest too small: ' + String(manifest.count || 0));
  }
  for (const route of staticSeoRoutes.filter((r) => r.index)) {
    if (!paths.includes(route.path)) errors.push('Prerender manifest missing static route: ' + route.path);
  }
  for (const route of noindexRoutes) {
    if (!paths.includes(route.path)) errors.push('Prerender manifest missing noindex route: ' + route.path);
  }

  const samplePaths = [
    '/',
    '/shop',
    '/peptide-research',
    '/contact',
    '/login',
    '/admin',
    ...paths.filter((path) => path.startsWith('/product/')).slice(0, 1),
    ...paths.filter((path) => path.startsWith('/blog/')).slice(0, 1),
    ...noindexRoutes.slice(0, 2).map((r) => r.path),
  ].filter((path, index, all) => all.indexOf(path) === index);

  for (const path of samplePaths) {
    const file = path === '/' ? 'dist/index.html' : 'dist' + path.replace(/\/$/, '') + '/index.html';
    if (!existsSync(file)) {
      errors.push('Missing prerender file: ' + file);
      continue;
    }
    const html = readFileSync(file, 'utf8');
    if (!html.includes('seo-prerender')) errors.push('Prerender body missing in: ' + file);
    if (noindexRoutes.some((route) => route.path === path)) {
      if (!html.includes('noindex')) errors.push('Private route missing noindex robots: ' + file);
    } else if (!html.includes('application/ld+json')) {
      errors.push('Prerender JSON-LD missing in: ' + file);
    }
    extractJsonLd(html).forEach((node, index) => validateSchemaNode(node, file + ' #' + index));
  }
}

if (existsSync('seo/schema_validation_report.json')) {
  const report = JSON.parse(readFileSync('seo/schema_validation_report.json', 'utf8')) as {
    localValidation?: { errors?: string[] };
  };
  if (report.localValidation?.errors?.length) {
    report.localValidation.errors.forEach((item) => errors.push('Schema report: ' + item));
  }
}

if (warnings.length) console.warn(warnings.join('\n'));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(
  'SEO validation passed for ' +
    staticSeoRoutes.length +
    ' static routes, ' +
    noindexRoutes.length +
    ' noindex routes.',
);
