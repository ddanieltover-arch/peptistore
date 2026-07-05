import React from 'react';
import { motion } from 'motion/react';
import { BookText, FlaskConical, TestTube2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GeoAnswerCapsule } from '../components/seo/GeoAnswerCapsule';

const infoArticles = [
  { title: 'Intro to Peptides', readTime: '8 min', summary: 'Core terminology, structure basics, and key lab concepts for handling peptide compounds.' },
  { title: 'Peptide Synthesis Overview', readTime: '10 min', summary: 'High-level explanation of solid-phase workflows, cleavage steps, and practical synthesis checkpoints.' },
  { title: 'Peptide Solubility', readTime: '7 min', summary: 'Factors affecting dissolution and practical solvent selection guidance for research use cases.' },
  { title: 'Purification Pathways', readTime: '12 min', summary: 'How chromatographic techniques are used to improve purity and consistency between batches.' },
];

export default function PeptideInformation() {
  return (
    <main className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <BookText className="h-4 w-4" />
            Educational Resources
          </div>
          <h1>Peptide Information</h1>
          <p className="text-gray-500 mt-4 font-medium italic max-w-3xl mx-auto">
            Structured learning resources for peptide chemistry, synthesis, purification, and analytical interpretation in research settings.
          </p>
        </motion.div>

        <GeoAnswerCapsule className="mb-12 text-left max-w-3xl mx-auto" />

        <section id="what-is-peptide-information" className="max-w-3xl mx-auto mb-12 text-sm text-gray-600 leading-relaxed space-y-4">
          <h2 className="text-2xl font-black text-gray-900">What is peptide information used for in research?</h2>
          <p>
            Peptide information pages explain chemistry fundamentals — structure, synthesis routes, solubility, and analytical
            interpretation — so UK laboratory teams can plan non-clinical workflows. They complement the{' '}
            <Link to="/peptide-guide" className="text-blue-600 font-semibold hover:underline">
              peptide guide
            </Link>{' '}
            and{' '}
            <Link to="/peptide-research" className="text-blue-600 font-semibold hover:underline">
              peptide research briefs
            </Link>
            .
          </p>
          <p>
            Need a sequence built to order? Read our{' '}
            <Link
              to="/blog/custom-peptide-synthesis-in-the-uk-navigating-quality-and-laboratory-standards"
              className="text-blue-600 font-semibold hover:underline"
            >
              custom peptide synthesis UK guide
            </Link>{' '}
            for SPPS workflow, quality checks, and catalog vs custom comparison.
          </p>
        </section>

        <section id="how-does-peptide-synthesis-work" className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-4">How does peptide synthesis work in the lab?</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 border border-gray-100 rounded-3xl p-8 mb-12">
            <div>
              <dt className="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">Solid-phase synthesis (SPPS)</dt>
              <dd className="text-sm text-gray-600 leading-relaxed">
                Amino acids are added stepwise to a resin support, enabling automated assembly of defined sequences for research batches.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">Purification &amp; QC</dt>
              <dd className="text-sm text-gray-600 leading-relaxed">
                HPLC purification and mass-spec identity checks confirm that released material matches the ordered sequence and purity target.
              </dd>
            </div>
          </dl>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoArticles.map((article, idx) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-gray-50 border border-gray-100 rounded-3xl p-7"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">{article.readTime}</p>
              <h3 className="text-xl font-black tracking-tight mb-3">{article.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{article.summary}</p>
            </motion.article>
          ))}
        </div>

        <section id="what-affects-solubility" className="max-w-3xl mx-auto mt-12 mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-4">What affects peptide solubility?</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Sequence charge, hydrophobicity, length, and modifications influence solvent choice. Researchers typically test small
            aliquots with recommended buffers before scaling reconstitution for assay work — always aligned to batch documentation
            and internal SOPs.
          </p>
        </section>

        <section className="mt-10 bg-slate-950 text-white rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <FlaskConical className="h-5 w-5 text-blue-400 mb-2" />
            <h4 className="font-black text-sm uppercase tracking-widest mb-1">Research Use Scope</h4>
            <p className="text-sm text-gray-300">Content is intended for laboratory training and research operations only.</p>
          </div>
          <div>
            <TestTube2 className="h-5 w-5 text-blue-400 mb-2" />
            <h4 className="font-black text-sm uppercase tracking-widest mb-1">Method Alignment</h4>
            <p className="text-sm text-gray-300">Always align calculations and handling steps to your internal SOP and compliance requirements.</p>
          </div>
          <div>
            <BookText className="h-5 w-5 text-blue-400 mb-2" />
            <h4 className="font-black text-sm uppercase tracking-widest mb-1">Need Support?</h4>
            <p className="text-sm text-gray-300">
              <Link to="/contact" className="text-blue-300 hover:underline font-semibold">
                Contact technical support
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
