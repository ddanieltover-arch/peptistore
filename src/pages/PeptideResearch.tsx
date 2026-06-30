import React from 'react';
import { motion } from 'motion/react';
import { Microscope, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import brandReceptionSuite from '../assets/brand/brand-reception-suite.webp';

type ResearchCard = {
  category: string;
  readTime: string;
  title: string;
  summary: string;
};

const researchCards: ResearchCard[] = [
  {
    category: 'Weight & Metabolic',
    readTime: '7 min',
    title: 'GLP-1 Pathway Peptides in Metabolic Research',
    summary: 'A review-oriented overview of receptor pathways, satiety signaling, and protocol design considerations.',
  },
  {
    category: 'Regenerative',
    readTime: '6 min',
    title: 'BPC-157 and TB-500 Mechanistic Notes',
    summary: 'Summary of preclinical pathway discussions related to tissue signaling and experimental model design.',
  },
  {
    category: 'Mitochondrial',
    readTime: '8 min',
    title: 'Mitochondria-Targeted Peptides',
    summary: 'Research framing for mitochondrial peptide investigations and common endpoint measurements.',
  },
  {
    category: 'Anabolic Signaling',
    readTime: '5 min',
    title: 'IGF Axis in Experimental Context',
    summary: 'Practical interpretation notes for dose framework, assay controls, and reproducibility considerations.',
  },
];

export default function PeptideResearch() {
  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Microscope className="h-4 w-4" />
            Evidence Summaries
          </div>
          <h1>Peptide Research</h1>
          <p className="text-gray-500 mt-4 font-medium italic max-w-3xl mx-auto">
            Curated research briefs and mechanistic overviews to support protocol planning and scientific discussion.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg"
        >
          <img
            src={brandReceptionSuite}
            alt="Research Peptides — peptide science, elevated results"
            className="w-full h-48 sm:h-56 md:h-64 object-cover"
          />
        </motion.div>

        <section className="bg-amber-50 border border-amber-100 rounded-3xl p-6 mb-8 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-900 leading-relaxed">
            Research Use Only: Content is educational and not medical advice. Products and references are intended for laboratory research contexts only.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchCards.map((card, idx) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-gray-50 border border-gray-100 rounded-3xl p-7"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{card.category}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{card.readTime}</span>
              </div>
              <h3 className="text-xl font-black tracking-tight mb-3">{card.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{card.summary}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 text-center border-t border-gray-100 pt-10">
          <p className="text-gray-500 text-sm mb-5 max-w-xl mx-auto leading-relaxed">
            Match pathway briefs to catalogue compounds for your next non-clinical study design.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm uppercase tracking-wider"
          >
            Research peptide catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
