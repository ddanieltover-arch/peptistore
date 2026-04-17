import React from 'react';
import { Mail, Phone, MessageSquare, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="bg-white min-h-screen pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Contact Info */}
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                <MessageSquare className="h-4 w-4" />
                Liaison Office
              </div>
              <h1 className="mb-6">Connect with our <br />Technical Team.</h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
                For product stability data, batch-specific COAs, or institutional procurement inquiries, our liaison officers are standing by.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                <Mail className="h-6 w-6 text-blue-600 mb-4" />
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email Protocols</h4>
                <p className="font-bold text-gray-900 break-all">info@researchpeptide.uk</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                <Phone className="h-6 w-6 text-blue-600 mb-4" />
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Liaison Line</h4>
                <p className="font-bold text-gray-900">+44 800 000 0000</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 sm:col-span-2">
                <Clock className="h-6 w-6 text-blue-600 mb-4" />
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Support Hours (London Time)</h4>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Monday — Friday</span>
                  <span className="text-blue-600 font-black">09:00 - 18:00</span>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-blue-600 rounded-[2.5rem] text-white relative overflow-hidden">
               <ShieldCheck className="absolute -right-8 -bottom-8 h-48 w-48 text-white/10" />
               <h4 className="text-lg font-bold mb-2">Privacy Guaranteed</h4>
               <p className="text-blue-100 text-sm leading-relaxed">
                 All inquiries are handled with strict researcher confidentiality. We do not share institution data with third parties.
               </p>
            </div>
          </div>

          {/* Right: Inquiry Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-[3rem] p-8 md:p-12"
          >
            <h3 className="text-2xl font-black mb-8 tracking-tight">Send a Dispatch</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Researcher Name"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="official@institution.uk"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Subject</label>
                <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm font-medium appearance-none">
                  <option>General Research Inquiry</option>
                  <option>Bulk/Institutional Procurement</option>
                  <option>Product Stability Data (COA)</option>
                  <option>Shipping & Logistics Liaison</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Your Message</label>
                <textarea 
                  rows={5}
                  placeholder="How can our technical team assist your research?"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm font-medium"
                ></textarea>
              </div>

              <button className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                Transmit Dispatch
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
