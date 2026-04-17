import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { Heart, ShoppingCart, Trash2, ChevronRight, User, Package, Settings, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { motion, AnimatePresence } from 'motion/react';

export default function Wishlist() {
  const { user, profile } = useAuthStore();
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

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
           <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
           <p className="text-xl font-bold text-gray-900">Please log in to view your favorites.</p>
           <Link to="/login" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Dashboard Sidebar */}
          <aside className="w-full lg:w-80 space-y-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
               <div className="h-24 w-24 rounded-full bg-blue-50 p-1 mb-4">
                 <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center">
                   {profile.photo_url ? (
                     <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <User className="h-12 w-12 text-blue-100" />
                   )}
                 </div>
               </div>
               <h2 className="text-2xl font-black text-gray-900 leading-tight">{profile.display_name || 'Researcher'}</h2>
               <p className="text-blue-500 text-xs font-black uppercase tracking-widest mt-1">{profile.role}</p>
            </div>

            <nav className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-2">
               {[
                 { label: 'Overview', icon: User, path: '/profile' },
                 { label: 'Orders', icon: Package, path: '/orders' },
                 { label: 'Wishlist', icon: Heart, path: '/wishlist', active: true },
                 { label: 'Settings', icon: Settings, path: '/profile' }
               ].map((item, i) => (
                 <Link 
                   key={i} 
                   to={item.path}
                   className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                     item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'
                   }`}
                 >
                   <div className="flex items-center gap-4">
                     <item.icon className="h-5 w-5" />
                     <span className="font-bold text-sm">{item.label}</span>
                   </div>
                   <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${item.active ? 'text-white/50' : 'text-gray-300'}`} />
                 </Link>
               ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow space-y-8">
            <div className="flex justify-between items-center mb-4">
               <h1>My Wishlist</h1>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{products.length} Favorites</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-white rounded-[2.5rem] border border-gray-100 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                 <p className="text-xl font-bold text-gray-900">Wishlist empty.</p>
                 <Link to="/shop" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Discover Peptides</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                <AnimatePresence>
                  {products.map((product, idx) => (
                    <motion.div 
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 relative"
                    >
                      {/* Image Area */}
                      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                        {product.images?.[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-300 font-black uppercase tracking-tighter text-4xl">
                              {product.title.substring(0, 1)}
                           </div>
                        )}
                        <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors" />
                      </Link>

                      {/* Content Area */}
                      <div className="p-8">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{product.category}</p>
                               <Link to={`/product/${product.id}`} className="text-lg font-black text-gray-900 leading-tight block hover:text-blue-600 transition-colors">
                                 {product.title}
                               </Link>
                            </div>
                         </div>

                         <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                             <span className="text-xl font-black text-gray-900">
                               {product.variants && product.variants.length > 1 
                                 ? `${formatCurrency(Math.min(...product.variants.map((v: any) => v.display_price)))} – ${formatCurrency(Math.max(...product.variants.map((v: any) => v.display_price)))}`
                                 : formatCurrency(product.price)}
                             </span>
                            
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => toggleWishlist(product.id, user.id)}
                                 className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all group/trash"
                               >
                                  <Trash2 className="h-5 w-5 transition-transform group-hover/trash:scale-110" />
                               </button>
                               <button 
                                 onClick={() => addItem({
                                   productId: product.id,
                                   title: product.title,
                                   price: product.price,
                                   quantity: 1,
                                   imageUrl: product.images?.[0] || ''
                                 })}
                                 className="flex items-center justify-center bg-blue-600 text-white w-12 h-12 rounded-2xl hover:bg-gray-900 hover:shadow-lg transition-all duration-300 shadow-blue-100"
                               >
                                  <ShoppingCart className="h-5 w-5" />
                               </button>
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
