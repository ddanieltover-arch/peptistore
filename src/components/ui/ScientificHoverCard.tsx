import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, ThermometerSnowflake, Activity, Fingerprint } from 'lucide-react';
import { scientificData } from '../../lib/scientificData';

interface ScientificHoverCardProps {
  term: string;
  children?: React.ReactNode;
}

export const ScientificHoverCard: React.FC<ScientificHoverCardProps> = ({ term, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const data = scientificData[term.toLowerCase()];

  // If term isn't in our dictionary, just render the text normally
  if (!data) {
    return <>{children || term}</>;
  }

  return (
    <span 
      className="relative inline-block cursor-help group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="border-b border-dashed border-gray-400 group-hover:border-blue-500 group-hover:text-blue-700 transition-colors duration-300">
        {children || data.title}
      </span>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[320px] sm:w-[380px] z-50 pointer-events-none"
          >
            {/* Dark Frosted Glass Card */}
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-5 text-left text-white">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-700/50">
                <div>
                  <h4 className="text-lg font-black tracking-tight text-white m-0 leading-none mb-1">{data.title}</h4>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold m-0">
                    {data.category}
                  </p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                  <Beaker className="w-5 h-5" />
                </div>
              </div>

              {/* Data Grid */}
              <div className="space-y-3">
                {data.formula && (
                  <div className="flex items-start gap-3">
                    <Fingerprint className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Molecular Formula</span>
                      <span className="text-sm font-mono text-slate-200">{data.formula}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <Activity className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Mechanism of Action</span>
                    <span className="text-xs text-slate-300 leading-relaxed block">{data.mechanism}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                    <ThermometerSnowflake className="w-4 h-4 text-blue-400 mb-2" />
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Storage</span>
                    <span className="text-xs text-slate-300 font-medium leading-tight block">{data.storage}</span>
                  </div>
                  
                  {data.halfLife && (
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                      <Activity className="w-4 h-4 text-emerald-400 mb-2" />
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Half-Life</span>
                      <span className="text-xs text-slate-300 font-medium leading-tight block">{data.halfLife}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Little Triangle Pointer */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-b border-r border-slate-700 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export const ScientificTextRenderer: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  // Create a regex to match any of our scientific terms (case-insensitive, whole word boundaries)
  const terms = Object.keys(scientificData).map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        if (scientificData[lowerPart]) {
          return (
            <ScientificHoverCard key={i} term={lowerPart}>
              {part}
            </ScientificHoverCard>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};
