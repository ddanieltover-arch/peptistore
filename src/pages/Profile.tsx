import { User, Mail, Shield, Calendar, MapPin, CreditCard, Settings, ChevronRight, Package, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Profile() {
  const { user, profile } = useAuthStore();

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
           <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
           <p className="text-xl font-bold text-gray-900">Please log in to view your profile.</p>
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
                   {profile.photoURL ? (
                     <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <User className="h-12 w-12 text-blue-100" />
                   )}
                 </div>
               </div>
               <h2 className="text-2xl font-black text-gray-900 leading-tight">{profile.displayName || 'Researcher'}</h2>
               <p className="text-blue-500 text-xs font-black uppercase tracking-widest mt-1">{profile.role}</p>
            </div>

            <nav className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-2">
               {[
                 { label: 'Overview', icon: User, path: '/profile', active: true },
                 { label: 'Orders', icon: Package, path: '/orders' },
                 { label: 'Wishlist', icon: Heart, path: '/wishlist' },
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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
               {/* Account Details */}
               <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-blue-500" /> Account Security
                  </h3>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                           <p className="text-gray-900 font-bold">{profile.email}</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Member Since</p>
                           <p className="text-gray-900 font-bold">
                             {profile.createdAt?.toDate ? profile.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'April 2026'}
                           </p>
                        </div>
                     </div>
                  </div>
               </section>

               {/* Shipping Info */}
               <section className="bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 -mr-16 -mt-16 rounded-full" />
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
                    <MapPin className="h-6 w-6 text-blue-500" /> Shipping Depot
                  </h3>
                  <div className="space-y-6 relative z-10">
                     <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Primary Address</p>
                        <p className="text-sm font-medium text-gray-300">Default research lab address not set.</p>
                        <button className="text-xs font-black text-white underline mt-3 hover:text-blue-400 transition-colors uppercase tracking-widest">Set Address</button>
                     </div>
                  </div>
               </section>
            </motion.div>

            {/* Quick Actions / Activity */}
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-blue-500" /> Financial Overview
                  </h3>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Verified Account</span>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Total Spent</p>
                     <p className="text-3xl font-black text-blue-900">€0.00</p>
                  </div>
                  <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
                     <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Reward Points</p>
                     <p className="text-3xl font-black text-green-900">150</p>
                  </div>
               </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
