import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link, useSearchParams } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { Search as SearchIcon, ShoppingCart, Heart, ChevronDown, Filter, ArrowRight, Sparkles } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { motion, AnimatePresence } from 'motion/react';
import { ProductSkeleton } from '../components/Skeleton';

export default function Search() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<string>('relevance');
  
  const addItem = useCartStore(state => state.addItem);
  const { productIds, toggleWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const addToast = useToastStore(state => state.addToast);
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await supabase.from('products').select('*');
        if (data) setAllProducts(data);
      } catch (error) {
        console.error("Error fetching search data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categoryOptions = Array.from(
    new Set(
      allProducts.flatMap((product) =>
        Array.isArray(product.categories) ? product.categories : []
      )
    )
  ).sort();

  const getFilteredAndSorted = () => {
    let result = allProducts.filter(product => {
      const matchesText =
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!selectedCategory) return matchesText;
      return (
        matchesText &&
        Array.isArray(product.categories) &&
        product.categories.includes(selectedCategory)
      );
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  };

  const filteredProducts = getFilteredAndSorted();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header Hero */}
      <section className="bg-white border-b border-gray-100 pt-20 pb-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
               <motion.div
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex items-center justify-center gap-2 mb-4"
               >
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">Global Database Access</span>
               </motion.div>
               <h1>
                  Peptide <span className="text-blue-600">Search</span> Engine
               </h1>
               
               <div className="relative group max-w-2xl mx-auto">
                 <div className="absolute inset-y-0 left-0 pl-10 flex items-center pointer-events-none">
                   <SearchIcon className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                 </div>
                 <input
                   type="text"
                   className="block w-full pl-20 pr-10 py-6 border-none ring-1 ring-gray-100 rounded-[2.5rem] bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white text-xl font-bold shadow-2xl shadow-blue-900/5 transition-all"
                   placeholder="Enter research compound ID..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>
         </div>
      </section>

      {/* Results Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         {/* Filter Bar */}
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
            <div className="flex flex-wrap gap-3">
               <button
                 onClick={() => setSearchParams({})}
                 className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                   !selectedCategory ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200'
                 }`}
               >
                 All Quantities
               </button>
               {categoryOptions.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setSearchParams({ category: cat })}
                   className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                     selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
            </div>

            <div className="relative inline-block w-full lg:w-64">
               <select 
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className="w-full appearance-none pl-6 pr-12 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 cursor-pointer shadow-sm shadow-gray-200/50"
               >
                  <option value="relevance">Precision Rank</option>
                  <option value="newest">Recent Discovery</option>
                  <option value="price-asc">Yield: Low to High</option>
                  <option value="price-desc">Yield: High to Low</option>
               </select>
               <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
         </div>

         {loading ? (
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
             {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
           </div>
         ) : searchTerm && filteredProducts.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Filter className="h-10 w-10 text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Zero Matches Identified</h3>
              <p className="text-gray-400 font-medium mb-8">Refine your search parameters or check the compound documentation.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-[10px] hover:gap-4 transition-all"
              >
                 Reset Search Engine <ArrowRight className="h-3 w-3" />
              </button>
           </div>
         ) : (
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
              <AnimatePresence>
                {filteredProducts.map((product, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    key={product.id}
                    className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative"
                  >
                     <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-100 text-6xl font-black">{product.title.substring(0, 1)}</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     </Link>

                     <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex-grow pr-4">
                              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{product.category}</p>
                              <Link to={`/product/${product.id}`} className="text-lg font-black text-gray-900 leading-tight hover:text-blue-600 transition-colors line-clamp-1">
                                {product.title}
                              </Link>
                           </div>
                           <button 
                             onClick={() => toggleWishlist(product.id, user?.id || '')}
                             className={`p-3 rounded-2xl transition-all ${productIds.includes(product.id) ? 'bg-red-50 text-red-500 shadow-inner' : 'bg-gray-50 text-gray-300 hover:text-blue-600'}`}
                           >
                              <Heart className="h-5 w-5" fill={productIds.includes(product.id) ? "currentColor" : "none"} />
                           </button>
                        </div>

                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-50">
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Verified</p>
                               <p className="text-xl font-black text-gray-900">
                                 {product.variants && product.variants.length > 1 
                                   ? `${formatCurrency(Math.min(...product.variants.map((v: any) => v.display_price)))} – ${formatCurrency(Math.max(...product.variants.map((v: any) => v.display_price)))}`
                                   : formatCurrency(product.price)}
                               </p>
                           </div>
                           <button 
                             onClick={() => {
                               addItem({ productId: product.id, title: product.title, price: product.price, quantity: 1, imageUrl: product.images?.[0] || '' });
                               addToast(`${product.title} archived in cart`);
                             }}
                             className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
                           >
                              <ShoppingCart className="h-5 w-5" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
         )}
      </main>
    </div>
  );
}
