import React from 'react';
import { motion } from 'motion/react';
import { PATHWAYS } from '../../lib/scientificPathways';

interface PathwayFiltersProps {
  selectedPathway: string | null;
  onSelectPathway: (id: string | null) => void;
}

export const PathwayFilters: React.FC<PathwayFiltersProps> = ({ 
  selectedPathway, 
  onSelectPathway 
}) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Filter by Scientific Pathway</h3>
      </div>
      
      {/* Horizontal scroll container */}
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3 no-scrollbar scroll-smooth">
        
        {/* "All" button */}
        <button
          onClick={() => onSelectPathway(null)}
          className={`shrink-0 relative rounded-full px-5 py-3 transition-all duration-300 flex items-center gap-2 ${
            selectedPathway === null 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'bg-white border border-gray-200 text-gray-600 hover:border-slate-400'
          }`}
        >
          <span className="text-sm font-bold">All Peptides</span>
          {selectedPathway === null && (
            <motion.div
              layoutId="pathway-active"
              className="absolute inset-0 rounded-full border-2 border-slate-900 pointer-events-none"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>

        {/* Dynamic Pathway Buttons */}
        {PATHWAYS.map(pathway => {
          const Icon = pathway.icon;
          const isActive = selectedPathway === pathway.id;
          
          return (
            <button
              key={pathway.id}
              onClick={() => onSelectPathway(pathway.id)}
              className={`shrink-0 relative rounded-full px-5 py-3 transition-all duration-300 flex items-center gap-2 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500 group-hover:text-blue-600'}`} />
              <span className="text-sm font-bold">{pathway.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="pathway-active"
                  className="absolute inset-0 rounded-full border-2 border-blue-600 pointer-events-none"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
