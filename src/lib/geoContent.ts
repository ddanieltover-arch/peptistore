/** Shared GEO/AEO copy for llms.txt generation and FAQ expansion. */
export const pillarBlogSlugs = [
  'custom-peptide-synthesis-in-the-uk-navigating-quality-and-laboratory-standards',
  'how-to-buy-research-peptides-in-the-uk',
  'what-are-research-peptides',
  'oxford-peptides-and-uk-research-sourcing',
  'semaglutide-peptide-uk-research-brief',
] as const;

export const geoCommonQuestions: Array<{ q: string; a: string }> = [
  {
    q: 'What are research peptides?',
    a: 'Research peptides are short amino-acid chains supplied for non-clinical laboratory study — not for human or veterinary use. UK researchers evaluate purity documentation, storage requirements, and research-only supplier policies before ordering.',
  },
  {
    q: 'How do I buy research peptides in the UK?',
    a: 'Qualified laboratories compare research-only catalog listings, COA references, UK dispatch options, and institutional procurement rules before checkout. See the buy guide and shop catalog for peptides buy UK workflows.',
  },
  {
    q: 'What is custom peptide synthesis?',
    a: 'Custom peptide synthesis is on-demand production of a specific amino-acid sequence for laboratory research, usually via solid-phase synthesis with HPLC and mass-spec verification before batch release.',
  },
  {
    q: 'What are tested peptides?',
    a: 'Tested peptides are research compounds verified by independent analytical laboratories. Batch COA references typically include HPLC purity, test dates, and batch IDs for laboratory audit trails.',
  },
  {
    q: 'What is peptide science UK research focused on?',
    a: 'Peptide science in UK labs covers synthesis methods, receptor pathways, analytical verification, storage, and protocol planning for non-clinical peptide studies — distinct from clinical or retail supplement use.',
  },
  {
    q: 'What is GLP-3 in peptide research?',
    a: 'GLP-3 searches often refer to glucagon-like peptide receptor pathway research, including multi-agonist incretin models studied in UK metabolic and receptor-binding assays using research-grade peptides only.',
  },
];
