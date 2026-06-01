import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Seo from './components/Seo';
import Analytics from './components/Analytics';
import { useAuthStore } from './store/useAuthStore';
import { useWishlistStore } from './store/useWishlistStore';
import { supabase } from './supabase';

const Home = React.lazy(() => import('./pages/Home'));
const Shop = React.lazy(() => import('./pages/Shop'));
const Cart = React.lazy(() => import('./pages/Cart'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));
const Search = React.lazy(() => import('./pages/Search'));
const Categories = React.lazy(() => import('./pages/Categories'));
const Login = React.lazy(() => import('./pages/Login'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const Shipping = React.lazy(() => import('./pages/Shipping'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const RefundReturns = React.lazy(() => import('./pages/RefundReturns'));
const PeptideGuide = React.lazy(() => import('./pages/PeptideGuide'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const PeptideCalculator = React.lazy(() => import('./pages/PeptideCalculator'));
const COALibrary = React.lazy(() => import('./pages/COALibrary'));
const PeptideInformation = React.lazy(() => import('./pages/PeptideInformation'));
const PeptideResearch = React.lazy(() => import('./pages/PeptideResearch'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

export default function App() {
  const { setUser, fetchProfile, setAuthReady } = useAuthStore();
  const { fetchWishlist } = useWishlistStore();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(
          session.user.id, 
          session.user.email || '', 
          session.user.user_metadata?.full_name || null, 
          session.user.user_metadata?.avatar_url || null
        );
        fetchWishlist(session.user.id);
      }
      setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(
          session.user.id, 
          session.user.email || '', 
          session.user.user_metadata?.full_name || null, 
          session.user.user_metadata?.avatar_url || null
        );
        fetchWishlist(session.user.id);
      } else {
         useAuthStore.getState().setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, fetchProfile, setAuthReady, fetchWishlist]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  return (
    <>
      <Seo />
      <Analytics />
      <React.Suspense fallback={<div className="min-h-screen bg-white" aria-label="Loading page" />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:slug" element={<ProductDetails />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPost />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="search" element={<Search />} />
            <Route path="categories" element={<Categories />} />
            <Route path="login" element={<Login />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="peptide-guide" element={<PeptideGuide />} />
            <Route path="peptide-calculator" element={<PeptideCalculator />} />
            <Route path="coas" element={<COALibrary />} />
            <Route path="peptide-information" element={<PeptideInformation />} />
            <Route path="peptide-research" element={<PeptideResearch />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="refund-returns" element={<RefundReturns />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </React.Suspense>
    </>
  );
}
