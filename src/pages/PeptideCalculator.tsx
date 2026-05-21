import React from 'react';
import { motion } from 'motion/react';
import { Calculator } from 'lucide-react';
import { InteractiveReconstitutionCalculator } from '../components/ui/InteractiveReconstitutionCalculator';

export default function PeptideCalculator() {
  return (
    <div className="bg-slate-50 min-h-screen pt-12 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Calculator className="h-4 w-4" />
            Lab Utility
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Interactive Calculator</h1>
          <p className="text-slate-500 mt-4 font-medium italic max-w-2xl mx-auto">
            Quick reconstitution and dose-volume estimates for research planning. Validate all values against your SOP and batch documentation.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <InteractiveReconstitutionCalculator />
        </div>
      </div>
    </div>
  );
}
