import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { ShoppingCart, Heart, Filter, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { motion, AnimatePresence } from 'motion/react';
import { ProductSkeleton } from '../components/Skeleton';

export default function Shop() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(300); // Max price default
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const addItem = useCartStore(state => state.addItem);
  const { productIds, toggleWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: prodData } = await supabase.from('products').select('*');
        const { data: catData } = await supabase.from('categories').select('name');
        
        if (prodData) {
          setAllProducts(prodData);
          setFilteredProducts(prodData);
        }
        if (catData) {
          setCategories(catData.map(c => c.name));
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    let result = [...allProducts];

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter(p => 
        p.categories && p.categories.some((c: string) => selectedCategories.includes(c))
      );
    }

    // Filter by Price
    result = result.filter(p => p.price <= priceRange);

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredProducts(result);
  }, [allProducts, selectedCategories, priceRange, sortBy]);

  const addToast = useToastStore(state => state.addToast);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange(300);
    setSortBy('newest');
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block space-y-8">
           <div className="h-40 bg-gray-100 animate-pulse rounded-2xl"></div>
           <div className="h-40 bg-gray-100 animate-pulse rounded-2xl"></div>
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Shop Peptides</h1>
          <p className="text-gray-500 mt-1">Showing {filteredProducts.length} high-purity research compounds</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
          
          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block space-y-8 sticky top-24 self-start">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat} className="flex items-center group cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span className={`ml-3 text-sm font-medium transition-colors ${selectedCategories.includes(cat) ? 'text-blue-600 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Price Range</h3>
              <span className="text-blue-600 font-bold text-sm">Under {formatCurrency(priceRange)}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="500" 
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold uppercase">
              <span>€0</span>
              <span>€500+</span>
            </div>
          </div>

          <button 
            onClick={clearFilters}
            className="w-full py-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors flex items-center justify-center gap-2 border border-gray-100 rounded-lg hover:bg-red-50"
          >
            <X className="h-4 w-4" /> Clear All Filters
          </button>
        </aside>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="fixed inset-0 bg-black/50 z-50 md:hidden"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed inset-y-0 right-0 w-80 bg-white z-[60] p-6 shadow-2xl md:hidden"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)}><X className="h-6 w-6" /></button>
                </div>
                {/* Mobile Category Sidebar Content Replicated */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
                    <div className="space-y-3">
                      {categories.map(cat => (
                        <label key={`mobile-${cat}`} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="h-6 w-6 rounded border-gray-300 text-blue-600"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                          />
                          <span className="ml-3 text-base font-medium">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range</h3>
                    <input 
                      type="range" 
                      min="0" 
                      max="500" 
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-center mt-2 font-bold text-blue-600">{formatCurrency(priceRange)}</div>
                  </div>
                  <button 
                    onClick={() => { clearFilters(); setShowMobileFilters(false); }}
                    className="w-full bg-gray-100 py-4 rounded-xl font-bold text-gray-600"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
                  >
                    Show Result
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {/* Active Filter Chips */}
          {(selectedCategories.length > 0 || priceRange < 500) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map(cat => (
                <span key={`chip-${cat}`} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                  {cat}
                  <button onClick={() => toggleCategory(cat)} className="ml-2 hover:text-blue-900"><X className="h-3 w-3" /></button>
                </span>
              ))}
              {priceRange < 500 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                  Under {formatCurrency(priceRange)}
                  <button onClick={() => setPriceRange(500)} className="ml-2 hover:text-blue-900"><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                 <Filter className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products match your filters</h3>
              <p className="text-gray-500 mb-6">Try adjusting your price range or categories</p>
              <button 
                onClick={clearFilters}
                className="inline-flex items-center font-bold text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={product.id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500"
                >
                  <Link to={`/product/${product.id}`} className="block relative h-64 bg-gray-100 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold uppercase tracking-tighter italic">Peptistore</div>
                    )}
                    {product.inventory < 10 && (
                      <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                        Low Stock
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </Link>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-grow pr-4">
                        <Link to={`/product/${product.id}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                          {product.title}
                        </Link>
                        {product.categories && (
                          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{product.categories[0]}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => toggleWishlist(product.id, user?.id || '')}
                        className={`p-2 rounded-full transition-all duration-300 transform active:scale-75 ${productIds.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                      >
                        <Heart className="h-5 w-5" fill={productIds.includes(product.id) ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed font-medium">{product.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">Price starting at</span>
                        <span className="text-2xl font-black text-gray-900">{formatCurrency(product.price)}</span>
                      </div>
                      <button 
                        onClick={() => {
                          addItem({
                            productId: product.id,
                            title: product.title,
                            price: product.price,
                            quantity: 1,
                            imageUrl: product.images?.[0] || ''
                          });
                          addToast(`${product.title} added to cart!`);
                        }}
                        className="bg-blue-600 text-white p-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-200/50 active:scale-95"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
