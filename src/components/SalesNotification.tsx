import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { europeanLocations, sampleProducts } from '../data/europeanCountries';

interface PurchaseEvent {
  id: number;
  product: string;
  location: { country: string; city: string };
  timeAgo: string;
}

export default function SalesNotification() {
  const [currentEvent, setCurrentEvent] = useState<PurchaseEvent | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Generate a random notification between 15 and 45 seconds continuously
    const scheduleNextNotification = () => {
      const delay = Math.floor(Math.random() * (45000 - 15000 + 1)) + 15000;
      
      return setTimeout(() => {
        const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        const location = europeanLocations[Math.floor(Math.random() * europeanLocations.length)];
        const timeOffsets = ['Just now', '2 minutes ago', '5 minutes ago', '12 minutes ago'];
        const timeAgo = timeOffsets[Math.floor(Math.random() * timeOffsets.length)];
        
        setCurrentEvent({
          id: Date.now(),
          product,
          location,
          timeAgo
        });

        // Auto dismiss after 5 seconds
        setTimeout(() => {
          setCurrentEvent(null);
        }, 5000);

        // Schedule next one
        scheduleNextNotification();
      }, delay);
    };

    const timeout = scheduleNextNotification();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {currentEvent && (
        <motion.div
          key={currentEvent.id}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed z-[60] bottom-20 md:bottom-6 md:left-6 left-1/2 -translate-x-1/2 md:translate-x-0 w-11/12 max-w-[340px]"
        >
          <div 
            onClick={() => currentEvent && navigate(`/search?q=${encodeURIComponent(currentEvent.product)}`)}
            className="bg-white rounded-xl shadow-2xl shadow-blue-900/10 border border-blue-50 overflow-hidden flex items-stretch cursor-pointer hover:bg-gray-50 transition-colors"
          >
            
            <div className="bg-blue-600 flex items-center justify-center px-4">
              <CheckCircle2 className="text-white w-6 h-6" />
            </div>

            <div className="p-3 flex-1">
              <p className="text-[13px] text-gray-500 mb-0.5 leading-tight">
                Someone in <span className="font-semibold text-gray-700">{currentEvent.location.city}, {currentEvent.location.country}</span> purchased
              </p>
              <p className="text-sm font-bold text-gray-900 line-clamp-1 leading-tight">
                {currentEvent.product}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                {currentEvent.timeAgo}
              </p>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentEvent(null);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-3 h-3" />
            </button>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
