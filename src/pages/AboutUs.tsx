import React from 'react';
import { motion } from 'motion/react';
import { Building2, BadgeCheck, Microscope, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import brandStorefrontFrosted from '../assets/brand/brand-storefront-frosted.webp';
import brandStorefrontNight from '../assets/brand/brand-storefront-night.webp';
import { GeoAnswerCapsule } from '../components/seo/GeoAnswerCapsule';

export default function AboutUs() {
  return (
    <main className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40"
        >
          <img
            src={brandStorefrontFrosted}
            alt="Research Peptides UK — UK peptide lab supplier storefront"
            width={1152}
            height={320}
            loading="lazy"
            decoding="async"
            className="w-full h-48 sm:h-64 md:h-80 object-cover"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Building2 className="h-4 w-4" />
            About Research Peptides UK
          </div>
          <h1>About Research Peptides UK</h1>
          <p className="text-gray-500 mt-4 font-medium italic max-w-3xl mx-auto">
            A UK peptide lab supplier supporting research teams with high-purity compounds, transparent documentation,
            and responsive technical support for institutional workflows.
          </p>
        </motion.div>

        <GeoAnswerCapsule className="mb-12 text-left" />

        <section id="peptide-lab-uk" className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-4">What is a peptide lab UK?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            A peptide lab in the UK context needs more than catalog access — it needs repeatable batch identity, documented
            purity checks, clear research-only positioning, and logistics that match institutional timelines. Research Peptides UK
            is built around those requirements: catalogued compounds for non-clinical study, COA references for batch verification,
            and support channels for procurement and technical questions.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We do not provide clinical services or consumption guidance. Instead, we focus on supply-chain transparency for
            qualified researchers comparing{' '}
            <Link to="/shop" className="text-blue-600 font-semibold hover:underline">
              research peptides UK
            </Link>
            , reviewing{' '}
            <Link to="/coas" className="text-blue-600 font-semibold hover:underline">
              tested peptide batches
            </Link>
            , and planning studies using our{' '}
            <Link to="/peptide-research" className="text-blue-600 font-semibold hover:underline">
              peptide research briefs
            </Link>
            .
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-gray-50 border border-gray-100 rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">Our mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We focus on consistency, documentation, and researcher confidence. Every operational process is designed
              to support repeatable scientific work, from product handling to support response standards.
            </p>
          </div>
          <div className="bg-slate-950 text-white rounded-3xl p-8">
            <BadgeCheck className="h-6 w-6 text-blue-400 mb-3" />
            <h3 className="font-black text-lg mb-2">Quality focus</h3>
            <p className="text-sm text-gray-300">
              Batch-level verification and clear documentation are central to our supply approach.
            </p>
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 rounded-3xl overflow-hidden border border-gray-100 shadow-lg"
        >
          <img
            src={brandStorefrontNight}
            alt="Research Peptides UK location — peptide lab supplier"
            width={1152}
            height={288}
            loading="lazy"
            decoding="async"
            className="w-full h-56 md:h-72 object-cover"
          />
        </motion.section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8">
            <Microscope className="h-6 w-6 text-blue-600 mb-3" />
            <h3 className="text-lg font-black mb-2">Research-only positioning</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              All listed compounds are offered for laboratory and scientific research contexts only and are not marketed
              for human or veterinary use.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8">
            <h3 className="text-lg font-black mb-4">Support contact</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                info@researchpeptide.uk
              </p>
              <p>
                <Link to="/contact" className="text-blue-600 font-semibold hover:underline">
                  Contact technical support
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
