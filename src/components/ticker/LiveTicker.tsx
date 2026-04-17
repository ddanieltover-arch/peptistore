import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, TrendingUp, Zap, Globe } from 'lucide-react';

const TICKER_ITEMS = [
  { icon: AlertCircle, text: "LOW STOCK: BPC-157 5mg Vials - Only 12 remaining", color: "text-orange-500" },
  { icon: Globe, text: "RECENT SHIPMENT: 25x Semaglutide units dispatched to London, UK", color: "text-blue-500" },
  { icon: Zap, text: "PRICE MATCH: Verified 99.8% Purity tracking against European labs", color: "text-green-500" },
  { icon: TrendingUp, text: "TRENDING: Increased research demand for GLP-1 agonists this week", color: "text-indigo-500" },
  { icon: AlertCircle, text: "RESTOCK ALERT: TB-500 10mg Lyophilized powder now available", color: "text-purple-500" },
];

export default function LiveTicker() {
  // We double the items to create a seamless loop
  const displayItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-gray-900 border-b border-white/5 py-2.5 overflow-hidden relative group">
      <motion.div 
        className="flex whitespace-nowrap gap-12 items-center"
        animate={{ x: [0, -1500] }}
        transition={{ 
          repeat: Infinity, 
          duration: 35, 
          ease: "linear",
          repeatType: "loop"
        }}
      >
        {displayItems.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
              {item.text}
            </span>
            <div className="h-1 w-1 bg-gray-700 rounded-full" />
          </div>
        ))}
      </motion.div>
      
      {/* Side fades for luxury look */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
    </div>
  );
}
