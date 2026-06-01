import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { BookOpen, ArrowLeft, Clock, Share2, Tag, Calendar, ShieldCheck, Activity, ArrowRight, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import Seo from '../components/Seo';
import { buildArticleJsonLd, excerpt } from '../lib/seo';
import { resolveBlogImageUrl } from '../lib/blogImages';
import { productPath } from '../lib/productUrl';
import heroBg from '../assets/hero_bg.png';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const byId = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle();
        if (byId.data) {
          setPost(byId.data);
          return;
        }

        const bySlug = await supabase.from('blog_posts').select('*').eq('slug', id).maybeSingle();
        if (bySlug.data) setPost(bySlug.data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchRelatedProducts = async () => {
      try {
        // Fetch 3 popular products for the sidebar
        const { data } = await supabase.from('products').select('*').limit(3);
        if (data) setRelatedProducts(data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchPost();
    fetchRelatedProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 space-y-8 animate-pulse">
        <div className="h-4 w-32 bg-gray-100 rounded-full" />
        <div className="h-20 bg-gray-100 rounded-2xl w-full" />
        <div className="h-96 bg-gray-100 rounded-[3rem] w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
             <div className="h-4 bg-gray-100 rounded w-full" />
             <div className="h-4 bg-gray-100 rounded w-full" />
             <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
          <div className="space-y-4">
             <div className="h-24 bg-gray-100 rounded-2xl w-full" />
             <div className="h-24 bg-gray-100 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
          <BookOpen className="h-16 w-16 text-gray-200 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-900 mb-4">Research Entry Forbidden</h2>
          <p className="text-gray-400 font-medium mb-8">The requested publication could not be identified.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
            <ArrowLeft className="h-3 w-3" /> Return to Archives
          </Link>
        </div>
      </div>
    );
  }

  const seoDescription = excerpt(post.content || post.title, 155);
  const heroImage = resolveBlogImageUrl(post);

  return (
    <>
      <Seo
        title={(post.title || 'Peptide research article') + ' | Research Peptides UK'}
        description={seoDescription}
        path={'/blog/' + (post.slug || post.id)}
        image={heroImage}
        type='article'
        jsonLd={buildArticleJsonLd({ ...post, image_url: heroImage })}
      />
      
      <div className="bg-slate-50 min-h-screen pb-32">
        {/* Banner with a clean subtle gradient and pattern */}
        <div className="bg-[#0A0F1E] text-white relative py-24 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 opacity-20">
            <img src={heroBg} className="w-full h-full object-cover" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Scientific Journals
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-6 mb-6 text-[10px] font-black uppercase tracking-widest text-blue-400">
                 <span className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full"><Tag className="h-3 w-3" /> Research Insight</span>
                 <span className="flex items-center gap-2 text-gray-400"><Calendar className="h-3 w-3" /> {new Date(post.created_at).toLocaleDateString()}</span>
                 <span className="flex items-center gap-2 text-gray-400"><Clock className="h-3 w-3" /> 5 Min Read</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl text-white">
                {post.title}
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Featured Image - overlapping banner slightly */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white"
          >
            <img src={heroImage} alt={post.title} className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* Main Grid: Content (2/3) + Sidebar (1/3) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left: Article Content */}
            <motion.main 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-gray-100"
            >
              {/* Quick Summary Section */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 mb-10">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-800 mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Executive Research Summary
                </h4>
                <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                  This scientific brief details chemical characteristics, reconstitution parameters, and stability metrics of the subject peptide sequence. Strictly intended for in-vitro laboratory analysis.
                </p>
              </div>

              {/* Rendered Markdown Body */}
              <div className="selection:bg-blue-100">
                <ReactMarkdown
                  components={{
                    h2: ({ children }: any) => (
                      <h2 className="text-xl md:text-2xl font-black text-gray-900 mt-12 mb-6 border-b border-gray-100 pb-3 tracking-tight flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block" />
                        {children}
                      </h2>
                    ),
                    h3: ({ children }: any) => (
                      <h3 className="text-lg font-black text-gray-900 mt-8 mb-4 tracking-tight">
                        {children}
                      </h3>
                    ),
                    p: ({ children }: any) => (
                      <p className="text-gray-600 leading-[1.8] mb-6 text-sm md:text-[15px] font-medium">
                        {children}
                      </p>
                    ),
                    ol: ({ children }: any) => (
                      <ol className="list-decimal pl-6 space-y-4 mb-8 text-gray-600 text-sm md:text-[15px] font-medium">
                        {children}
                      </ol>
                    ),
                    ul: ({ children }: any) => (
                      <ul className="list-disc pl-6 space-y-4 mb-8 text-gray-600 text-sm md:text-[15px] font-medium">
                        {children}
                      </ul>
                    ),
                    li: ({ children }: any) => (
                      <li className="leading-relaxed pl-1">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }: any) => (
                      <blockquote className="border-l-4 border-blue-600 bg-blue-50/50 px-6 py-4 rounded-r-2xl my-8 text-gray-700 italic font-medium text-sm md:text-base leading-relaxed">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }: any) => (
                      <code className="bg-gray-100 text-blue-600 px-2 py-0.5 rounded text-xs font-mono font-bold">
                        {children}
                      </code>
                    ),
                    strong: ({ children }: any) => (
                      <strong className="font-black text-gray-900">
                        {children}
                      </strong>
                    ),
                    a: ({ href, children, ...props }: any) => {
                      const isInternal = href && (href.startsWith('/') || href.startsWith('#'));
                      if (isInternal) {
                        return (
                          <Link to={href} {...props} className="text-blue-600 hover:text-blue-800 underline font-black">
                            {children}
                          </Link>
                        );
                      }
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" {...props} className="text-blue-600 hover:text-blue-800 underline font-black">
                          {children}
                        </a>
                      );
                    }
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Disclaimer */}
              <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">End of Scientific Journal Entry</p>
                 <Link 
                   to="/blog" 
                   className="inline-flex items-center justify-center px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95"
                 >
                    Return to All Research
                 </Link>
              </div>
            </motion.main>

            {/* Right: Sidebar */}
            <aside className="space-y-8">
              {/* Lab Panel */}
              <div className="bg-[#0A0F1E] text-white p-8 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl" />
                <h3 className="text-white font-black uppercase text-xs tracking-widest mb-4">Scientific Advisory</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-6 font-medium">
                  Compiled by the Research Peptides UK Editorial Board. HPLC testing certificates are available for verification for all active catalog entries.
                </p>
                <Link to="/coas" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors">
                  Verify COA Library <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Recommended Catalog Entries */}
              {relatedProducts.length > 0 && (
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Subject Compounds</h3>
                  <div className="space-y-6">
                    {relatedProducts.map((product) => (
                      <Link 
                        key={product.id} 
                        to={productPath(product)}
                        className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100"
                      >
                        <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                              <ShoppingCart className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {product.title}
                          </h4>
                          <p className="text-[10px] font-black text-blue-600 mt-1 uppercase">
                            £{Number(product.price).toFixed(2)}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Reconstitution Tool Widget */}
              <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-100/50 p-8 rounded-[2.5rem] text-center">
                <Activity className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-2">Reconstitution Calculator</h4>
                <p className="text-gray-500 text-xs leading-relaxed mb-6 font-medium">
                  Calculate target microgram delivery per unit on laboratory syringe calibrations.
                </p>
                <Link 
                  to="/peptide-calculator" 
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                >
                  Launch Calculator
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
