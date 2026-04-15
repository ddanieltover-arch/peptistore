import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link, useSearchParams } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { Search as SearchIcon, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function Search() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const addItem = useCartStore(state => state.addItem);
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data) setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categoryOptions = Array.from(
    new Set(
      products.flatMap((product) =>
        Array.isArray(product.categories) ? product.categories : []
      )
    )
  ).sort();

  const filteredProducts = products.filter(product => {
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

  const clearAllFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg shadow-sm transition-shadow"
            placeholder="Search for products, categories, or specifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`px-3 py-1 rounded-full text-sm border ${
              !selectedCategory
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            All Categories
          </button>
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSearchParams({ category })}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading products...</div>
      ) : searchTerm && filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No products found matching "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} className="mt-4 text-blue-600 hover:underline">Clear search</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No products found for this filter.</p>
          <button onClick={clearAllFilters} className="mt-4 text-blue-600 hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
              <Link to={`/product/${product.id}`} className="block relative h-48 bg-gray-200">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 mb-2">
                  {product.title}
                </Link>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                  <button 
                    onClick={() => addItem({
                      productId: product.id,
                      title: product.title,
                      price: product.price,
                      quantity: 1,
                      imageUrl: product.images?.[0] || ''
                    })}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
