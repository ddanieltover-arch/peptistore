import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatCurrency } from '../lib/utils';
import { ShoppingCart, Star, Heart, Share2, LinkIcon, ShieldCheck, Zap, Truck, CheckCircle2 } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useToastStore } from '../store/useToastStore';
import { motion } from 'motion/react';
import { DetailedProductSkeleton } from '../components/Skeleton';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [showShare, setShowShare] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  
  const addItem = useCartStore(state => state.addItem);
  const { user, profile } = useAuthStore();
  const { productIds, toggleWishlist } = useWishlistStore();
  const addToast = useToastStore(state => state.addToast);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data: pData } = await supabase.from('products').select('*').eq('id', id).single();
        if (pData) {
          setProduct(pData);
          if (pData.variants && pData.variants.length > 0) {
            setSelectedVariant(pData.variants[0]);
          }
          setActiveImage(0); // Reset image on product change

          // Tracking: Add to Recently Viewed in LocalStorage
          const stored = localStorage.getItem('recentlyViewed');
          let prevIds = stored ? JSON.parse(stored) : [];
          // Keep unique last 10
          prevIds = [id, ...prevIds.filter((pid: string) => pid !== id)].slice(0, 10);
          localStorage.setItem('recentlyViewed', JSON.stringify(prevIds));

          // Fetch details for recently viewed (excluding current)
          const displayIds = prevIds.filter((pid: string) => pid !== id).slice(0, 4);
          if (displayIds.length > 0) {
            const { data: rvData } = await supabase.from('products').select('*').in('id', displayIds);
            if (rvData) setRecentlyViewed(rvData);
          }
        }

        const { data: rData } = await supabase.from('reviews').select('*').eq('product_id', id);
        if (rData) setReviews(rData);

        const { data: recData } = await supabase.from('products').select('*').limit(4);
        if (recData) setRecommended(recData.filter(p => String(p.id) !== id).slice(0, 3));

      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndReviews();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        productId: product.id,
        title: product.title,
        price: selectedVariant ? selectedVariant.price : product.price,
        quantity,
        imageUrl: product.images?.[0] || '',
        specification: selectedVariant ? selectedVariant.name : undefined
      });
      addToast(`${product.title} added to cart!`);
      // navigate('/cart'); // Option: Stay on page for more browsing (better for UX)
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || !id) return;

    try {
      const newReview = {
        product_id: id,
        user_id: user.id,
        author_name: profile.display_name || user.email?.split('@')[0] || 'Anonymous',
        rating,
        comment: reviewText
      };
      const { data, error } = await supabase.from('reviews').insert([newReview]).select().single();
      if (data) {
        setReviews([...reviews, data]);
      }
      setReviewText('');
      setRating(5);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShare(false);
    alert('Link copied to clipboard!');
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DetailedProductSkeleton />
    </div>
  );
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
       <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
       <Link to="/shop" className="text-blue-600 font-bold hover:underline">Return to Shop</Link>
    </div>
  );

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          <div className="bg-white rounded-3xl aspect-square overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm relative group">
            {product.images && product.images.length > 0 ? (
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.images[activeImage]} 
                alt={product.title} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-gray-300 font-bold uppercase italic tracking-tighter text-2xl">Peptistore</div>
            )}
            
            <div className="absolute top-6 left-6 flex flex-col gap-2">
               <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Premium Grade</span>
               {product.inventory < 50 && (
                 <span className="bg-orange-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Low Stock</span>
               )}
            </div>
          </div>

          {/* Thumbnail Switcher */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 p-1 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === i ? 'border-blue-600 shadow-md scale-105' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex space-x-2 relative">
              <button 
                onClick={() => setShowShare(!showShare)}
                className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              >
                <Share2 className="h-6 w-6" />
              </button>
              {showShare && (
                <div className="absolute right-0 top-12 bg-white border border-gray-200 shadow-lg rounded-md p-2 flex space-x-2 z-10">
                  <button onClick={copyLink} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"><LinkIcon className="h-5 w-5" /></button>
                </div>
              )}
              <button 
                onClick={() => toggleWishlist(product.id, user?.id || '')}
                className={`p-2 rounded-full border ${productIds.includes(product.id) ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
              >
                <Heart className="h-6 w-6" fill={productIds.includes(product.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < (product.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
          </div>
          
          <div className="text-3xl font-bold text-gray-900 mb-6">{formatCurrency(currentPrice)}</div>
          
          <p className="text-gray-600 mb-8 whitespace-pre-line">{product.description}</p>

          {/* New Variant Selector Section */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Specification</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                      selectedVariant?.name === v.name
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Product Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.specifications.map((spec: string, i: number) => (
                  <div key={i} className="flex items-center text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                    <span className="line-clamp-1">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust Signals (Phase 3 Prep) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
              <ShieldCheck className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">HPLC Tested</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
              <Truck className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">Stealth Ship</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
              <Zap className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">Express Purtity</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors">-</button>
              <span className="px-5 py-3 font-bold text-gray-900 border-x border-gray-300 bg-white">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors">+</button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900">Recommended for you</h2>
            <Link to="/shop" className="text-blue-600 font-bold hover:underline">View all results</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {recommended.map(rec => (
              <Link key={rec.id} to={`/product/${rec.id}`} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div className="h-48 bg-gray-100 overflow-hidden relative">
                  {rec.images && rec.images.length > 0 ? (
                     <img src={rec.images[0]} alt={rec.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold italic tracking-tighter">Peptistore</div>}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{rec.title}</h3>
                  <p className="text-blue-600 font-black text-xl mt-2">{formatCurrency(rec.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed (Phase 2) */}
      {recentlyViewed.length > 0 && (
        <div className="mb-12 pt-12 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest mb-8">Recently viewed</h2>
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
            {recentlyViewed.map(rv => (
              <Link key={`rv-${rv.id}`} to={`/product/${rv.id}`} className="flex-shrink-0 w-48 group">
                <div className="h-48 rounded-2xl bg-gray-100 overflow-hidden border border-gray-50 group-hover:shadow-lg transition-all">
                  {rv.images?.[0] ? (
                    <img src={rv.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">No Image</div>
                  )
                }
                </div>
                <h4 className="mt-3 text-xs font-bold text-gray-900 group-hover:text-blue-600 line-clamp-1">{rv.title}</h4>
                <p className="text-gray-400 text-xs font-medium mt-1">{formatCurrency(rv.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
