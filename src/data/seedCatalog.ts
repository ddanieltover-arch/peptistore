export type SeedCategory = {
  name: string;
  slug: string;
  description: string;
};

export type SeedProduct = {
  title: string;
  description: string;
  price: number;
  inventory: number;
  categories: string[];
  specifications: string[];
  image: string;
  rating: number;
  reviewCount: number;
};

export const referenceSeedCategories: SeedCategory[] = [
  {
    name: 'Peptides',
    slug: 'peptides',
    description: 'High-purity research peptides for scientific and academic studies.',
  },
  {
    name: 'SARMs',
    slug: 'sarms',
    description: 'Selective Androgen Receptor Modulators for research applications.',
  },
  {
    name: 'Research Chemicals',
    slug: 'research-chemicals',
    description: 'Premium grade research chemicals and laboratory reagents.',
  },
  {
    name: 'Peptide Blends',
    slug: 'peptide-blends',
    description: 'Synergistic combinations of research peptides in single vials.',
  },
  {
    name: 'Peptide Capsules',
    slug: 'peptide-capsules',
    description: 'Oral format research compounds for metabolic and signaling studies.',
  },
  {
    name: 'IGF-1 Proteins',
    slug: 'igf-1-proteins',
    description: 'Insulin-like Growth Factor analogs and related proteins.',
  },
  {
    name: 'Melanotan Peptides',
    slug: 'melanotan-peptides',
    description: 'Melanocortin receptor agonists for pigmentation research.',
  },
  {
    name: 'Supplements',
    slug: 'supplements',
    description: 'General laboratory and research-grade nutritional compounds.',
  },
  {
    name: 'Lab Supplies',
    slug: 'lab-supplies',
    description: 'Bacteriostatic water and essential chemical reconstitution supplies.',
  }
];

export const referenceSeedProducts: SeedProduct[] = [
  // ----- PEPTIDES & RESEARCH CHEMICALS FROM UK SITE -----
  {
    title: 'Tirzepatide',
    description: 'Advanced dual GIP and GLP-1 receptor agonist designed for metabolic research.',
    price: 142.50, // Approx $150
    inventory: 150,
    categories: ['peptides', 'research-chemicals'],
    specifications: ['Lyophilized powder', 'Research use only', 'Dual agonist'],
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    reviewCount: 42,
  },
  {
    title: 'Semaglutide - GLP-1',
    description: 'High-purity GLP-1 receptor agonist for blood glucose and metabolic pathway studies.',
    price: 114.00, // Approx $120
    inventory: 200,
    categories: ['peptides', 'research-chemicals'],
    specifications: ['GLP-1 Analog', 'Lyophilized', 'Batch purity tested'],
    image: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviewCount: 89,
  },
  {
    title: 'Retatrutide GLP-3',
    description: 'Cutting-edge triple agonist (GLP-1, GIP, GCGR) for complex metabolic research models.',
    price: 95.00, // Approx $100
    inventory: 90,
    categories: ['peptides', 'research-chemicals'],
    specifications: ['Triple agonist', 'Research Grade', 'Verified Purity'],
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviewCount: 31,
  },
  {
    title: 'Tesofensine 500mcg (60 Capsules)',
    description: 'Monoamine reuptake inhibitor supplied in capsule format for neurological and metabolic studies.',
    price: 160.50, // Approx $169
    inventory: 45,
    categories: ['peptide-capsules', 'research-chemicals'],
    specifications: ['500mcg per capsule', '60 count', 'Oral research format'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    reviewCount: 19,
  },
  {
    title: 'BPC 5mg + TB 5mg Blend',
    description: 'Synergistic combination of Body Protection Compound and Thymosin Beta 4 for connective tissue research.',
    price: 85.50, // Approx $90
    inventory: 110,
    categories: ['peptide-blends', 'peptides'],
    specifications: ['10mg total blend', '5mg + 5mg ratio', 'Lyophilized'],
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=900&q=80',
    rating: 5.0,
    reviewCount: 67,
  },
  {
    title: 'CJC-1295 No DAC 5mg + Ipamorelin 5mg',
    description: 'Classic GH-axis blend combining two potent secretagogues for synergistic receptor activation studies.',
    price: 85.50, // Approx $90
    inventory: 85,
    categories: ['peptide-blends', 'peptides'],
    specifications: ['10mg total blend', '5mg + 5mg ratio', 'Cold storage required'],
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviewCount: 54,
  },
  {
    title: 'LL-37',
    description: 'Antimicrobial peptide referenced in immunomodulation and pathogen defense research.',
    price: 99.25, // Approx $104.5
    inventory: 30,
    categories: ['peptides', 'research-chemicals'],
    specifications: ['Antimicrobial peptide', 'High purity', 'Research use only'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    rating: 4.5,
    reviewCount: 12,
  },
  {
    title: 'HGH Fragment 176-191 10mg',
    description: 'Fragmented portion of the HGH chain, often evaluated for isolated metabolic properties.',
    price: 56.99, // Approx $59.99
    inventory: 130,
    categories: ['peptides'],
    specifications: ['10mg vial', 'Fragment 176-191', 'Lyophilized powder'],
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviewCount: 22,
  },

  // ----- SARMS & OTHERS FROM US SITE -----
  {
    title: 'MK-677 / Ibutamoren 25mg x 30ml',
    description: 'Liquid-format orally active GH secretagogue for long-term signaling cascade evaluation.',
    price: 61.75, // Approx $65
    inventory: 180,
    categories: ['sarms', 'research-chemicals'],
    specifications: ['25mg/ml concentration', '30ml bottle', 'Liquid research suspension'],
    image: 'https://images.unsplash.com/photo-1607619056271-8bb0c1d5f74f?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    reviewCount: 112,
  },
  {
    title: 'BPC-157 5mg',
    description: 'Stable gastric pentadecapeptide utilized in systemic cellular healing and repair models.',
    price: 23.75, // Approx $25
    inventory: 250,
    categories: ['peptides'],
    specifications: ['5mg vial', 'Batch purity verified', 'Research protocol grade'],
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
    reviewCount: 156,
  },
  {
    title: 'Thymosin Beta 4 (TB500) 10mg',
    description: 'Actin-binding protein synthetic analog studied for its role in cell migration and tissue repair.',
    price: 47.50, // Approx $50
    inventory: 140,
    categories: ['peptides'],
    specifications: ['10mg vial', 'Lyophilized powder', 'High purity'],
    image: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviewCount: 88,
  },
  {
    title: 'IGF-1 LR3 1mg',
    description: 'Extended half-life variant of Insulin-like Growth Factor-1 for prolonged cellular receptor studies.',
    price: 57.00, // Approx $60
    inventory: 70,
    categories: ['igf-1-proteins', 'peptides'],
    specifications: ['1mg vial', 'Recombinant protein', 'Research grade'],
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviewCount: 45,
  },
  {
    title: 'MT-2 (Melanotan 2 Acetate) 10mg',
    description: 'Synthetic melanocortin receptor agonist widely referenced in photoprotection and pigmentation studies.',
    price: 28.50, // Approx $30
    inventory: 190,
    categories: ['melanotan-peptides'],
    specifications: ['10mg vial', 'Acetate form', 'Dark packaging'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
    reviewCount: 63,
  },
  {
    title: 'MOTS-C 10mg',
    description: 'Mitochondrial-derived peptide implicated in metabolic regulation and cellular stress response.',
    price: 42.75, // Approx $45
    inventory: 85,
    categories: ['peptides', 'research-chemicals'],
    specifications: ['10mg vial', 'Mitochondrial derived', 'Lyophilized'],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
    reviewCount: 29,
  },
  {
    title: 'Thymosin Alpha-1 10mg',
    description: 'Potent immune system modulator synthesized for immune response mapping studies.',
    price: 61.75, // Approx $65
    inventory: 60,
    categories: ['peptides'],
    specifications: ['10mg vial', 'Immune modulator', 'Research use only'],
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
    reviewCount: 21,
  },
  {
    title: 'Bacteriostatic Water 0.9% Benzyl Alcohol 30mL',
    description: 'Crucial laboratory supply for the reconstitution and sterile preparation of lyophilized research compounds.',
    price: 14.25, // Approx $15
    inventory: 500,
    categories: ['lab-supplies'],
    specifications: ['30mL sterile vial', '0.9% benzyl alcohol', 'For laboratory preparation'],
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=900&q=80',
    rating: 5.0,
    reviewCount: 215,
  }
];
