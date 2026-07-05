export type ProductSeoEnhancement = {
  title: string;
  description: string;
  answerCapsule: string;
  primaryKeyword: string;
};

const enhancements: Record<string, ProductSeoEnhancement> = {
  semaglutide: {
    title: 'Semaglutide Peptide UK | Buy for Laboratory Research',
    description:
      'Buy semaglutide peptide UK for GLP-1 pathway research — research-grade listing, batch documentation, COA references, and UK dispatch for qualified laboratories.',
    answerCapsule:
      'Semaglutide peptide UK listings supply research-grade GLP-1 receptor agonist material for non-clinical laboratory models. UK buyers compare sequence integrity, HPLC purity documentation, variant sizes, and research-only compliance before ordering from the catalogue.',
    primaryKeyword: 'semaglutide peptide uk',
  },
  'ghrp-2': {
    title: 'Buy GHRP-2 Peptide UK | Research GH Axis Compound',
    description:
      'Buy GHRP-2 peptide UK for growth-hormone secretagogue research — catalogue variants, purity signals, COA references, and discreet UK shipping for laboratory use.',
    answerCapsule:
      'GHRP-2 peptide UK orders support GH axis and secretagogue pathway research in qualified laboratories. Researchers compare peptide identity, lyophilised mass options, batch documentation, and research-only supplier terms before purchase.',
    primaryKeyword: 'buy ghrp 2',
  },
  kpv: {
    title: 'KPV Peptide UK | Buy for Inflammatory Pathway Research',
    description:
      'Buy KPV peptide UK for laboratory anti-inflammatory pathway studies — tripeptide listing with documentation signals, UK dispatch, and research-only positioning.',
    answerCapsule:
      'KPV peptide UK supplies Lys-Pro-Val tripeptide material for non-clinical inflammatory and MC1R pathway research. UK laboratories evaluate purity documentation, storage requirements, and batch traceability before adding KPV to a study workflow.',
    primaryKeyword: 'kpv peptide',
  },
  'igf-1': {
    title: 'IGF-1 Peptide UK | Buy for Anabolic Signalling Research',
    description:
      'Buy IGF-1 peptide UK for IGF axis laboratory research — LR3 and related variants, analytical documentation, and UK catalogue dispatch for research use only.',
    answerCapsule:
      'IGF-1 peptide UK listings support non-clinical studies of IGF axis signalling and growth-factor pathway models. Researchers compare variant sequences, purity records, reconstitution planning, and COA references before ordering for laboratory workflows.',
    primaryKeyword: 'igf-1 peptide',
  },
};

function normalizeSlug(slug?: string | null) {
  return String(slug || '')
    .toLowerCase()
    .replace(/_/g, '-');
}

export function getProductSeoEnhancement(product: {
  slug?: string | null;
  title?: string | null;
}): ProductSeoEnhancement | null {
  const slug = normalizeSlug(product.slug);
  const title = String(product.title || '').toLowerCase();

  if (slug.includes('semaglutide') || title.includes('semaglutide')) return enhancements.semaglutide;
  if (slug.includes('ghrp-2') || slug.includes('ghrp2') || title.includes('ghrp-2') || title.includes('ghrp 2')) {
    return enhancements['ghrp-2'];
  }
  if (slug.includes('kpv') || title.includes('kpv')) return enhancements.kpv;
  if (slug.includes('igf-1') || slug.includes('igf1') || title.includes('igf-1') || title.includes('igf 1')) {
    return enhancements['igf-1'];
  }

  return null;
}

export function productSeoTitle(enhancement: ProductSeoEnhancement | null, productTitle: string) {
  if (enhancement) return `${enhancement.title} | Research Peptides UK`;
  return `${productTitle || 'Research peptide'} | Research Peptides UK`;
}
