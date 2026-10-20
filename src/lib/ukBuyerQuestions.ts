/** UK buyer-intent copy — how / where / price questions with rotated cities and nations. */

import { excerpt } from './seo';
import type { ProductSeoEnhancement } from './productSeoEnhancements';

export type UkBuyerFaq = { q: string; a: string };

const BRAND_TITLE_SUFFIX = ' | Research Peptides UK';

export type UkGeoAssignment = {
  nation: string;
  nationCities: string;
  cityA: string;
  cityB: string;
};

const UK_NATIONS: Array<{ nation: string; cities: string[] }> = [
  { nation: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen'] },
  { nation: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport'] },
  { nation: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn'] },
  { nation: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 'Liverpool'] },
];

const ENGLAND_CITIES = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 'Liverpool', 'Sheffield', 'Nottingham', 'Oxford', 'Cambridge', 'Newcastle'];

function hashSlug(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = (h * 33) ^ slug.charCodeAt(i);
  return Math.abs(h);
}

function pick<T>(items: T[], seed: number, offset = 0): T {
  return items[(seed + offset) % items.length];
}

export function normalizeProductSlug(slug?: string | null): string {
  return String(slug || '')
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/** Short catalogue name for sentences (keeps brand casing from title when possible). */
export function productBuyerLabel(title?: string | null): string {
  const raw = String(title || 'research peptide').trim();
  const stripped = raw.replace(/\s*\|\s*.+$/i, '').trim();
  return stripped || 'research peptide';
}

export function productBuyerLabelLower(title?: string | null): string {
  return productBuyerLabel(title).toLowerCase();
}

export function getUkGeoAssignment(slug?: string | null): UkGeoAssignment {
  const key = normalizeProductSlug(slug) || 'catalogue';
  const seed = hashSlug(key);
  const nationBlock = pick(UK_NATIONS, seed);
  const nationCityA = pick(nationBlock.cities, seed, 1);
  const nationCityB = pick(nationBlock.cities, seed, 2);
  const nationCities =
    nationCityA === nationCityB ? nationCityA : `${nationCityA} or ${nationCityB}`;
  const cityA = pick(ENGLAND_CITIES, seed, 3);
  let cityB = pick(ENGLAND_CITIES, seed, 5);
  if (cityB === cityA) cityB = pick(ENGLAND_CITIES, seed, 7);

  return {
    nation: nationBlock.nation,
    nationCities,
    cityA,
    cityB,
  };
}

type ProductBuyerOverride = {
  subtitle?: string;
  intro?: string;
  answerCapsule?: string;
  faqs?: UkBuyerFaq[];
  seoTitleSuffix?: string;
  seoDescription?: string;
};

const PRODUCT_BUYER_OVERRIDES: Record<string, ProductBuyerOverride> = {
  semaglutide: {
    subtitle: 'Research semaglutide for UK laboratories — London, Manchester, Scotland & UK-wide dispatch',
    intro:
      'Researchers looking for semaglutide peptide UK listings often ask how to buy semaglutide in the United Kingdom, where to order research-grade material with batch documentation, and how much semaglutide costs for laboratory use before they add a vial to cart. This page is the main catalogue line for non-clinical GLP-1 pathway work — with COA references, variant sizes, and UK dispatch for qualified buyers.',
    answerCapsule:
      'How to buy semaglutide in the United Kingdom: browse this listing, confirm the vial size and research-only terms, then checkout or WhatsApp for lab procurement. Where can I buy semaglutide in London or Manchester? Order here for UK-wide dispatch (including Scotland and Wales) — not pharmacy GLP-1 medicines. How much for semaglutide in the UK? The price shown on this page is for this research listing; compare documentation and size before ordering.',
    seoTitleSuffix: 'How to Buy & UK Pricing',
    seoDescription:
      'How to buy semaglutide in the United Kingdom, where UK labs order research-grade GLP-1 peptide, and pricing for this listing — COAs, variants, and UK dispatch.',
    faqs: [
      {
        q: 'How to buy semaglutide in Scotland (e.g. Edinburgh or Glasgow)?',
        a: 'Add this listing to cart, complete research-only checkout, or contact us for institutional procurement. We ship within the United Kingdom for qualified laboratory buyers.',
      },
      {
        q: 'Where can I buy research semaglutide in Manchester or Birmingham?',
        a: 'This shop is the catalogue source — same UK dispatch as London — with discreet packaging and batch documentation signals on the product page.',
      },
      {
        q: 'How much for semaglutide in the United Kingdom?',
        a: 'Use the price on this page for this vial or listing. Other semaglutide-related catalogue rows (named vials or blends) are separate products with their own pricing.',
      },
      {
        q: 'Can I buy semaglutide for human use in the UK?',
        a: 'No. Material here is for laboratory research only, not for human or veterinary administration. Buyers must comply with UK law and your institution’s rules.',
      },
    ],
  },
  tirzepatide: {
    subtitle: 'Research tirzepatide for UK laboratories — Birmingham, Leeds, Wales & UK-wide dispatch',
    intro:
      'Researchers searching tirzepatide in the United Kingdom often ask how to buy tirzepatide for laboratory work, where to order research-grade dual-incretin material with batch documentation, and how much tirzepatide costs on this main catalogue listing. The separate 100mg single-vial page is a size line — not a substitute for this listing.',
    answerCapsule:
      'How to buy tirzepatide in the United Kingdom: use this main research listing, confirm vial specification and research-only terms, then checkout or WhatsApp for lab procurement. Where can I buy tirzepatide in Birmingham or Leeds? Order here for UK-wide dispatch including Wales and Scotland. How much for tirzepatide in the UK? The price on this page applies to this listing; the 100mg one-vial row is priced separately.',
    seoTitleSuffix: 'How to Buy & UK Pricing',
    seoDescription:
      'How to buy tirzepatide in the United Kingdom, where UK labs order research-grade tirzepatide, and pricing for this main listing — COAs, variants, and UK dispatch.',
    faqs: [
      {
        q: 'How to buy tirzepatide in Wales (e.g. Cardiff or Newport)?',
        a: 'Add this listing to cart, complete research-only checkout, or contact support for institutional procurement. UK-wide laboratory dispatch applies.',
      },
      {
        q: 'Where can I buy research tirzepatide in Birmingham or Leeds?',
        a: 'This catalogue page is the main ordering source with the same UK dispatch standards as London, plus documentation signals on the product page.',
      },
      {
        q: 'How much for tirzepatide in the United Kingdom?',
        a: 'Use the price shown on this page for this listing. The tirzepatide 100mg single-vial product is a separate catalogue entry with its own price.',
      },
      {
        q: 'Can I buy tirzepatide for human use in the UK?',
        a: 'No. Tirzepatide here is for laboratory research only, not pharmacy medicines or human administration.',
      },
    ],
  },
  retatrutide: {
    subtitle: 'Research retatrutide for UK laboratories — London, Edinburgh, Northern Ireland & UK-wide dispatch',
    intro:
      'UK laboratories comparing retatrutide UK buy options often ask how to buy retatrutide in the United Kingdom, where to source research-grade triple-agonist pathway material, and how much retatrutide costs before procurement review. This listing is for non-clinical metabolic and receptor research with COA references and UK dispatch.',
    answerCapsule:
      'How to buy retatrutide in the United Kingdom: open this catalogue listing, verify research-only compliance and documentation, then add to cart or message support. Where can I buy retatrutide in London or Edinburgh? UK-wide dispatch applies through this shop. How much for retatrutide in the UK? See the GBP price on this page for this vial listing before ordering.',
    seoTitleSuffix: 'How to Buy & UK Pricing',
    seoDescription:
      'How to buy retatrutide in the United Kingdom, where UK labs order research-grade retatrutide, and pricing for this listing — COAs and UK dispatch.',
    faqs: [
      {
        q: 'How to buy retatrutide in Northern Ireland (e.g. Belfast)?',
        a: 'Checkout online with a UK delivery address or contact support for CRO procurement. Material remains research-only.',
      },
      {
        q: 'Where can I buy research retatrutide in London or Edinburgh?',
        a: 'Order through this research peptide catalogue with discreet UK dispatch and batch documentation signals.',
      },
      {
        q: 'How much for retatrutide in the United Kingdom?',
        a: 'Pricing is listed in GBP on this product page. Compare vial size and COA documentation before adding to cart.',
      },
      {
        q: 'Is retatrutide the same as pharmacy weight-loss medicines?',
        a: 'No. This is research-grade material for non-clinical laboratory use only, not licensed medicines for human use.',
      },
    ],
  },
};

export type ProductBuyerContent = {
  geo: UkGeoAssignment;
  subtitle: string;
  intro: string;
  answerCapsule: string;
  faqs: UkBuyerFaq[];
  seoTitleSuffix?: string;
  seoDescription?: string;
};

function formatPriceGbp(price: number | null | undefined): string | null {
  if (price == null || !Number.isFinite(Number(price))) return null;
  return `£${Number(price).toFixed(2)}`;
}

export function buildProductBuyerContent(
  product: { slug?: string | null; title?: string | null; price?: number | null },
  options?: { displayPrice?: number | null },
): ProductBuyerContent {
  const slug = normalizeProductSlug(product.slug);
  const override = PRODUCT_BUYER_OVERRIDES[slug];
  const geo = getUkGeoAssignment(slug);
  const label = productBuyerLabel(product.title);
  const labelLower = label.toLowerCase();
  const priceText = formatPriceGbp(options?.displayPrice ?? product.price);

  if (override) {
    return {
      geo,
      subtitle: override.subtitle || buildProductSubtitle(label, geo),
      intro: override.intro || buildProductBuyerIntro(label, labelLower, geo),
      answerCapsule: override.answerCapsule || buildProductBuyerAnswerCapsule(labelLower, geo, priceText),
      faqs: override.faqs || buildProductBuyerFaqs(label, labelLower, geo, priceText),
      seoTitleSuffix: override.seoTitleSuffix,
      seoDescription: override.seoDescription || buildDefaultSeoDescription(labelLower),
    };
  }

  const content: ProductBuyerContent = {
    geo,
    subtitle: buildProductSubtitle(label, geo),
    intro: buildProductBuyerIntro(label, labelLower, geo),
    answerCapsule: buildProductBuyerAnswerCapsule(labelLower, geo, priceText),
    faqs: buildProductBuyerFaqs(label, labelLower, geo, priceText),
    seoDescription: buildDefaultSeoDescription(labelLower),
  };

  return content;
}

function buildDefaultSeoDescription(labelLower: string, catalogueTail?: string): string {
  const lead = `How to buy ${labelLower} in the United Kingdom, where UK labs order research-grade material, and UK pricing on this listing`;
  const tail = catalogueTail ? ` — ${catalogueTail.replace(/\s+/g, ' ').trim()}` : ' — COAs, variants, and UK dispatch.';
  return excerpt(`${lead}${tail}`, 155);
}

function mergeAnswerCapsule(buyerCapsule: string, catalogueCapsule?: string | null): string {
  if (!catalogueCapsule?.trim()) return buyerCapsule;
  if (/how to buy|how much for|where can i buy/i.test(catalogueCapsule)) return catalogueCapsule;
  return `${buyerCapsule} ${catalogueCapsule}`;
}

function appendCatalogueListingFaq(faqs: UkBuyerFaq[], catalogueNote: string, label: string): UkBuyerFaq[] {
  if (/how to buy/i.test(catalogueNote)) return faqs;
  const q = `How does this ${label} listing relate to other sizes in the catalogue?`;
  if (faqs.some((item) => item.q === q)) return faqs;
  return [...faqs, { q, a: catalogueNote }];
}

function buildResolvedSeoTitle(label: string, enhancement: ProductSeoEnhancement | null, slug: string): string {
  const override = PRODUCT_BUYER_OVERRIDES[slug];
  if (enhancement?.title) {
    const base = enhancement.title.trim();
    if (override?.seoTitleSuffix || /how to buy/i.test(base)) {
      return `${base}${BRAND_TITLE_SUFFIX}`;
    }
    return `${base} | How to Buy UK${BRAND_TITLE_SUFFIX}`;
  }
  return `${label} | How to Buy UK${BRAND_TITLE_SUFFIX}`;
}

export type ResolvedProductPageSeo = ProductBuyerContent & {
  seoTitle: string;
  seoDescription: string;
  answerCapsule: string;
};

export function resolveProductPageSeo(
  product: { slug?: string | null; title?: string | null; price?: number | null },
  enhancement: ProductSeoEnhancement | null,
  options?: { displayPrice?: number | null },
): ResolvedProductPageSeo {
  const buyer = buildProductBuyerContent(product, options);
  const slug = normalizeProductSlug(product.slug);
  const label = productBuyerLabel(product.title);
  const override = PRODUCT_BUYER_OVERRIDES[slug];

  let faqs = buyer.faqs;
  if (enhancement?.answerCapsule && !override?.faqs) {
    faqs = appendCatalogueListingFaq(faqs, enhancement.answerCapsule, label);
  }

  const answerCapsule = override?.answerCapsule
    ? buyer.answerCapsule
    : mergeAnswerCapsule(buyer.answerCapsule, enhancement?.answerCapsule);

  const seoDescription =
    buyer.seoDescription ||
    (enhancement?.description && /how to buy/i.test(enhancement.description)
      ? enhancement.description
      : buildDefaultSeoDescription(productBuyerLabelLower(product.title), enhancement?.description));

  return {
    ...buyer,
    faqs,
    answerCapsule,
    seoDescription: excerpt(seoDescription, 155),
    seoTitle: buildResolvedSeoTitle(label, enhancement, slug),
  };
}

function buildProductSubtitle(label: string, geo: UkGeoAssignment): string {
  return `Research ${label.toLowerCase()} for UK laboratories — ${geo.cityA}, ${geo.cityB}, ${geo.nation} & UK-wide dispatch`;
}

function buildProductBuyerIntro(label: string, labelLower: string, geo: UkGeoAssignment): string {
  return `Researchers sourcing ${labelLower} in the United Kingdom often ask how to buy ${labelLower} in the UK, where to order research-grade material with batch documentation, and how much ${labelLower} costs for laboratory use. This listing covers ${label} for qualified non-clinical workflows — with COA references where available, variant detail on this page, and dispatch to ${geo.cityA}, ${geo.nation}, and across the UK.`;
}

function buildProductBuyerAnswerCapsule(
  labelLower: string,
  geo: UkGeoAssignment,
  priceText: string | null,
): string {
  const priceSentence = priceText
    ? `How much for ${labelLower} in the United Kingdom? This listing is shown at ${priceText} before checkout — confirm variant size and documentation before ordering.`
    : `How much for ${labelLower} in the United Kingdom? Use the price on this page for this listing and compare variant size and documentation before ordering.`;

  return [
    `How to buy ${labelLower} in the United Kingdom: open this product page, confirm research-only terms and vial specification, then add to cart or WhatsApp for lab procurement.`,
    `Where can I buy ${labelLower} in ${geo.cityA} or ${geo.cityB}? Order through this catalogue for UK-wide dispatch, including ${geo.nation}.`,
    priceSentence,
  ].join(' ');
}

function buildProductBuyerFaqs(
  label: string,
  labelLower: string,
  geo: UkGeoAssignment,
  priceText: string | null,
): UkBuyerFaq[] {
  const seed = hashSlug(labelLower);
  const extras: UkBuyerFaq[] = [
    {
      q: `How long does delivery of ${labelLower} take to ${geo.cityA}?`,
      a: 'Most UK research orders ship with tracked dispatch and typically arrive within a few business days, depending on stock and carrier. See shipping protocols for current timelines.',
    },
    {
      q: `What COA should I check before buying ${labelLower} in the UK?`,
      a: 'Compare HPLC purity, batch ID, and test dates in our COA library where available. Retain files for your laboratory audit trail before starting non-clinical work.',
    },
    {
      q: `Is ${labelLower} legal for research use in the United Kingdom?`,
      a: 'Research peptides are supplied for legitimate non-clinical laboratory use when buyers comply with UK law, institutional rules, and research-only supplier terms — not for human or veterinary administration.',
    },
    {
      q: `Can institutional buyers order ${labelLower} for a CRO in ${geo.nation}?`,
      a: 'Yes. Qualified laboratories and CROs can checkout online or contact support with procurement requirements. Material remains research-only regardless of delivery city.',
    },
  ];
  const extra = pick(extras, seed);

  const priceAnswer = priceText
    ? `This page shows ${priceText} for the selected listing. Other vial sizes or related catalogue rows may have different prices — open each product page before ordering.`
    : 'Use the price displayed on this product page for this listing. Related sizes or blends in the catalogue are separate pages with their own pricing.';

  return [
    {
      q: `How to buy ${labelLower} in ${geo.nation} (e.g. ${geo.nationCities})?`,
      a: 'Add this listing to cart, complete research-only checkout, or message us for institutional procurement. We dispatch within the United Kingdom for qualified laboratory buyers.',
    },
    {
      q: `Where can I buy research ${labelLower} in ${geo.cityA} or ${geo.cityB}?`,
      a: 'This online catalogue is the ordering source for UK laboratories — same dispatch standards as London — with discreet packaging and documentation signals on the product page.',
    },
    {
      q: `How much for ${labelLower} in the United Kingdom?`,
      a: priceAnswer,
    },
    {
      q: `Can I buy ${label} for human use in the UK?`,
      a: 'No. Products are for laboratory research only, not for human or veterinary use. Buyers remain responsible for lawful handling and institutional compliance.',
    },
    extra,
  ];
}

/** Homepage / shop hub snippets — rotate by path hash. */
export function getHubBuyerQuestions(path: string): UkBuyerFaq[] {
  const seed = hashSlug(path);
  const products = ['research peptides', 'BPC-157', 'tirzepatide', 'semaglutide', 'retatrutide', 'TB-500'];
  const topic = pick(products, seed);
  const topicLower = topic.toLowerCase();
  const geo = getUkGeoAssignment(path + topicLower);

  return [
    {
      q: `How to buy ${topicLower} in the United Kingdom?`,
      a: `Qualified UK laboratories compare COA references, research-only terms, and dispatch options in the shop catalogue, then checkout or contact support for procurement. Delivery covers ${geo.cityA}, ${geo.nation}, and UK-wide addresses.`,
    },
    {
      q: `Where can I buy ${topicLower} in ${geo.cityA} or ${geo.cityB}?`,
      a: 'Research Peptides UK lists compounds online with UK dispatch — not a retail pharmacy. Use product pages for variant detail, documentation signals, and cart checkout.',
    },
    {
      q: `How much for ${topicLower} in the UK?`,
      a: 'Pricing is shown per product listing in GBP. Compare vial size, pathway class, and batch documentation before ordering — headline price alone is not a purity or compliance signal.',
    },
    {
      q: 'What should I check before ordering peptides for a lab in Scotland or Wales?',
      a: 'Confirm research-only supplier language, storage capability, institutional approval, and COA access. Products are supplied for non-clinical scientific use only.',
    },
  ];
}

export const hubBuyerQuestionLinks = [
  { to: '/blog/how-to-buy-research-peptides-in-the-uk', label: 'how to buy research peptides in the UK' },
  { to: '/shop', label: 'research peptide catalog' },
  { to: '/faq', label: 'UK buyer FAQ' },
  { to: '/coas', label: 'peptide COA library' },
] as const;
