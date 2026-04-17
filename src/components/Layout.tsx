import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useSearchStore } from '../store/useSearchStore';
import { useWizardStore } from '../store/useWizardStore';
import { supabase } from '../supabase';
import SelectorWizard from './wizard/SelectorWizard';
import RecentlyViewedSidebar from './products/RecentlyViewedSidebar';
import LiveTicker from './ticker/LiveTicker';
import ToastContainer from './ToastContainer';
import MobileBottomNav from './MobileBottomNav';
import SalesNotification from './SalesNotification';
import CartDrawer from './cart/CartDrawer';
import Omnisearch from './search/Omnisearch';
import logo from '../assets/logo.webp';

export default function Layout() {
  const { user, profile } = useAuthStore();
  const { items, openCart } = useCartStore();
  const { openSearch } = useSearchStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <LiveTicker />
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="group flex items-center gap-2">
                <img src={logo} alt="Peptistore" className="h-8 md:h-10 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-10">
              <Link to="/shop" className="text-gray-500 hover:text-gray-900 font-bold uppercase tracking-widest text-[11px] transition-colors relative group">
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/categories" className="text-gray-500 hover:text-gray-900 font-bold uppercase tracking-widest text-[11px] transition-colors relative group">
                Categories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link to="/blog" className="text-gray-500 hover:text-gray-900 font-bold uppercase tracking-widest text-[11px] transition-colors relative group">
                Research Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={openSearch}
                className="text-gray-500 hover:text-blue-600 transition-transform hover:scale-110"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {user && (
                <Link to="/wishlist" className="text-gray-500 hover:text-blue-600">
                  <Heart className="h-5 w-5" />
                </Link>
              )}

              <button 
                onClick={openCart}
                className="text-gray-500 hover:text-blue-600 relative transition-transform hover:scale-110"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                    {profile?.photo_url ? (
                      <img src={profile.photo_url} alt="Profile" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                    {profile?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
                    )}
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={handleLogin} className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-4">
              <button 
                onClick={openCart}
                className="text-gray-500 relative"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <Link to="/shop" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Shop</Link>
            <Link to="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Categories</Link>
            <Link to="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Blog</Link>
            <button 
              onClick={() => { openSearch(); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Search
            </button>
            {user && (
              <>
                <Link to="/wishlist" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Wishlist</Link>
                <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">My Orders</Link>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Admin Dashboard</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
              </>
            )}
            {!user && (
              <button onClick={handleLogin} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">Login</button>
            )}
          </div>
        )}
      </header>

      {/* Main Content - ensure padding on mobile to clear bottom nav */}
      <main className="flex-grow pb-20 md:pb-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            <div className="md:col-span-4">
              <span className="text-3xl font-black tracking-tighter uppercase italic mb-6 block">
                PEPTI<span className="text-blue-600">STORE</span>
              </span>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                The global benchmark in research-grade peptide synthesis and distribution. 
                Our laboratory-first approach ensures 99.8%+ purity on every compound shipped.
              </p>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Inventory</h4>
              <ul className="space-y-4 text-sm text-gray-400 font-medium">
                <li><Link to="/shop" className="hover:text-white transition-colors">Full Catalog</Link></li>
                <li><Link to="/categories" className="hover:text-white transition-colors">By Application</Link></li>
                <li><Link to="/search" className="hover:text-white transition-colors">Advanced Search</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Assistance</h4>
              <ul className="space-y-4 text-sm text-gray-400 font-medium">
                <li><Link to="/faq" className="hover:text-white transition-colors">Researcher FAQ</Link></li>
                <li><Link to="/shipping" className="hover:text-white transition-colors">Stealth Logistics</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Liaison Contact</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-4">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Researcher Newsletter</h4>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Receive prioritized updates on supply chains, stability reports, and newly synthesized compounds.
              </p>
              <div className="flex bg-white/5 backdrop-blur-md rounded-2xl p-1 border border-white/10 ring-1 ring-white/5 focus-within:ring-blue-500/50 transition-all">
                <input 
                  type="email" 
                  placeholder="Official Email Address" 
                  className="px-4 py-3 bg-transparent text-white focus:outline-none w-full text-sm font-medium" 
                />
                <button className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 font-bold text-sm tracking-wide transition-all whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-8 border-t border-white/5 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            <span>&copy; {new Date().getFullYear()} PeptiStore Operations. Global Logistics.</span>
            <div className="flex gap-6">
              <Link to="/terms" className="hover:text-blue-500 transition-colors">Protocols</Link>
              <Link to="/privacy" className="hover:text-blue-500 transition-colors">Confidentiality</Link>
            </div>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
      <SalesNotification />
      <CartDrawer />
      <Omnisearch />
      <SelectorWizard />
      <RecentlyViewedSidebar />
      <ToastContainer />
    </div>
  );
}
