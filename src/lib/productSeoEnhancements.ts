export type ProductSeoEnhancement = {
  title: string;
  description: string;
  answerCapsule: string;
  primaryKeyword: string;
};

function entry(
  title: string,
  description: string,
  answerCapsule: string,
  primaryKeyword: string,
): ProductSeoEnhancement {
  return { title, description, answerCapsule, primaryKeyword };
}

const enhancements = {
  'bacteriostatic-water': entry(
    'Bacteriostatic Water | Research Diluent',
    'Bacteriostatic water for laboratory peptide handling — research diluent listing, documentation signals, and UK dispatch for qualified labs.',
    'Bacteriostatic water in this catalogue is a research diluent for laboratory peptide handling, supplied for non-clinical use only. Researchers compare vial volume, formulation, batch documentation, and UK dispatch before ordering.',
    'bacteriostatic water',
  ),
  'hospira-bac-water': entry(
    'Hospira Bac Water | 10ml Benzyl Alcohol',
    'Hospira bacteriostatic water, 10ml with benzyl alcohol, listed for laboratory research dilution with documentation signals and UK dispatch.',
    'This Hospira bacteriostatic water listing is the 10ml benzyl-alcohol research diluent, supplied for laboratory use only. Researchers confirm the formulation, batch documentation, and research-only terms before ordering.',
    'hospira bacteriostatic water',
  ),
  'bacteriostatic-saline': entry(
    'Bacteriostatic Saline | 0.9% Sodium Chloride',
    'Bacteriostatic saline, 0.9% sodium chloride, for laboratory research dilution — 10ml vial, documentation signals, and UK dispatch.',
    'Bacteriostatic saline here is the 0.9% sodium chloride research diluent, distinct from benzyl-alcohol bacteriostatic water. It is supplied for non-clinical laboratory use only.',
    'bacteriostatic saline',
  ),
  'glow-peptide': entry(
    'Glow Peptide Blend | GHK-Cu, BPC-157, TB-500',
    'Glow peptide blend of GHK-Cu, BPC-157 and TB-500 for laboratory research — vial listing, documentation signals, and UK dispatch.',
    'The glow peptide listing is a GHK-Cu, BPC-157 and TB-500 research blend for non-clinical laboratory work. Researchers review composition, documentation, and research-only handling before ordering.',
    'glow peptide',
  ),
  kpv: entry(
    'KPV Peptide UK | Inflammatory Pathway Research',
    'KPV peptide for laboratory pathway research — tripeptide listing with documentation signals, UK dispatch, and research-only positioning.',
    'KPV peptide supplies Lys-Pro-Val tripeptide material for non-clinical laboratory research. UK laboratories evaluate purity documentation, storage requirements, and batch traceability before adding KPV to a study workflow.',
    'kpv peptide',
  ),
  'kpv-vial': entry(
    'KPV Peptide Vial | Research Size Listing',
    'KPV peptide vial sizes for laboratory research — documentation signals, UK dispatch, and research-only positioning on this size listing.',
    'This KPV listing is a sized vial or capsule option for laboratory research. Researchers use the size stated on the page and review documentation before ordering for non-clinical work.',
    'kpv peptide vial',
  ),
  'cjc-ipamorelin': entry(
    'CJC-1295 Ipamorelin | No DAC Research Blend',
    'CJC-1295 no DAC with ipamorelin for GH-axis laboratory research — combined research blend, documentation signals, and UK dispatch.',
    'This CJC-1295 ipamorelin listing is the no-DAC blend for non-clinical GH-axis research. CJC-1295 with DAC is a separate catalogue page. Researchers compare composition and documentation before ordering.',
    'cjc 1295 ipamorelin',
  ),
  'cjc-dac': entry(
    'CJC-1295 with DAC | Research GH-Axis Peptide',
    'CJC-1295 with DAC for GH-axis laboratory research — research listing, documentation signals, and UK dispatch for qualified laboratories.',
    'CJC-1295 with DAC is listed separately from the no-DAC ipamorelin blend. The material is supplied for non-clinical laboratory research, with documentation signals and UK dispatch.',
    'cjc 1295 dac',
  ),
  'cjc-dac-2mg': entry(
    'CJC-1295 DAC 2mg | Research Vial',
    'CJC-1295 with DAC, 2mg research vial — documentation signals and UK dispatch for qualified laboratory research.',
    'This page is the 2mg CJC-1295 with DAC vial for laboratory research. It is a size listing, supplied for non-clinical use only.',
    'cjc 1295 dac 2mg',
  ),
  'igf-1-lr3': entry(
    'IGF-1 LR3 | Laboratory Research Listing',
    'IGF-1 LR3 for IGF-axis laboratory research — research-grade listing, documentation signals, and UK dispatch for non-clinical use only.',
    'IGF-1 LR3 is listed separately from IGF-1 DES and other IGF-1 catalogue entries. Researchers compare the variant, documentation, and research-only terms before ordering for laboratory work.',
    'igf-1 lr3',
  ),
  'igf-1-lr3-1mg': entry(
    'IGF-1 LR3 1mg | Research Vial',
    'IGF-1 LR3 1mg research vial — documentation signals and UK dispatch for qualified laboratory research.',
    'This page is the 1mg IGF-1 LR3 vial for laboratory research. It is a size listing and is supplied for non-clinical use only.',
    'igf-1 lr3 1mg',
  ),
  'igf-1-des': entry(
    'IGF-1 DES | Laboratory Research Listing',
    'IGF-1 DES for laboratory research — research listing, documentation signals, and UK dispatch. Separate from the IGF-1 LR3 catalogue page.',
    'IGF-1 DES is a distinct catalogue entry from IGF-1 LR3. It is supplied for non-clinical laboratory research, with documentation signals and UK dispatch.',
    'igf-1 des',
  ),
  'igf-1-des-1mg': entry(
    'IGF-1 DES 1mg | Research Vial',
    'IGF-1 DES 1mg research vial — documentation signals and UK dispatch for qualified laboratory research.',
    'This page is the 1mg IGF-1 DES vial for laboratory research. It is a size listing and is supplied for non-clinical use only.',
    'igf-1 des 1mg',
  ),
  'igf-1': entry(
    'IGF-1 Peptide UK | Laboratory Research Listing',
    'IGF-1 peptide for laboratory research — this listing is separate from IGF-1 LR3 and IGF-1 DES, with documentation signals and UK dispatch.',
    'This IGF-1 peptide listing covers the non-LR3, non-DES catalogue entry for non-clinical laboratory research. LR3 and DES each have their own pages.',
    'igf-1 peptide',
  ),
  '5-amino-1mq': entry(
    '5-Amino-1MQ | Laboratory Research Listing',
    '5-Amino-1MQ for laboratory research — research listing, documentation signals, and UK dispatch. Supplied for non-clinical research use only.',
    '5-Amino-1MQ is listed for qualified laboratory research, not as a dosage guide. Researchers review documentation, vial details, and research-only terms before ordering.',
    '5 amino 1mq',
  ),
  retatrutide: entry(
    'Retatrutide UK | Laboratory Research Listing',
    'Retatrutide for UK laboratory research — catalogue listing with documentation signals, COA references, and research-only UK dispatch.',
    'Retatrutide UK orders from this page are for non-clinical laboratory research. Researchers compare documentation, vial options, and research-only compliance before buying from the catalogue.',
    'retatrutide uk buy',
  ),
  semax: entry(
    'Semax Peptide | Laboratory Research Listing',
    'Semax peptide for laboratory research — research listing, documentation signals, and UK dispatch for qualified laboratories.',
    'Semax peptide is supplied for non-clinical laboratory research. Researchers review documentation, storage expectations, and research-only terms before ordering.',
    'peptides semax',
  ),
  'bpc-tb500': entry(
    'BPC-157 TB-500 Blend | Laboratory Research',
    'BPC-157 TB-500 blend for laboratory research — combined research vial, documentation signals, and UK dispatch for qualified labs.',
    'This BPC-157 TB-500 page is the blend listing for non-clinical laboratory research. Standalone BPC-157 and smaller blend sizes are separate catalogue entries.',
    'bpc157 tb500',
  ),
  follistatin: entry(
    'Follistatin | Laboratory Research Listing',
    'Follistatin for laboratory research, including follistatin 344 references — documentation signals and UK dispatch for non-clinical use.',
    'Follistatin and follistatin 344 queries are covered by this research listing. The material is supplied for non-clinical laboratory work, with documentation signals and UK dispatch.',
    'follistatin',
  ),
  'follistatin-344-1mg': entry(
    'Follistatin 344 1mg | Research Vial',
    'Follistatin 344, 1mg research vial — documentation signals and UK dispatch for qualified laboratory research.',
    'This page is the 1mg follistatin 344 vial for laboratory research. It is a size listing and is supplied for non-clinical use only.',
    'follistatin 344 1mg',
  ),
  'nad-500mg': entry(
    'NAD Peptide 500mg | Laboratory Research',
    'NAD peptide, 500mg, for laboratory research — documentation signals and UK dispatch. The 250mg vial is a separate size listing.',
    'This 500mg NAD peptide vial is supplied for non-clinical laboratory use. A 250mg size is catalogued as its own listing with the size in the title.',
    'nad peptide',
  ),
  'nad-250mg': entry(
    'NAD 250mg | Laboratory Research Vial',
    'NAD 250mg research vial — documentation signals and UK dispatch for qualified laboratory research.',
    'This page is the 250mg NAD vial for laboratory research. It is a size listing and is supplied for non-clinical use only.',
    'nad 250mg',
  ),
  nad: entry(
    'NAD Catalogue Listing | Research Compound',
    'NAD research compound catalogue listing — compare documented vial options for laboratory research, with UK dispatch.',
    'This NAD catalogue entry lists the compound for non-clinical laboratory work. Researchers compare the documented vial size on the page before ordering.',
    'nad research compound',
  ),
  'hgh-fragment': entry(
    'HGH Fragment 176-191 | Laboratory Research',
    'HGH fragment 176-191 for laboratory research — research listing, documentation signals, and UK dispatch for qualified laboratories.',
    'HGH fragment 176-191 is listed for non-clinical laboratory research. Sized vials are separate catalogue entries. Researchers review documentation and research-only terms before ordering.',
    'hgh fragment 176-191',
  ),
  'hgh-fragment-5mg': entry(
    'HGH Fragment 176-191 5mg | Research Vial',
    'HGH fragment 176-191, 5mg research vial — documentation signals and UK dispatch for qualified laboratory research.',
    'This page is the 5mg HGH fragment 176-191 vial for laboratory research. It is a size listing and is supplied for non-clinical use only.',
    'hgh fragment 176-191 5mg',
  ),
  'hgh-fragment-10mg': entry(
    'HGH Fragment 176-191 10mg | Research Vial',
    'HGH fragment 176-191, 10mg research vial — documentation signals and UK dispatch for qualified laboratory research.',
    'This page is the 10mg HGH fragment 176-191 vial for laboratory research. It is a size listing and is supplied for non-clinical use only.',
    'hgh fragment 176-191 10mg',
  ),
  'ghrp-2': entry(
    'GHRP-2 Peptide | GH-Axis Laboratory Research',
    'GHRP-2 for GH-axis laboratory research — research listing, documentation signals, and UK dispatch. Other GHRP-2 sizes are separate pages.',
    'GHRP-2 on this page is the research listing for non-clinical GH-axis work. Other vial sizes are labelled with their milligram amount.',
    'ghrp-2',
  ),
  'ghrp-2-10mg': entry(
    'GHRP-2 10mg | Research Vial',
    'GHRP-2 10mg research vial — documentation signals and UK dispatch for qualified laboratory research.',
    'This page is the 10mg GHRP-2 vial for laboratory research. It is a size listing and is supplied for non-clinical use only.',
    'ghrp-2 10mg',
  ),
  'ghrp-2-5mg': entry(
    'GHRP-2 5mg | Research Vial',
    'GHRP-2 5mg research vial — documentation signals and UK dispatch for qualified laboratory research.',
    'This page is the 5mg GHRP-2 vial for laboratory research. It is a size listing and is supplied for non-clinical use only.',
    'ghrp-2 5mg',
  ),
  semaglutide: entry(
    'Semaglutide Peptide UK | Laboratory Research',
    'Semaglutide peptide UK for GLP-1 pathway research — research-grade listing, batch documentation, COA references, and UK dispatch.',
    'Semaglutide peptide UK listings supply research-grade material for non-clinical laboratory models. UK buyers compare documentation, variant sizes, and research-only compliance before ordering.',
    'semaglutide peptide uk',
  ),
};

function normalizeSlug(slug?: string | null) {
  return String(slug || '')
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function matchSlug(slug: string): ProductSeoEnhancement | null {
  if (slug.includes('sodium-chloride') || slug.includes('bacteriostatic-saline')) return enhancements['bacteriostatic-saline'];
  if (slug.includes('hospira') && slug.includes('benzyl')) return enhancements['hospira-bac-water'];
  if (slug === 'bacteriostatic-water') return enhancements['bacteriostatic-water'];
  if (slug === 'glow-blend-ghk-cu-bpc157-tb500') return enhancements['glow-peptide'];
  if (slug === 'kpv') return enhancements.kpv;
  if (slug.startsWith('kpv-')) return enhancements['kpv-vial'];
  if (slug === 'cjc-1295-no-dac-5mg-ipamorelin-5mg-10mg-total-peptide-blend') return enhancements['cjc-ipamorelin'];
  if (slug === 'cjc-1295-with-dac-2mg') return enhancements['cjc-dac-2mg'];
  if (slug === 'cjc-1295-with-dac') return enhancements['cjc-dac'];
  if (slug === 'igf-1-lr3-1mg') return enhancements['igf-1-lr3-1mg'];
  if (slug === 'igf-1-lr3') return enhancements['igf-1-lr3'];
  if (slug === 'igf-1-des-1mg') return enhancements['igf-1-des-1mg'];
  if (slug === 'igf-des' || slug === 'igf-1-des') return enhancements['igf-1-des'];
  if (slug === 'igf-1-1-3-1mg' || slug === 'igf-1') return enhancements['igf-1'];
  if (slug === '5-amino-1mq') return enhancements['5-amino-1mq'];
  if (slug === 'retatrutide') return enhancements.retatrutide;
  if (slug === 'semax') return enhancements.semax;
  if (slug === 'bpc-10mg-tb-10mg-20mg-peptide-blend') return enhancements['bpc-tb500'];
  if (slug === 'follistatin-344-1mg') return enhancements['follistatin-344-1mg'];
  if (slug === 'follistatin') return enhancements.follistatin;
  if (slug === 'nad-500mg') return enhancements['nad-500mg'];
  if (slug === 'nad-250mg') return enhancements['nad-250mg'];
  if (slug === 'nad') return enhancements.nad;
  if (slug === 'hgh-fragment-176-191-10mg') return enhancements['hgh-fragment-10mg'];
  if (slug === 'hgh-fragment-176-191-5mg') return enhancements['hgh-fragment-5mg'];
  if (slug === 'hgh-fragment-176-191') return enhancements['hgh-fragment'];
  if (slug === 'ghrp-2-10mg') return enhancements['ghrp-2-10mg'];
  if (slug === 'ghrp-2-pralmorelin-5mg') return enhancements['ghrp-2-5mg'];
  if (slug === 'ghrp-2-acetate' || slug === 'ghrp-2') return enhancements['ghrp-2'];
  if (slug.startsWith('semaglutide')) return enhancements.semaglutide;
  return null;
}

export function getProductSeoEnhancement(product: {
  slug?: string | null;
  title?: string | null;
}): ProductSeoEnhancement | null {
  const slug = normalizeSlug(product.slug);
  if (slug) {
    const matched = matchSlug(slug);
    if (matched) return matched;
  }
  const fromTitle = normalizeSlug(product.title);
  if (fromTitle && fromTitle !== slug) return matchSlug(fromTitle);
  return null;
}

export function productSeoTitle(enhancement: ProductSeoEnhancement | null, productTitle: string) {
  if (enhancement) return `${enhancement.title} | Research Peptides UK`;
  return `${productTitle || 'Research peptide'} | Research Peptides UK`;
}
