export interface ScientificTermData {
  title: string;
  category: string;
  formula?: string;
  mechanism: string;
  storage: string;
  halfLife?: string;
}

export const scientificData: Record<string, ScientificTermData> = {
  'bpc-157': {
    title: 'BPC-157',
    category: 'Tissue Repair Peptide',
    formula: 'C62H98N16O22',
    mechanism: 'Promotes angiogenesis by upregulating VEGF expression, accelerating the healing of tendons, muscles, and the nervous system.',
    storage: '-20°C (Lyophilized) | 2-8°C (Reconstituted)',
    halfLife: '~4 hours'
  },
  'tb-500': {
    title: 'TB-500',
    category: 'Healing & Recovery',
    formula: 'C212H350N56O78S',
    mechanism: 'Synthetic version of Thymosin Beta-4. Acts as an actin-binding protein, promoting cell migration, tissue repair, and reducing inflammation.',
    storage: '-20°C (Lyophilized) | 2-8°C (Reconstituted)',
    halfLife: '~2 hours'
  },
  'ghk-cu': {
    title: 'GHK-Cu',
    category: 'Copper Peptide',
    formula: 'C14H24N6O4',
    mechanism: 'Stimulates collagen and elastin synthesis, acts as an antioxidant, and promotes blood vessel and nerve outgrowth.',
    storage: 'Room Temp (Lyophilized) | 2-8°C (Reconstituted)',
  },
  'kpv': {
    title: 'KPV',
    category: 'Anti-inflammatory Peptide',
    formula: 'C16H31N5O4',
    mechanism: 'A naturally occurring peptide derived from alpha-MSH. Exhibits potent systemic anti-inflammatory and antimicrobial properties.',
    storage: '-20°C (Lyophilized) | 2-8°C (Reconstituted)',
  },
  'igf-1': {
    title: 'IGF-1 LR3',
    category: 'Growth Factor',
    formula: 'C400H625N111O115S6',
    mechanism: 'Recombinant analog of Insulin-like Growth Factor-1. Modulates cellular growth, proliferation, and survival by activating the AKT signaling pathway.',
    storage: '-20°C (Lyophilized) | 2-8°C (Reconstituted)',
    halfLife: '20-30 hours'
  },
  'vegf': {
    title: 'VEGF',
    category: 'Signaling Protein',
    mechanism: 'Vascular Endothelial Growth Factor. A key signaling protein that stimulates the formation of blood vessels (angiogenesis).',
    storage: 'N/A'
  },
  'lyophilized': {
    title: 'Lyophilization',
    category: 'Preservation Process',
    mechanism: 'A freeze-drying process that extracts water from biological samples while preserving their molecular structure, extending shelf-life significantly.',
    storage: 'Keep away from moisture and light.'
  }
};
