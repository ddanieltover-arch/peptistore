import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, Beaker, Droplet, Info, Copy, Check } from 'lucide-react';

interface Props {
  initialMassMg?: number;
  className?: string;
}

export const InteractiveReconstitutionCalculator: React.FC<Props> = ({ 
  initialMassMg = 10,
  className = "" 
}) => {
  const [massMg, setMassMg] = useState(initialMassMg);
  const [diluentMl, setDiluentMl] = useState(2);
  const [targetDoseMcg, setTargetDoseMcg] = useState(250);
  const [copied, setCopied] = useState(false);

  // Sync prop changes (e.g. when product changes on same page)
  useEffect(() => {
    if (initialMassMg) setMassMg(initialMassMg);
  }, [initialMassMg]);

  const concentrationMcgPerMl = diluentMl > 0 ? (massMg * 1000) / diluentMl : 0;
  const requiredVolumeMl = concentrationMcgPerMl > 0 ? targetDoseMcg / concentrationMcgPerMl : 0;
  
  // Standard insulin syringe is 1mL (100 units). Calculate fill percentage.
  const syringeCapacityMl = 1.0; 
  const fillPercentage = Math.min(100, Math.max(0, (requiredVolumeMl / syringeCapacityMl) * 100));
  const units = requiredVolumeMl * 100;

  const round = (val: number) => Math.round(val * 100) / 100;

  const handleCopy = () => {
    const text = `Reconstitution Plan:
Peptide: ${massMg}mg
Water: ${diluentMl}mL
Dose: ${targetDoseMcg}mcg
Draw Volume: ${round(requiredVolumeMl)}mL (${round(units)} units)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-slate-900 rounded-[2.5rem] p-6 md:p-10 shadow-2xl overflow-hidden relative ${className}`}>
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white m-0 leading-tight tracking-tight">Reconstitution Calculator</h3>
          <p className="text-sm font-bold text-slate-400 m-0">Interactive Dosage Planning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Controls Section */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Mass Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-blue-400" />
                Peptide Mass
              </label>
              <div className="text-2xl font-black text-white tabular-nums">{massMg}<span className="text-sm text-slate-500 ml-1">mg</span></div>
            </div>
            <input 
              type="range" min="1" max="50" step="1" 
              value={massMg} 
              onChange={(e) => setMassMg(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>1mg</span><span>50mg</span>
            </div>
          </div>

          {/* Diluent Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-cyan-400" />
                Bacteriostatic Water
              </label>
              <div className="text-2xl font-black text-white tabular-nums">{diluentMl}<span className="text-sm text-slate-500 ml-1">mL</span></div>
            </div>
            <input 
              type="range" min="0.5" max="10" step="0.5" 
              value={diluentMl} 
              onChange={(e) => setDiluentMl(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>0.5mL</span><span>10mL</span>
            </div>
          </div>

          {/* Dose Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-400" />
                Target Dose
              </label>
              <div className="text-2xl font-black text-white tabular-nums">{targetDoseMcg}<span className="text-sm text-slate-500 ml-1">mcg</span></div>
            </div>
            <input 
              type="range" min="50" max="2000" step="50" 
              value={targetDoseMcg} 
              onChange={(e) => setTargetDoseMcg(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>50mcg</span><span>2000mcg</span>
            </div>
          </div>

        </div>

        {/* Visualizer & Results Section */}
        <div className="lg:col-span-5 bg-slate-950/50 border border-slate-800 rounded-[2rem] p-6 relative flex flex-col justify-between">
          
          {/* Animated Syringe Visualizer */}
          <div className="flex justify-center mb-8 pt-4">
            <div className="relative w-16 h-48 bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-inner flex items-end">
              {/* Tick marks */}
              <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between py-2 z-10 opacity-30 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-3 border-b-2 border-white" />
                ))}
              </div>
              
              {/* Liquid Fill */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${fillPercentage}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`w-full relative ${fillPercentage >= 100 ? 'bg-red-500/80' : 'bg-gradient-to-t from-blue-600 to-cyan-400'} shadow-[0_0_20px_rgba(56,189,248,0.4)]`}
              >
                {/* Bubble animations */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Volume</span>
              <span className={`text-2xl font-black tabular-nums ${fillPercentage >= 100 ? 'text-red-400' : 'text-cyan-400'}`}>
                {round(requiredVolumeMl)}<span className="text-sm ml-1 text-slate-500">mL</span>
              </span>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Units</span>
              <span className={`text-2xl font-black tabular-nums ${fillPercentage >= 100 ? 'text-red-400' : 'text-blue-400'}`}>
                {round(units)}<span className="text-sm ml-1 text-slate-500">U</span>
              </span>
            </div>
            
            {fillPercentage >= 100 && (
              <p className="text-[10px] font-bold text-red-400 text-center uppercase tracking-wider mt-2">
                Exceeds 1mL syringe capacity
              </p>
            )}

            <button 
              onClick={handleCopy}
              className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className={copied ? 'text-emerald-400' : ''}>{copied ? 'Copied to clipboard' : 'Copy Plan'}</span>
            </button>
          </div>

        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-800 flex items-start gap-3 text-slate-500">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed font-medium">
          Calculations are based on a standard 1mL (100 unit) insulin syringe. For research planning only. Always confirm final concentrations and dose volumes against method-specific requirements before experimental use.
        </p>
      </div>
    </div>
  );
};
