import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Truck } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Premium Peptide Powders
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
            High-purity research peptides including HGH 191aa Somatropin. Secure crypto checkout and worldwide shipping.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/shop" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors flex items-center">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">99% Purity Guarantee</h3>
              <p className="text-gray-600">All our peptides undergo strict third-party HPLC and MS testing.</p>
            </div>
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Crypto Payments</h3>
              <p className="text-gray-600">Secure, anonymous, and fast transactions using Bitcoin, Ethereum, and more.</p>
            </div>
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Discreet Shipping</h3>
              <p className="text-gray-600">Worldwide delivery with stealth packaging for your privacy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
