export const DEFAULT_SITE_URL = 'https://www.researchpeptide.uk';
export const BRAND_NAME = 'Research Peptides UK';
export const BRAND_EMAIL = 'info@researchpeptide.uk';
export const DEFAULT_OG_IMAGE = '/og-image.png';
export const SEO_REVISED_DATE = '2026-05-12';

export type SeoPageType =
  | 'Homepage'
  | 'Product Listing'
  | 'Product Page'
  | 'Category Hub'
  | 'Blog Hub'
  | 'Article'
  | 'FAQ'
  | 'Guide'
  | 'Utility'
  | 'Trust'
  | 'Policy'
  | 'Support'
  | 'Private';

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  h1: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  pageType: SeoPageType;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  index: boolean;
  answer: string;
  revised: string;
};

export const seedKeywords = [
  'research peptides',
  'peptides buy uk',
  'uk research peptides',
  'semaglutide peptide uk',
  'peptide research uk',
  'glp-3',
  'buy ghrp 2',
  'peptides buy',
  'kpv peptide',
  'igf-1 peptide',
  'oxford peptides',
];

function route(
  path: string,
  title: string,
  description: string,
  h1: string,
  primaryKeyword: string,
  secondaryKeywords: string[],
  pageType: SeoPageType,
  priority: number,
  changefreq: SeoRoute['changefreq'],
  answer: string,
): SeoRoute {
  return { path, title, description, h1, primaryKeyword, secondaryKeywords, pageType, priority, changefreq, index: true, answer, revised: SEO_REVISED_DATE };
}

export const staticSeoRoutes: SeoRoute[] = [
  route('/', 'Research Peptides UK | Research-Grade Peptides', 'Buy research peptides in the UK for laboratory use, with batch documentation, discreet shipping, and research-only support.', 'Research Peptides UK for Laboratory Research', 'research peptides', ['peptides buy uk', 'uk research peptides', 'peptide research uk'], 'Homepage', 1, 'weekly', 'Research Peptides UK supplies research-grade peptides for qualified laboratory workflows, with batch-focused documentation, UK dispatch, and research-only compliance positioning. The catalog is built for researchers comparing peptide purity, handling requirements, and reliable sourcing for non-clinical scientific use.'),
  route('/shop', 'Buy Research Peptides UK | Peptide Catalog', 'Browse research peptides for UK laboratories, including GLP, GHRP, KPV, IGF and specialist peptide categories for research use.', 'Shop Peptides for Research Use', 'peptides buy uk', ['peptides buy', 'uk research peptides', 'semaglutide peptide uk'], 'Product Listing', 0.95, 'daily', 'The Research Peptides UK catalog lists peptide compounds for laboratory research use only. Researchers can compare product names, categories, documentation signals, available variants, pricing, and shipping options before selecting compounds for compliant non-human research workflows.'),
  route('/categories', 'Peptide Categories UK | Research Compound Groups', 'Explore peptide categories for UK research workflows, from GLP and GHRP peptides to KPV, IGF and specialist compounds.', 'Research Peptide Categories', 'uk research peptides', ['glp-3', 'kpv peptide', 'igf-1 peptide'], 'Category Hub', 0.85, 'weekly', 'Peptide categories help researchers navigate compounds by pathway, handling context, and research application. A category hub improves discovery for GLP, GHRP, KPV, IGF and related peptide groups while keeping each compound positioned for laboratory research only.'),
  route('/blog', 'Peptide Research Blog UK | Scientific Insights', 'Read peptide research insights covering synthesis, purity, storage, GLP pathways, IGF signalling and laboratory protocol planning.', 'Peptide Research Insights', 'peptide research uk', ['research peptides', 'semaglutide peptide uk', 'igf-1 peptide'], 'Blog Hub', 0.8, 'weekly', 'The peptide research blog explains laboratory-focused concepts such as synthesis, analytical verification, peptide handling, and pathway research. It is designed as an educational source for non-clinical research planning, not as medical or consumption guidance.'),
  route('/faq', 'Research Peptides FAQ UK | Purity, Storage, Shipping', 'Get answers about research peptide purity, storage, UK shipping, discreet packaging, payment policy and research-use restrictions.', 'Researcher FAQ', 'research peptides faq', ['uk research peptides', 'peptide research uk', 'peptides buy uk'], 'FAQ', 0.75, 'monthly', 'Research Peptides UK products are supplied for laboratory research use only. The FAQ covers purity checks, HPLC and mass spec documentation, storage expectations, UK and international dispatch, discreet packaging, payment options, and support channels for qualified researchers.'),
  route('/shipping', 'Research Peptide Shipping UK | Delivery Protocols', 'Review UK and international peptide shipping protocols, tracked dispatch, discreet packaging and customs responsibilities.', 'Shipping and Delivery', 'research peptide shipping uk', ['peptides buy uk', 'uk research peptides', 'peptides buy'], 'Support', 0.65, 'monthly', 'Research Peptides UK uses tracked and discreet logistics for research orders, with UK dispatch options and international delivery subject to customs clearance. Buyers remain responsible for verifying that imported research compounds comply with local laws and institutional rules.'),
  route('/contact', 'Contact Research Peptides UK | Technical Support', 'Contact Research Peptides UK for COA requests, bulk procurement, product stability data, shipping questions and researcher support.', 'Contact Research Peptides UK', 'research peptides uk contact', ['uk research peptides', 'peptide research uk', 'oxford peptides'], 'Support', 0.65, 'monthly', 'Researchers can contact Research Peptides UK for batch documentation, COA references, stability data, logistics questions, and institutional procurement support. Inquiries are handled through a privacy-focused support workflow for qualified research contexts.'),
  route('/about-us', 'About Research Peptides UK | Research-Only Supplier', 'Learn about Research Peptides UK, a research-only peptide supplier focused on documentation, quality controls and technical support.', 'About Research Peptides UK', 'uk research peptides', ['research peptides', 'peptide research uk', 'peptides buy uk'], 'Trust', 0.7, 'monthly', 'Research Peptides UK is positioned as a research-only supplier supporting laboratories with peptide catalog access, documentation visibility, technical support, and compliance-first messaging. Products are not marketed for human or veterinary use.'),
  route('/peptide-guide', 'Peptide Guide UK | Research Handling Basics', 'Learn peptide basics for research settings, including synthesis, purification, storage, reconstitution and quality verification.', 'Peptide Guide', 'peptide research uk', ['research peptides', 'uk research peptides', 'peptides buy uk'], 'Guide', 0.85, 'monthly', 'A peptide guide helps researchers understand amino-acid chains, synthesis methods, purification checkpoints, storage expectations, and documentation review. It supports research planning while reinforcing that peptide compounds are for controlled laboratory use only.'),
  route('/peptide-calculator', 'Peptide Calculator | Research Reconstitution Tool', 'Use the peptide calculator for research planning estimates covering mass, diluent volume, concentration and target dose volume.', 'Peptide Calculator', 'peptide calculator', ['peptide research uk', 'research peptides', 'uk research peptides'], 'Utility', 0.7, 'monthly', 'The peptide calculator estimates concentration and volume relationships for laboratory planning. Results should be checked against internal SOPs, batch documentation, and method-specific requirements before any research workflow is finalized.'),
  route('/coas', 'COA Library UK | Peptide Batch Verification', 'Search peptide Certificate of Analysis references, purity records, batch IDs, test dates and lab verification notes.', 'COA Library', 'peptide coa uk', ['research peptides', 'uk research peptides', 'peptide research uk'], 'Trust', 0.75, 'monthly', 'The COA library gives researchers a visible batch-verification reference for peptide catalog lines, including product names, batch IDs, purity values, test dates, and laboratory notes. Full reports can be requested through support when needed.'),
  route('/peptide-information', 'Peptide Information UK | Synthesis and Purity Basics', 'Explore peptide chemistry information for research use, including synthesis, solubility, purification and analytical interpretation.', 'Peptide Information', 'peptide research uk', ['research peptides', 'uk research peptides', 'igf-1 peptide'], 'Guide', 0.8, 'monthly', 'Peptide information pages explain core laboratory concepts such as structure, synthesis, solubility, purification, and analytical review. The content is educational and intended to support non-clinical research workflows.'),
  route('/peptide-research', 'Peptide Research UK | GLP, KPV and IGF Briefs', 'Read research briefs on GLP peptides, KPV peptide, IGF-1 peptide, mitochondrial peptides and experimental pathway topics.', 'Peptide Research', 'peptide research uk', ['semaglutide peptide uk', 'kpv peptide', 'igf-1 peptide'], 'Guide', 0.85, 'monthly', 'Peptide research briefs summarize non-clinical topics such as GLP receptor pathways, KPV-related research, IGF axis studies, mitochondrial peptides, and protocol planning. They are framed for education and laboratory discussion only.'),
  route('/terms', 'Terms and Conditions | Research Peptides UK', 'Read Research Peptides UK terms covering research-only use, buyer eligibility, compliance responsibilities and order policies.', 'Terms and Conditions', 'research peptides terms', ['research peptides', 'uk research peptides', 'peptides buy uk'], 'Policy', 0.35, 'yearly', 'The terms explain that Research Peptides UK products are sold strictly for laboratory research and scientific use, not human or veterinary use. Buyers are responsible for legal compliance, safe handling, and appropriate research qualifications.'),
  route('/privacy', 'Privacy Policy | Research Peptides UK', 'Review how Research Peptides UK handles researcher data, order information, security, retention and UK privacy rights.', 'Privacy Policy', 'research peptides privacy', ['research peptides', 'uk research peptides', 'peptides buy uk'], 'Policy', 0.35, 'yearly', 'The privacy policy describes how Research Peptides UK collects, protects, and retains researcher information for orders, support, compliance, and platform improvement, with UK GDPR and Data Protection Act principles in view.'),
  route('/refund-returns', 'Refunds and Returns | Research Peptides UK', 'Understand Research Peptides UK refund and returns policy for research compounds, shipping issues and batch concerns.', 'Refunds and Returns', 'research peptides returns', ['peptides buy uk', 'uk research peptides', 'research peptides'], 'Policy', 0.35, 'yearly', 'The refunds and returns policy explains how Research Peptides UK handles research-compound order issues, including the limits created by product integrity, chain-of-custody, and controlled logistics requirements.'),
];

export const noindexRoutes: SeoRoute[] = [
  ['/cart', 'Cart'],
  ['/checkout', 'Checkout'],
  ['/admin', 'Admin'],
  ['/login', 'Login'],
  ['/profile', 'Profile'],
  ['/orders', 'Orders'],
  ['/wishlist', 'Wishlist'],
  ['/search', 'Search Results'],
].map(([path, title]) => ({
  path,
  title: title + ' | ' + BRAND_NAME,
  description: title + ' page for ' + BRAND_NAME + '.',
  h1: title,
  primaryKeyword: title.toLowerCase(),
  secondaryKeywords: [],
  pageType: 'Private' as const,
  priority: 0,
  changefreq: 'yearly' as const,
  index: false,
  answer: 'This private or duplicate utility page is not intended for search indexing.',
  revised: SEO_REVISED_DATE,
}));

const allKnownRoutes = [...staticSeoRoutes, ...noindexRoutes];

export function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  const [pathOnly] = pathname.split(/[?#]/);
  if (!pathOnly || pathOnly === '/') return '/';
  return pathOnly.replace(/\/+$/, '') || '/';
}

export function getSeoForPath(pathname: string): SeoRoute {
  const normalized = normalizePath(pathname);
  const exact = allKnownRoutes.find((candidate) => candidate.path === normalized);
  if (exact) return exact;
  if (normalized.startsWith('/product/')) {
    return route(normalized, 'Research Peptide Product | Research Peptides UK', 'View peptide product details for laboratory research use, including product notes, documentation signals and ordering options.', 'Research Peptide Product', 'research peptides', ['peptides buy uk', 'uk research peptides'], 'Product Page', 0.8, 'weekly', 'Product pages describe individual research peptides, available variants, pricing, documentation signals, and research-use restrictions so laboratory buyers can evaluate catalog fit before ordering.');
  }
  if (normalized.startsWith('/blog/')) {
    return route(normalized, 'Peptide Research Article | Research Peptides UK', 'Read a peptide research article from Research Peptides UK covering laboratory-use peptide concepts and protocol planning.', 'Peptide Research Article', 'peptide research uk', ['research peptides', 'uk research peptides'], 'Article', 0.7, 'monthly', 'Research articles explain peptide science topics for laboratory education and protocol planning, while avoiding medical or consumer-use claims.');
  }
  return staticSeoRoutes[0];
}

export function absoluteUrl(path = '/', siteUrl = DEFAULT_SITE_URL): string {
  const cleanBase = siteUrl.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return cleanBase + cleanPath;
}

export function assetUrl(path = DEFAULT_OG_IMAGE, siteUrl = DEFAULT_SITE_URL): string {
  if (/^https?:\/\//i.test(path)) return path;
  return absoluteUrl(path, siteUrl);
}

export function buildOrganizationJsonLd(siteUrl = DEFAULT_SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': siteUrl + '#organization',
    name: BRAND_NAME,
    url: siteUrl,
    email: BRAND_EMAIL,
    logo: assetUrl('/favicon.webp', siteUrl),
    areaServed: [{ '@type': 'Country', name: 'United Kingdom' }, { '@type': 'Place', name: 'Global research logistics' }],
    contactPoint: { '@type': 'ContactPoint', email: BRAND_EMAIL, contactType: 'Technical support', availableLanguage: 'English' },
    knowsAbout: seedKeywords,
  };
}

export function buildWebsiteJsonLd(siteUrl = DEFAULT_SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': siteUrl + '#website',
    url: siteUrl,
    name: BRAND_NAME,
    publisher: { '@id': siteUrl + '#organization' },
    inLanguage: 'en-GB',
    potentialAction: { '@type': 'SearchAction', target: siteUrl + '/search?q={search_term_string}', 'query-input': 'required name=search_term_string' },
  };
}

export function buildBreadcrumbJsonLd(pathname: string, title: string, siteUrl = DEFAULT_SITE_URL) {
  const normalized = normalizePath(pathname);
  if (normalized === '/') return null;
  const segments = normalized.split('/').filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      ...segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        return { '@type': 'ListItem', position: index + 2, name: isLast ? title.replace(/\s+\|\s+Research Peptides UK$/i, '') : titleCase(segment), item: absoluteUrl(path, siteUrl) };
      }),
    ],
  };
}

export function buildFaqPageJsonLd(questions: Array<{ q: string; a: string }>, siteUrl = DEFAULT_SITE_URL, path = '/faq') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': absoluteUrl(path, siteUrl) + '#faq',
    mainEntity: questions.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
  };
}

export function buildProductJsonLd(product: any, reviews: any[] = [], siteUrl = DEFAULT_SITE_URL) {
  const path = '/product/' + (product?.slug || slugify(String(product?.title || 'product')));
  const ratings = reviews.map((review) => Number(review.rating)).filter(Number.isFinite);
  const averageRating = ratings.length > 0 ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10 : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': absoluteUrl(path, siteUrl) + '#product',
    name: product?.title || 'Research peptide',
    image: Array.isArray(product?.images) ? product.images.filter(Boolean) : [],
    description: product?.description || 'Research-use peptide product listing.',
    sku: String(product?.sku || product?.id || ''),
    brand: { '@type': 'Brand', name: BRAND_NAME },
    category: Array.isArray(product?.categories) ? product.categories.join(', ') : 'Research peptides',
    url: absoluteUrl(path, siteUrl),
    offers: { '@type': 'Offer', priceCurrency: 'GBP', price: String(Number(product?.price || 0).toFixed(2)), availability: Number(product?.inventory || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: absoluteUrl(path, siteUrl), itemCondition: 'https://schema.org/NewCondition' },
    ...(averageRating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: String(averageRating), reviewCount: String(ratings.length) } } : {}),
  };
}

export function buildArticleJsonLd(post: any, siteUrl = DEFAULT_SITE_URL) {
  const path = '/blog/' + (post?.slug || post?.id || '');
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': absoluteUrl(path, siteUrl) + '#article',
    headline: post?.title || 'Peptide research article',
    description: excerpt(post?.content || post?.summary || post?.title || '', 155),
    image: post?.image_url ? [post.image_url] : [assetUrl(DEFAULT_OG_IMAGE, siteUrl)],
    author: { '@type': 'Organization', name: BRAND_NAME + ' Editorial Board', url: siteUrl },
    publisher: { '@id': siteUrl + '#organization' },
    datePublished: post?.created_at || SEO_REVISED_DATE,
    dateModified: post?.updated_at || post?.created_at || SEO_REVISED_DATE,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path, siteUrl) },
  };
}

export function excerpt(value: string, maxLength: number): string {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return normalized.slice(0, maxLength - 3).trim() + '...';
}

export function titleCase(value: string): string {
  return value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()).trim();
}

export function slugify(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-').slice(0, 90) || 'page';
}
