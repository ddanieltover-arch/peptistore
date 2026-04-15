import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatCurrency } from '../lib/utils';
import { ShoppingCart, Star, Heart, Share2, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [showShare, setShowShare] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);
  const { user, profile } = useAuthStore();
  const { productIds, toggleWishlist } = useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data: pData } = await supabase.from('products').select('*').eq('id', id).single();
        if (pData) setProduct(pData);

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
        price: product.price,
        quantity,
        imageUrl: product.images?.[0] || ''
      });
      navigate('/cart');
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-gray-100 rounded-lg aspect-square overflow-hidden flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400">No Image Available</div>
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
          
          <div className="flex items-center mb-6">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < (product.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
          </div>
          
          <div className="text-3xl font-bold text-gray-900 mb-6">{formatCurrency(product.price)}</div>
          
          <p className="text-gray-600 mb-8 whitespace-pre-line">{product.description}</p>

          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-2">Specifications:</h3>
              <ul className="list-disc pl-5 text-gray-600">
                {product.specifications.map((spec: string, i: number) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-gray-600 hover:bg-gray-100">-</button>
              <span className="px-4 py-3 font-medium border-x border-gray-300">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-gray-600 hover:bg-gray-100">+</button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-bold hover:bg-blue-700 flex items-center justify-center transition-colors"
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recommended.map(rec => (
              <Link key={rec.id} to={`/product/${rec.id}`} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group">
                <div className="h-40 bg-gray-200">
                  {rec.images && rec.images.length > 0 ? (
                     <img src={rec.images[0]} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-1">{rec.title}</h3>
                  <p className="font-bold text-gray-900 mt-2">{formatCurrency(rec.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
