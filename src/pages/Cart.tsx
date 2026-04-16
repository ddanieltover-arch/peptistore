import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency } from '../lib/utils';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any peptides to your cart yet.</p>
        <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div key={`${item.productId}-${item.specification}-${index}`} className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center px-2">No Image available</div>
                )}
              </div>
              <div className="ml-6 flex-grow">
                <Link to={`/product/${item.productId}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  {item.title}
                </Link>
                {item.specification && (
                  <div className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase tracking-wider">
                    Specification: {item.specification}
                  </div>
                )}
                <div className="text-blue-600 font-bold mt-1 text-base">{formatCurrency(item.price)}</div>
                <div className="flex items-center mt-4 space-x-6">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button 
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.specification)}
                      className="p-1 px-3 text-gray-600 hover:bg-gray-200 transition-colors border-r border-gray-200"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-5 py-1 text-sm font-bold text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.specification)}
                      className="p-1 px-3 text-gray-600 hover:bg-gray-200 transition-colors border-l border-gray-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.productId, item.specification)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center transition-colors px-2 py-1 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-xl font-black text-gray-900 ml-4">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 h-fit sticky top-24">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-600 font-medium">
              <span>Subtotal</span>
              <span className="text-gray-900">{formatCurrency(getTotal())}</span>
            </div>
            <div className="flex justify-between text-gray-600 font-medium">
              <span>Shipping</span>
              <span className="text-gray-400 italic text-sm">Calculated at checkout</span>
            </div>
            <div className="h-px bg-gray-100 my-4"></div>
            <div className="flex justify-between items-center">
               <span className="text-lg font-bold text-gray-900">Total</span>
               <span className="text-2xl font-black text-blue-600">{formatCurrency(getTotal())}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Proceed to Checkout
          </button>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-blue-700 text-xs font-semibold uppercase tracking-widest flex items-center justify-center">
              <span className="mr-2">🔒</span> Secure Crypto Payment Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
