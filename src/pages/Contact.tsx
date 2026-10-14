import React from 'react';
import { Mail, MessageSquare, Clock, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useToastStore } from '../store/useToastStore';
import { postContactEmail } from '../lib/transactionalEmailApi';
import { trackEvent } from '../lib/analytics';
import brandReceptionLobby from '../assets/brand/brand-reception-lobby.webp';
import { GeoAnswerCapsule } from '../components/seo/GeoAnswerCapsule';
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '../lib/seo';

export default function Contact() {
  const addToast = useToastStore((state) => state.addToast);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('General Research Inquiry');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitState, setSubmitState] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [submitErrorDetail, setSubmitErrorDetail] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState('idle');
    setSubmitErrorDetail('');
    try {
      await postContactEmail({ fullName, email, subject, message });
      trackEvent('generate_lead', { lead_type: 'contact_form', subject });
      setSubmitState('success');
      addToast('Dispatch sent successfully. We will reply shortly.', 'success');
      setFullName('');
      setEmail('');
      setSubject('General Research Inquiry');
      setMessage('');
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : 'Dispatch failed. Please try again in a moment.';
      setSubmitState('error');
      setSubmitErrorDetail(detail);
      addToast('Dispatch failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white min-h-screen pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-blue-900/10"
        >
          <img
            src={brandReceptionLobby}
            alt="Research Peptides UK contact — Oxford and UK research peptide support"
            width={1280}
            height={320}
            loading="lazy"
            decoding="async"
            className="w-full h-52 sm:h-64 md:h-80 object-cover"
          />
        </motion.div>

        <div className="max-w-3xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <MessageSquare className="h-4 w-4" />
            Liaison Office
          </div>
          <h1>Contact Research Peptides UK</h1>
          <p className="text-gray-500 mt-4 font-medium italic max-w-2xl mx-auto">
            Technical support for UK laboratories — COA requests, bulk procurement, shipping liaison, and research-only compliance questions.
          </p>
        </div>

        <GeoAnswerCapsule className="mb-12 max-w-3xl mx-auto text-left" />

        <section id="oxford-peptides" className="max-w-3xl mx-auto mb-14 text-sm text-gray-600 leading-relaxed space-y-4">
          <h2 className="text-2xl font-black text-gray-900">Oxford peptides and UK research support</h2>
          <p>
            Searches for <strong>Oxford peptides</strong> often come from university and CRO teams in Oxfordshire who need
            documented research-grade compounds, tracked UK dispatch, and responsive batch support — not retail supplements.
            Research Peptides UK serves qualified laboratories nationwide, including Oxford, Cambridge, and London research clusters.
          </p>
          <p>
            Use this contact page for COA requests, institutional purchase orders, stability questions, and delivery instructions
            for receiving departments. For a full sourcing guide, read{' '}
            <Link
              to="/blog/oxford-peptides-and-uk-research-sourcing"
              className="text-blue-600 font-semibold hover:underline"
            >
              Oxford peptides and UK research sourcing
            </Link>
            , browse the{' '}
            <Link to="/shop" className="text-blue-600 font-semibold hover:underline">
              research peptide catalog
            </Link>
            , or review{' '}
            <Link to="/shipping" className="text-blue-600 font-semibold hover:underline">
              UK shipping protocols
            </Link>
            .
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Connect with our technical team</h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
                For product stability data, batch-specific COAs, or institutional procurement inquiries, our liaison officers are standing by.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 sm:col-span-2">
                <Mail className="h-6 w-6 text-blue-600 mb-4" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email Protocols</h3>
                <p className="font-bold text-gray-900 break-words">info@researchpeptide.uk</p>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 sm:col-span-2 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors"
              >
                <MessageSquare className="h-6 w-6 text-[#25D366] mb-4" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">WhatsApp</h3>
                <p className="font-bold text-gray-900">{WHATSAPP_DISPLAY}</p>
              </a>
              <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 sm:col-span-2">
                <MapPin className="h-6 w-6 text-blue-600 mb-4" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Office Address</h3>
                <p className="font-bold text-gray-900 leading-relaxed">
                  Address provided via support channel
                  <br />
                  For verified logistics and returns only
                  <br />
                  United Kingdom
                </p>
              </div>
              <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 sm:col-span-2">
                <Clock className="h-6 w-6 text-blue-600 mb-4" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Support Hours (London Time)</h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Monday — Friday</span>
                  <span className="text-blue-600 font-black">09:00 - 18:00</span>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-blue-600 rounded-[2.5rem] text-white relative overflow-hidden">
              <ShieldCheck className="absolute -right-8 -bottom-8 h-48 w-48 text-white/10" />
              <h3 className="text-lg font-bold mb-2">Privacy Guaranteed</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                All inquiries are handled with strict researcher confidentiality. We do not share institution data with third parties.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-[3rem] p-8 md:p-12"
          >
            <h2 className="text-2xl font-black mb-8 tracking-tight">Send a dispatch</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-full-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Full Name</label>
                  <input
                    id="contact-full-name"
                    type="text"
                    placeholder="Researcher Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="official@institution.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-subject" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Subject</label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm font-medium appearance-none"
                >
                  <option>General Research Inquiry</option>
                  <option>Oxford / UK Institutional Procurement</option>
                  <option>Bulk/Institutional Procurement</option>
                  <option>Product Stability Data (COA)</option>
                  <option>Shipping & Logistics Liaison</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Your Message</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="How can our technical team assist your research?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm font-medium"
                />
              </div>

              {submitState === 'success' && (
                <p className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  Dispatch sent successfully. We will reply shortly.
                </p>
              )}
              {submitState === 'error' && (
                <div className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-1">
                  <p>Dispatch failed.</p>
                  {submitErrorDetail && (
                    <p className="font-medium text-red-600/95 whitespace-pre-wrap break-words leading-relaxed">{submitErrorDetail}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-60"
              >
                Transmit Dispatch
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
