import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Check, ChevronRight, Beaker } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { formatCurrency } from '../../lib/utils';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

interface Product {
  id: string;
  title: string;
  price: number;
  images?: string[];
  variants?: any[];
}

interface ResearchStackBuilderProps {
  baseProduct: Product;
  basePrice: number;
  recommendedProducts: Product[];
}

const TIER_1_THRESHOLD = 100;
const TIER_1_DISCOUNT = 0.10;
const TIER_2_THRESHOLD = 150;
const TIER_2_DISCOUNT = 0.15;

export const ResearchStackBuilder: React.FC<ResearchStackBuilderProps> = ({ 
  baseProduct, 
  basePrice,
  recommendedProducts 
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const addItem = useCartStore(state => state.addItem);
  const addToast = useToastStore(state => state.addToast);

  if (!recommendedProducts || recommendedProducts.length === 0) return null;

  const toggleProduct = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const getProductPrice = (p: Product) => {
    if (p.variants && p.variants.length > 0) {
      return Math.min(...p.variants.map(v => Number(v.display_price) || 0));
    }
    return Number(p.price) || 0;
  };

  const selectedProducts = recommendedProducts.filter(p => selectedIds.includes(p.id));
  
  const baseValue = Number(basePrice) || 0;
  const addonsValue = selectedProducts.reduce((sum, p) => sum + getProductPrice(p), 0);
  const rawTotal = baseValue + addonsValue;

  let currentDiscount = 0;
  if (rawTotal >= TIER_2_THRESHOLD) {
    currentDiscount = TIER_2_DISCOUNT;
  } else if (rawTotal >= TIER_1_THRESHOLD) {
    currentDiscount = TIER_1_DISCOUNT;
  }

  const finalTotal = rawTotal * (1 - currentDiscount);
  const savings = rawTotal - finalTotal;

  // Progress calculations
  const progressPercent = Math.min(100, (rawTotal / TIER_2_THRESHOLD) * 100);
  const nextTierDiff = rawTotal < TIER_1_THRESHOLD 
    ? TIER_1_THRESHOLD - rawTotal 
    : rawTotal < TIER_2_THRESHOLD 
      ? TIER_2_THRESHOLD - rawTotal 
      : 0;

  const handleAddStack = () => {
    // Add base product
    addItem({
      productId: baseProduct.id,
      title: baseProduct.title,
      price: basePrice * (1 - currentDiscount),
      quantity: 1,
      imageUrl: baseProduct.images?.[0] || '',
    });

    // Add selected recommended products
    selectedProducts.forEach(p => {
      addItem({
        productId: p.id,
        title: p.title,
        price: getProductPrice(p) * (1 - currentDiscount),
        quantity: 1,
        imageUrl: p.images?.[0] || '',
      });
    });

    addToast(`Research Stack (${selectedProducts.length + 1} items) added to cart!`);
  };

  return (
    <div className="mt-12 bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden overflow-hidden relative">
      <div className="absolute top-0 right-0 p-32 bg-blue-50/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/2 opacity-70 pointer-events-none" />
      
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
            <Beaker className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Build Your Research Stack</h2>
        </div>
        <p className="text-sm text-gray-500 mb-8 max-w-lg">
          Combine synergistic peptides to accelerate your research. Unlock automatic bulk discounts based on your total stack value.
        </p>

        {/* Stack Items */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 mb-8">
          {/* Base Product (Locked) */}
          <div className="flex-1 p-4 rounded-2xl border-2 border-blue-200 bg-blue-50/30 flex flex-col items-center text-center relative opacity-90">
            <div className="absolute -top-3 bg-blue-600 text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase shadow-sm">
              Current Target
            </div>
            <div className="h-20 w-20 rounded-xl overflow-hidden bg-white border border-gray-100 mb-3 shadow-sm">
              {baseProduct.images?.[0] ? (
                <img src={baseProduct.images[0]} alt={baseProduct.title} className="w-full h-full object-cover" />
              ) : (
                <ProductImagePlaceholder productId={baseProduct.id} title={baseProduct.title} className="h-full" />
              )}
            </div>
            <p className="text-xs font-bold text-gray-900 line-clamp-2 mb-1">{baseProduct.title}</p>
            <p className="text-sm font-black text-blue-600 mt-auto">{formatCurrency(basePrice)}</p>
          </div>

          <div className="hidden md:flex flex-col justify-center text-gray-300">
            <Plus className="w-6 h-6" />
          </div>

          {/* Recommended Products */}
          {recommendedProducts.slice(0, 3).map((p) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleProduct(p.id)}
                className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all duration-300 relative group ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50/50 shadow-md' 
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className={`absolute top-3 right-3 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-gray-50 group-hover:border-blue-400'
                }`}>
                  <Check className={`w-3 h-3 text-white transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                </div>

                <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3 group-hover:scale-105 transition-transform duration-300">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <ProductImagePlaceholder productId={p.id} title={p.title} className="h-full" />
                  )}
                </div>
                <p className="text-xs font-bold text-gray-700 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">{p.title}</p>
                <p className="text-sm font-black text-gray-900 mt-auto">{formatCurrency(getProductPrice(p))}</p>
              </button>
            );
          })}
        </div>

        {/* Progress Bar & Summary Area */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="mb-6 relative">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">
              <span>Stack Synergy</span>
              {currentDiscount > 0 ? (
                <span className="text-emerald-500 animate-pulse">{currentDiscount * 100}% Discount Unlocked</span>
              ) : (
                <span>{formatCurrency(TIER_1_THRESHOLD)} unlocks 10% off</span>
              )}
            </div>
            
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                className={`h-full rounded-full relative overflow-hidden ${currentDiscount >= TIER_2_DISCOUNT ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : currentDiscount >= TIER_1_DISCOUNT ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 'bg-blue-400'}`}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </motion.div>
              
              {/* Threshold Markers */}
              <div className="absolute top-0 bottom-0 left-[66%] w-px bg-white/50 z-10 hidden md:block" />
            </div>

            {nextTierDiff > 0 && (
              <p className="text-xs text-gray-500 mt-3 text-center font-medium">
                Add <span className="font-bold text-gray-900">{formatCurrency(nextTierDiff)}</span> more to unlock the next discount tier.
              </p>
            )}
          </div>

          {/* Price Summary & Checkout */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-200/60">
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              {currentDiscount > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-400 line-through tabular-nums">{formatCurrency(rawTotal)}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-200">
                    Save {formatCurrency(savings)}
                  </span>
                </div>
              )}
              <div className="flex items-end gap-1">
                <span className="text-3xl font-black text-gray-900 tabular-nums leading-none">
                  {formatCurrency(finalTotal)}
                </span>
                <span className="text-xs font-bold text-gray-400 mb-1">Total Stack Value</span>
              </div>
            </div>

            <button
              onClick={handleAddStack}
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 group"
            >
              <ShoppingCart className="w-5 h-5 opacity-80" />
              <span>Add Stack to Cart</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-70" />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};
