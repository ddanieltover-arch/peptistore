import React from 'react';
import { motion } from 'motion/react';
import { Microscope, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import brandReceptionSuite from '../assets/brand/brand-reception-suite.webp';
import { GeoAnswerCapsule } from '../components/seo/GeoAnswerCapsule';

type ResearchCard = {
  category: string;
  readTime: string;
  title: string;
  summary: string;
  anchor?: string;
};

const researchCards: ResearchCard[] = [
  {
    category: 'Weight & Metabolic',
    readTime: '7 min',
    title: 'GLP-1 Pathway Peptides in Metabolic Research',
    summary: 'A review-oriented overview of receptor pathways, satiety signaling, and protocol design considerations.',
    anchor: '#glp-3',
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
    <main className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Microscope className="h-4 w-4" />
            Evidence Summaries
          </div>
          <h1>Peptide Research UK</h1>
          <p className="text-gray-500 mt-4 font-medium italic max-w-3xl mx-auto">
            Curated peptide research briefs and peptide science overviews for UK laboratory protocol planning and scientific discussion.
          </p>
        </motion.div>

        <GeoAnswerCapsule className="mb-10 text-left" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg"
        >
          <img
            src={brandReceptionSuite}
            alt="UK peptide research laboratory — peptide science and pathway briefs"
            width={1152}
            height={256}
            loading="lazy"
            decoding="async"
            className="w-full h-48 sm:h-56 md:h-64 object-cover"
          />
        </motion.div>

        <section className="bg-amber-50 border border-amber-100 rounded-3xl p-6 mb-10 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-900 leading-relaxed">
            Research Use Only: Content is educational and not medical advice. Products and references are intended for laboratory research contexts only.
          </p>
        </section>

        <section id="what-is-peptide-research-uk" className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-4">What is peptide research in the UK?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Peptide research in the UK covers the laboratory study of short amino-acid chains used to investigate signalling pathways,
            receptor binding, metabolic regulation, and regenerative mechanisms in controlled non-clinical models. UK institutions
            typically source research-grade peptides with documented purity, defined batch identity, and handling protocols aligned
            to internal SOPs.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            This hub consolidates pathway-oriented briefs so researchers can compare GLP, GHRP, KPV, IGF, and mitochondrial peptide
            topics before selecting compounds from the{' '}
            <Link to="/shop" className="text-blue-600 font-semibold hover:underline">
              research peptide catalog
            </Link>
            . For synthesis and analytical fundamentals, see the{' '}
            <Link to="/peptide-guide" className="text-blue-600 font-semibold hover:underline">
              peptide guide
            </Link>{' '}
            and{' '}
            <Link to="/peptide-information" className="text-blue-600 font-semibold hover:underline">
              peptide information
            </Link>{' '}
            pages.
          </p>
        </section>

        <section id="what-is-peptide-science" className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-4">What is peptide science?</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Peptide science is the interdisciplinary study of peptide structure, synthesis, purification, stability, and biological
            activity in experimental systems. It draws on organic chemistry, analytical chemistry, and molecular biology to explain
            how sequence length, modifications, and formulation affect reproducibility in laboratory workflows.
          </p>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 border border-gray-100 rounded-3xl p-8">
            <div>
              <dt className="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">Solid-phase synthesis</dt>
              <dd className="text-sm text-gray-600 leading-relaxed">
                Sequential amino-acid coupling on a resin support — the standard method for producing research peptides at defined lengths.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">Analytical verification</dt>
              <dd className="text-sm text-gray-600 leading-relaxed">
                HPLC and mass spectrometry confirm identity and purity before batches are released for research use. See our{' '}
                <Link to="/coas" className="text-blue-600 font-semibold hover:underline">
                  tested peptides COA library
                </Link>
                .
              </dd>
            </div>
            <div>
              <dt className="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">Pathway research</dt>
              <dd className="text-sm text-gray-600 leading-relaxed">
                Investigates receptor interactions and downstream signalling — common in GLP, IGF, and regenerative peptide studies.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">Custom synthesis</dt>
              <dd className="text-sm text-gray-600 leading-relaxed">
                Non-catalog sequences for specialised models. Read our guide on{' '}
                <Link
                  to="/blog/custom-peptide-synthesis-in-the-uk-navigating-quality-and-laboratory-standards"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  custom peptide synthesis in the UK
                </Link>
                .
              </dd>
            </div>
          </dl>
        </section>

        <section id="glp-3" className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-4">What is GLP-3 research in the UK?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>GLP-3</strong> searches in UK peptide research usually refer to laboratory work on glucagon-like peptide
            receptor pathways — especially multi-agonist and next-generation incretin models that extend beyond classic GLP-1
            monotherapy. In catalog and literature contexts, researchers may use “GLP-3” loosely when comparing triple-agonist
            research lines, metabolic pathway assays, and related GLP-family peptide listings.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            UK laboratories studying GLP pathways typically evaluate receptor binding, cAMP signalling, glucose homeostasis models,
            and satiety-related endpoints using research-grade peptides — not approved medicines. Compare documented catalog
            entries such as{' '}
            <Link to="/product/semaglutide" className="text-blue-600 font-semibold hover:underline">
              semaglutide
            </Link>
            ,{' '}
            <Link to="/product/tirzepatide" className="text-blue-600 font-semibold hover:underline">
              tirzepatide
            </Link>
            , and{' '}
            <Link to="/product/retatrutide" className="text-blue-600 font-semibold hover:underline">
              retatrutide
            </Link>{' '}
            research listings alongside your internal protocol requirements.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Before ordering, review HPLC documentation in the{' '}
            <Link to="/coas" className="text-blue-600 font-semibold hover:underline">
              COA library
            </Link>
            , read the{' '}
            <Link to="/blog/semaglutide-peptide-uk-research-brief" className="text-blue-600 font-semibold hover:underline">
              semaglutide peptide UK research brief
            </Link>
            , the{' '}
            <Link to="/blog/semaglutide-the-glp-1-vial-and-the-cagrilintide-blend" className="text-blue-600 font-semibold hover:underline">
              semaglutide listing comparison
            </Link>
            , the{' '}
            <Link to="/blog/tirzepatide-catalogue-listing-and-the-100mg-vial" className="text-blue-600 font-semibold hover:underline">
              tirzepatide listing notes
            </Link>
            , and the{' '}
            <Link to="/blog/semaglutide-tirzepatide-and-retatrutide-as-separate-research-listings" className="text-blue-600 font-semibold hover:underline">
              separate-listing comparison
            </Link>
            . Then browse{' '}
            <Link to="/categories" className="text-blue-600 font-semibold hover:underline">
              GLP peptide categories
            </Link>
            . All compounds are for non-clinical laboratory use only.
          </p>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 border border-gray-100 rounded-3xl p-8">
            <div>
              <dt className="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">GLP-1 models</dt>
              <dd className="text-sm text-gray-600 leading-relaxed">
                Single incretin-receptor agonist peptides used in metabolic and receptor-binding assays.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">Dual / triple agonist research</dt>
              <dd className="text-sm text-gray-600 leading-relaxed">
                Multi-target pathway studies often grouped under broader GLP-family or “GLP-3” catalogue searches.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">Documentation</dt>
              <dd className="text-sm text-gray-600 leading-relaxed">
                Match batch COA purity to assay sensitivity before committing material to long study timelines.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">Compliance</dt>
              <dd className="text-sm text-gray-600 leading-relaxed">
                Research peptides are not for human or veterinary administration — verify institutional approval first.
              </dd>
            </div>
          </dl>
        </section>

        <section id="pathway-briefs" className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Which peptide pathways do researchers study?</h2>
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
                <h3 className="text-xl font-black tracking-tight mb-3">
                  {card.anchor ? (
                    <Link to={card.anchor} className="hover:text-blue-600 transition-colors">
                      {card.title}
                    </Link>
                  ) : (
                    card.title
                  )}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.summary}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="related-resources" className="border-t border-gray-100 pt-10">
          <h2 className="text-xl font-black text-gray-900 mb-4">Where should I go next?</h2>
          <ul className="space-y-3 text-sm text-gray-600 leading-relaxed mb-8">
            <li>
              <Link to="/shop" className="text-blue-600 font-semibold hover:underline">
                Browse the research peptide catalog
              </Link>{' '}
              — compare compounds by category, documentation, and UK dispatch options.
            </li>
            <li>
              <Link to="/blog" className="text-blue-600 font-semibold hover:underline">
                Peptide research blog
              </Link>{' '}
              — longer articles on synthesis, storage, and laboratory standards.
            </li>
            <li>
              <Link to="/about-us" className="text-blue-600 font-semibold hover:underline">
                About our UK peptide lab focus
              </Link>{' '}
              — supplier positioning, quality controls, and support channels.
            </li>
            <li>
              <Link to="/contact" className="text-blue-600 font-semibold hover:underline">
                Oxford peptides and UK contact support
              </Link>{' '}
              — institutional procurement and COA requests.
            </li>
          </ul>
          <div className="text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm uppercase tracking-wider"
            >
              Research peptide catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
