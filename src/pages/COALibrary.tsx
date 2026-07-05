import React from 'react';
import { motion } from 'motion/react';
import { FileCheck2, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GeoAnswerCapsule } from '../components/seo/GeoAnswerCapsule';

type COARow = {
  product: string;
  batch: string;
  purity: string;
  testDate: string;
  lab: string;
};

const coaRows: COARow[] = [
  { product: 'BPC-157', batch: 'RP-2504-BPC', purity: '99.1%', testDate: '2026-04-22', lab: 'Independent UK Lab' },
  { product: 'TB-500', batch: 'RP-2504-TB5', purity: '98.9%', testDate: '2026-04-19', lab: 'Independent UK Lab' },
  { product: 'CJC-1295 (No DAC)', batch: 'RP-2504-CJC', purity: '99.3%', testDate: '2026-04-16', lab: 'Independent UK Lab' },
  { product: 'Ipamorelin', batch: 'RP-2504-IPA', purity: '99.0%', testDate: '2026-04-14', lab: 'Independent UK Lab' },
  { product: 'GHK-CU', batch: 'RP-2504-GHK', purity: '98.8%', testDate: '2026-04-12', lab: 'Independent UK Lab' },
];

export default function COALibrary() {
  const [query, setQuery] = React.useState('');
  const filteredRows = coaRows.filter((row) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      row.product.toLowerCase().includes(q) ||
      row.batch.toLowerCase().includes(q) ||
      row.lab.toLowerCase().includes(q)
    );
  });

  return (
    <main className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <FileCheck2 className="h-4 w-4" />
            Verification Portal
          </div>
          <h1>Tested Peptides &amp; COA Library</h1>
          <p className="text-gray-500 mt-4 font-medium italic max-w-3xl mx-auto">
            Search third-party tested peptides and batch-level Certificate of Analysis references for Research Peptides UK catalog lines.
          </p>
        </motion.div>

        <GeoAnswerCapsule className="mb-10 text-left" />

        <section id="what-are-tested-peptides" className="mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-4">What are tested peptides?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Tested peptides are research compounds verified by independent analytical laboratories before dispatch. Each batch
            typically undergoes HPLC purity analysis and identity confirmation so laboratory teams can align incoming material
            with internal acceptance criteria and documentation requirements.
          </p>
          <p className="text-gray-600 leading-relaxed">
            The table below lists published COA references for selected catalog lines. Purity percentages reflect the analytical
            report at time of testing. For full report packs, stability notes, or batch-specific questions, contact{' '}
            <Link to="/contact" className="text-blue-600 font-semibold hover:underline">
              technical support
            </Link>{' '}
            or review our{' '}
            <Link to="/peptide-guide" className="text-blue-600 font-semibold hover:underline">
              peptide quality verification guide
            </Link>
            .
          </p>
        </section>

        <section className="mb-8" aria-label="COA search">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, batch, or lab..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-500">Product</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-500">Batch</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-500">Purity</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-500">Test Date</th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-500">Lab</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.batch} className="border-t border-gray-100">
                    <td className="px-6 py-4 font-bold text-gray-900">{row.product}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.batch}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">{row.purity}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.testDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.lab}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRows.length === 0 && (
            <p className="px-6 py-8 text-sm text-gray-500 text-center">No matching COA references found for your search.</p>
          )}
        </section>

        <section className="mt-8 bg-slate-950 text-white rounded-3xl p-6 md:p-8 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-300 leading-relaxed">
            This library is provided for research documentation visibility. If you need a full report pack for a specific batch,
            request it via{' '}
            <Link to="/contact" className="font-bold text-blue-300 hover:underline">
              contact support
            </Link>{' '}
            or email <span className="font-bold text-blue-300">info@researchpeptide.uk</span>.
            {' '}Learn how to read batch documentation in our{' '}
            <Link to="/peptide-guide" className="font-bold text-blue-300 hover:underline">
              peptide quality verification guide
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
