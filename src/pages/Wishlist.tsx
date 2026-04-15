import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function Wishlist() {
  const { user } = useAuthStore();
  const { productIds, toggleWishlist } = useWishlistStore();
  const addItem = useCartStore(state => state.addItem);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!user || productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase.from('products').select('*').in('id', productIds);
        if (data) setProducts(data);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [user, productIds]);

  if (!user) {
    return <div className="p-8 text-center">Please log in to view your wishlist.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Heart className="mr-3 h-8 w-8 text-red-500 fill-current" /> My Wishlist
      </h1>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading wishlist...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
          <Link to="/shop" className="text-blue-600 font-medium hover:underline">Discover Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group relative">
              <button 
                onClick={() => toggleWishlist(product.id, user.id)}
                className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-sm text-red-500 hover:text-red-700 transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
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
                <div className="flex items-center justify-between mt-4">
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
