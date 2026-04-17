import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatCurrency } from '../lib/utils';
import { supabase } from '../supabase';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to complete the order.");
      return;
    }
    
    setStep(2); // Go to Payment (Processing) step
    setIsSubmitting(true);
    
    try {
      const totalAmount = getTotal();
      
      const orderData = {
        user_id: user.id,
        items: items,
        total_amount: totalAmount,
        status: 'pending',
        shipping_address: shipping,
      };
      
      // 1. Insert order to Supabase
      const { data: orderResponse, error } = await supabase.from('orders').insert([orderData]).select().single();
      if (error) throw error;
      
      const orderId = orderResponse.id;

      // 2. Clear cart since order is generated
      clearCart();

      // 3. Create Plisio Invoice via our Scraper Service Backend
      const returnUrl = `${window.location.origin}/orders`;
      
      const paymentRes = await fetch('http://localhost:4000/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: totalAmount,
          order_id: orderId,
          return_url: returnUrl
        })
      });

      const paymentData = await paymentRes.json();

      if (paymentRes.ok && paymentData.success && paymentData.invoice_url) {
        // Redirect to Plisio payment gateway
        window.location.href = paymentData.invoice_url;
      } else {
        throw new Error(paymentData.error || "Failed to create invoice");
      }

    } catch (error: any) {
      console.error("Order submission failed:", error);
      const errorMsg = error.message || "An unknown error occurred";
      alert(`Failed to process payment: ${errorMsg}. Your order was saved, but payment could not be initiated.`);
      setStep(3); // Error or completion fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="mb-8">Checkout</h1>
      
      <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
        <div className={`flex-1 text-center ${step >= 1 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>1. Shipping</div>
        <div className="flex-1 h-1 bg-gray-200 mx-2 hidden sm:block"><div className={`h-full bg-blue-600 ${step >= 2 ? 'w-full' : 'w-0'} transition-all`}></div></div>
        <div className={`flex-1 text-center ${step >= 2 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>2. Processing</div>
        <div className="flex-1 h-1 bg-gray-200 mx-2 hidden sm:block"><div className={`h-full bg-blue-600 ${step >= 3 ? 'w-full' : 'w-0'} transition-all`}></div></div>
        <div className={`flex-1 text-center ${step >= 3 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>3. Confirmation</div>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-sm border border-gray-100">
        {step === 1 && (
          <form onSubmit={handleShippingSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900">Shipping Details</h2>
              <span className="text-xl font-black text-blue-600">{formatCurrency(getTotal())}</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Street Address</label>
                <input required type="text" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                  <input required type="text" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Postal Code</label>
                  <input required type="text" value={shipping.postalCode} onChange={e => setShipping({...shipping, postalCode: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Country</label>
                <input required type="text" value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-50">
                Continue to Secure Payment
              </button>
              <p className="text-center text-xs text-gray-400 mt-4 font-bold uppercase tracking-widest">Powered by Plisio Crypto Gateway</p>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="text-center py-16 space-y-6">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">Securing Payment Gateway</h2>
              <p className="text-gray-500 mt-2 font-medium">Generating your unique crypto invoice...</p>
            </div>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">You will be securely redirected to Plisio to complete your transaction in the cryptocurrency of your choice.</p>
          </div>
        )}

        {step === 3 && (
           <div className="text-center py-16">
             <div className="mx-auto w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-6">
               <CheckCircle className="h-10 w-10" />
             </div>
             <h2 className="text-2xl font-black mb-2 text-gray-900">Order Saved Locally</h2>
             <p className="text-gray-500 mb-8 max-w-md mx-auto">There was an issue initializing the payment gateway, but your order has been saved. You can try paying it later from your dashboard.</p>
             <button onClick={() => navigate('/orders')} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-colors w-full sm:w-auto">
               View My Orders
             </button>
           </div>
        )}
      </div>
    </div>
  );
}
