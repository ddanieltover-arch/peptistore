import { Activity, Brain, Flame, Heart, Dna } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface ScientificPathway {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  keywords: string[];
}

export const PATHWAYS: ScientificPathway[] = [
  {
    id: 'tissue-repair',
    label: 'Tissue & Muscle Repair',
    description: 'Compounds that accelerate healing, angiogenesis, and cellular regeneration.',
    icon: Activity,
    keywords: ['bpc-157', 'tb-500', 'healing', 'repair', 'recovery', 'angiogenesis', 'thymosin', 'fibroblast'],
  },
  {
    id: 'metabolic',
    label: 'Metabolic & Fat Loss',
    description: 'Lipolytic agents that target adipose tissue and regulate metabolism.',
    icon: Flame,
    keywords: ['fat loss', 'metabolic', 'aod', 'aod-9604', 'lipolytic', 'adipose', 'weight', 'tesofensine', 'motsc'],
  },
  {
    id: 'growth',
    label: 'Growth & Rejuvenation',
    description: 'Secretagogues (GHRH/GHRP) and factors promoting systemic growth.',
    icon: Dna,
    keywords: ['ghrh', 'ghrp', 'igf', 'growth', 'sermorelin', 'tesamorelin', 'ipamorelin', 'cjc-1295', 'mk-677'],
  },
  {
    id: 'cognitive',
    label: 'Cognitive & Neuro',
    description: 'Nootropics and neuro-protective agents.',
    icon: Brain,
    keywords: ['cognitive', 'selank', 'semax', 'neuro', 'brain', 'nootropic', 'dihexa', 'cerebrolysin'],
  },
  {
    id: 'cardio',
    label: 'Cardiovascular Health',
    description: 'Compounds studied for endothelial function and heart health.',
    icon: Heart,
    keywords: ['cardio', 'heart', 'endothelial', 'blood flow', 'vasodilation'],
  }
];
