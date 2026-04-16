import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link, useSearchParams } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { Search as SearchIcon, ShoppingCart, Heart, ChevronDown, Filter } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { motion } from 'motion/react';
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

  const clearAllFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 tracking-tight">Search Research Peptides</h1>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-16 pr-6 py-5 border-2 border-gray-100 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 sm:text-lg shadow-sm transition-all"
            placeholder="Type to search e.g. 'Tirzepatide', 'Weight Loss'..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                !selectedCategory
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-blue-200'
              }`}
            >
              All Categories
            </button>
            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSearchParams({ category })}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-blue-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[170px]"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Sort: Price Low-High</option>
              <option value="price-desc">Sort: Price High-Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : searchTerm && filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
             <Filter className="h-8 w-8 text-gray-300" />
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">No results matching "{searchTerm}"</p>
          <p className="text-gray-500 mb-6">Try checking your spelling or use broader terms.</p>
          <button onClick={() => setSearchTerm('')} className="text-blue-600 font-bold hover:underline">Clear search and try again</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              key={product.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500"
            >
              <Link to={`/product/${product.id}`} className="block relative h-56 bg-gray-100 overflow-hidden">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold italic tracking-tighter uppercase text-xs">No Image</div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </Link>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-grow pr-3">
                    <Link to={`/product/${product.id}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                      {product.title}
                    </Link>
                    {product.categories && (
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{product.categories[0]}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => toggleWishlist(product.id, user?.id || '')}
                    className={`p-2 rounded-full transition-all duration-300 ${productIds.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <Heart className="h-4 w-4" fill={productIds.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                   <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Price from</span>
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
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
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
  );
}
