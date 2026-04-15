import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatCurrency } from '../lib/utils';
import { supabase } from '../supabase';
import { Bitcoin, Copy, CheckCircle } from 'lucide-react';

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
  const [txHash, setTxHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const btcAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"; // Mock address

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(btcAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to complete the order.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const orderData = {
        user_id: user.id,
        items: items,
        total_amount: getTotal(),
        status: 'pending',
        shipping_address: shipping,
        crypto_tx_hash: txHash
      };
      
      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) throw error;
      
      clearCart();
      setStep(3);
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex items-center justify-between mb-8">
        <div className={`flex-1 text-center ${step >= 1 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>1. Shipping</div>
        <div className="flex-1 h-1 bg-gray-200 mx-2"><div className={`h-full bg-blue-600 ${step >= 2 ? 'w-full' : 'w-0'} transition-all`}></div></div>
        <div className={`flex-1 text-center ${step >= 2 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>2. Payment</div>
        <div className="flex-1 h-1 bg-gray-200 mx-2"><div className={`h-full bg-blue-600 ${step >= 3 ? 'w-full' : 'w-0'} transition-all`}></div></div>
        <div className={`flex-1 text-center ${step >= 3 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>3. Confirmation</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {step === 1 && (
          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input required type="text" value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input required type="text" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input required type="text" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input required type="text" value={shipping.postalCode} onChange={e => setShipping({...shipping, postalCode: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input required type="text" value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 mt-6">
              Continue to Payment
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Crypto Payment</h2>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-2xl font-bold">{formatCurrency(getTotal())}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Please send the equivalent Bitcoin amount to the address below.</p>
              
              <div className="flex items-center space-x-2 bg-white p-3 border border-gray-300 rounded-md">
                <Bitcoin className="text-orange-500 h-6 w-6 flex-shrink-0" />
                <code className="text-sm flex-grow break-all">{btcAddress}</code>
                <button type="button" onClick={copyToClipboard} className="text-gray-500 hover:text-blue-600 p-1">
                  {copied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Hash (TXID)</label>
              <input 
                required 
                type="text" 
                placeholder="Enter your transaction hash after sending"
                value={txHash} 
                onChange={e => setTxHash(e.target.value)} 
                className="w-full p-2 border border-gray-300 rounded-md" 
              />
              <p className="text-xs text-gray-500 mt-1">We need this to verify your payment.</p>
            </div>

            <div className="flex space-x-4">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-200 text-gray-800 py-3 rounded-md font-bold hover:bg-gray-300">
                Back
              </button>
              <button type="submit" disabled={isSubmitting || !txHash} className="w-2/3 bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 disabled:bg-blue-400">
                {isSubmitting ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Received!</h2>
            <p className="text-gray-600 mb-6">Your order is pending payment verification. We'll email you once it ships.</p>
            <button onClick={() => navigate('/orders')} className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700">
              View My Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
