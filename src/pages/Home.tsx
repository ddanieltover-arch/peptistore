import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Truck, ShoppingCart, Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../supabase';
import { formatCurrency } from '../lib/utils';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { ProductSkeleton } from '../components/Skeleton';
import heroImage from '../assets/hero_peptides.png';

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const addToast = useToastStore(state => state.addToast);
  const { productIds, toggleWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase.from('products').select('*').limit(4);
      if (data) setFeatured(data);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Research Lab"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-200 text-xs font-black uppercase tracking-[0.2em]">Purity Excellence Guaranteed</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-6 tracking-tighter">
              PREMIUM <br />
              <span className="text-blue-500">PEPTIDES.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 font-medium mb-10 leading-relaxed max-w-lg">
              Unlock the core of scientific research with elite-grade peptides. HPLC tested. Worldwide stealth shipping.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="group relative bg-white text-gray-900 font-black py-5 px-10 rounded-2xl flex items-center justify-center overflow-hidden transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-2">
                  EXPLORE CATALOG <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
              <Link
                to="/about"
                className="bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold py-5 px-10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
              >
                OUR PROCESS
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Interactive Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1">
            <div className="w-1 h-2 bg-blue-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Trust Stats */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-8">
          {[
            { label: 'Purity Level', value: '99.8%' },
            { label: 'Happy Researchers', value: '15k+' },
            { label: 'Countries Shipped', value: '85+' },
            { label: 'Crypto Accepted', value: 'BTC/ETH/SOL' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-blue-600 font-black text-3xl tracking-tighter">{stat.value}</span>
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-xs">Curated Selection</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mt-2">TRENDING NOW</h2>
            </div>
            <Link to="/shop" className="text-gray-900 font-black flex items-center gap-2 hover:gap-4 transition-all uppercase text-sm tracking-widest">
              View Collection <ArrowRight className="h-5 w-5 text-blue-500" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[2rem] p-2 shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-500"
                >
                  <Link to={`/product/${product.id}`} className="block relative aspect-square rounded-[1.8rem] overflow-hidden bg-gray-100 mb-6">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id, user?.id || '');
                      }}
                      className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 transition-all active:scale-75 shadow-lg"
                    >
                      <Heart className="h-5 w-5" fill={productIds.includes(product.id) ? "currentColor" : "none"} />
                    </button>
                  </Link>

                  <div className="px-4 pb-6">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 block">In Stock</span>
                    <Link to={`/product/${product.id}`} className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                      {product.title}
                    </Link>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-black text-gray-900">{formatCurrency(product.price)}</span>
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
                        className="bg-gray-100 p-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95"
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
      </section>

      {/* Features Multi-Grid */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter leading-tight">
                WHY RESEARCHERS <br />
                <span className="text-blue-500">TRUST PEPTISTORE</span>
              </h2>
              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: '99% Purity Protocols', desc: 'Each batch is logged and cross-referenced with COA documentation.' },
                  { icon: Zap, title: 'Crypto Privacy', desc: 'Accepting BTC, ETH, USDT for complete transaction anonymity.' },
                  { icon: Truck, title: 'Guaranteed Stealth', desc: 'Bypass delays with our proprietary stealth shipping methods.' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="flex-shrink-0 w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] bg-gray-800 rounded-[3rem] overflow-hidden border border-white/5 relative group">
                <img src={heroImage} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] w-3/4 mx-auto">
                    <Star className="h-10 w-10 text-blue-500 mx-auto mb-4 fill-current" />
                    <p className="text-lg font-medium italic mb-4">"The purity levels are consistent, shipping is exceptional. 5/5 stars for research reliability."</p>
                    <span className="text-xs font-black uppercase tracking-widest text-blue-500">Dr. Sarah K. — Pharma Research</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
