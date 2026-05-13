import { existsSync, readFileSync } from 'node:fs';
import { staticSeoRoutes } from '../src/lib/seo';

const requiredFiles = [
  'public/robots.txt',
  'public/sitemap.xml',
  'public/llms.txt',
  'seo/audit_report.json',
  'seo/crawl_inventory.csv',
  'seo/keyword_map.csv',
  'seo/schema_validation_report.json',
];

const errors: string[] = [];
for (const file of requiredFiles) {
  if (!existsSync(file)) errors.push('Missing required SEO file: ' + file);
}

for (const route of staticSeoRoutes) {
  if (!route.title || route.title.length > 70) errors.push('Title issue: ' + route.path);
  if (!route.description || route.description.length < 80 || route.description.length > 170) errors.push('Description issue: ' + route.path);
  if (!route.answer || route.answer.split(/\s+/).length < 20) errors.push('Answer capsule issue: ' + route.path);
}

if (existsSync('public/sitemap.xml')) {
  const sitemap = readFileSync('public/sitemap.xml', 'utf8');
  for (const route of staticSeoRoutes.filter((item) => item.index)) {
    if (!sitemap.includes(route.path === '/' ? 'https://www.researchpeptide.uk/' : 'https://www.researchpeptide.uk' + route.path)) {
      errors.push('Sitemap missing route: ' + route.path);
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('SEO validation passed for ' + staticSeoRoutes.length + ' static routes.');
