import React, { useState } from 'react';
import { HelpCircle, ChevronDown, FlaskConical, Truck, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Seo from '../components/Seo';
import { buildFaqPageJsonLd } from '../lib/seo';
import { GeoAnswerCapsule } from '../components/seo/GeoAnswerCapsule';

export const faqs = [
  { category: 'Product & Safety', icon: FlaskConical, questions: [
    { q: 'Are these products safe for human or animal consumption?', a: 'No. All products sold by Research Peptides UK are strictly for laboratory research and scientific application only. They are not for human or veterinary use.' },
    { q: 'How do you verify the purity of your peptides?', a: 'Every batch is reviewed against HPLC and Mass Spec analysis. Purity levels are verified before release for research distribution.' },
    { q: 'How should I store the compounds upon arrival?', a: 'Most lyophilized peptides are stable at room temperature for short shipping durations, but long-term research storage commonly uses -20C or -80C conditions.' },
  ] },
  { category: 'Logistics & Shipping', icon: Truck, questions: [
    { q: 'How long does shipping take within the UK?', a: 'Most UK research orders are dispatched through expedited tracked shipping and typically arrive within 1-3 business days.' },
    { q: 'Is the packaging discreet?', a: 'Yes. Orders are shipped in plain, unmarked packaging to protect the privacy and security of research institutions.' },
    { q: 'Do you ship internationally?', a: 'Yes, global shipping is available. Delivery timing depends on regional customs protocols, usually ranging from 3-14 days.' },
  ] },
  { category: 'Payments & Policy', icon: CreditCard, questions: [
    { q: 'Which cryptocurrencies do you accept?', a: 'Research Peptides UK accepts major cryptocurrencies and stablecoins through the secure payment gateway where available.' },
    { q: 'What is your return policy?', a: 'Due to research integrity, chain-of-custody and storage controls, returns are not accepted once compounds leave the controlled logistics process.' },
  ] },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');
  const faqJsonLd = React.useMemo(() => buildFaqPageJsonLd(faqs.flatMap((group) => group.questions)), []);

  const toggle = (idx: string) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <>
      <Seo path='/faq' jsonLd={faqJsonLd} />
      <main className='bg-white min-h-screen pt-12 pb-24'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6'>
              <HelpCircle className='h-4 w-4' />
              Support Intelligence
            </div>
            <h1>Researcher FAQ</h1>
            <p className='text-gray-500 mt-4 font-medium italic'>Standard protocols and common inquiries for Research Peptides UK researchers.</p>
          </motion.div>

          <GeoAnswerCapsule className='mb-10' />

          <div className='space-y-12'>
            {faqs.map((group, groupIdx) => (
              <section key={group.category}>
                <div className='flex items-center gap-3 mb-6 border-b border-gray-100 pb-4'>
                  <group.icon className='h-5 w-5 text-blue-600' />
                  <h2 className='m-0 text-sm font-black uppercase tracking-[0.2em] text-gray-900'>{group.category}</h2>
                </div>
                <div className='space-y-3'>
                  {group.questions.map((item, qIdx) => {
                    const id = groupIdx + '-' + qIdx;
                    const isOpen = openIndex === id;
                    const panelClass = 'border rounded-2xl transition-all duration-300 ' + (isOpen ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200');
                    const iconClass = 'h-5 w-5 text-gray-400 transition-transform duration-300 ' + (isOpen ? 'rotate-180' : '');
                    return (
                      <div key={id} className={panelClass}>
                        <button type='button' onClick={() => toggle(id)} className='w-full px-6 py-5 flex items-center justify-between text-left' aria-expanded={isOpen}>
                          <span className='font-bold text-gray-900 text-lg leading-tight'>{item.q}</span>
                          <ChevronDown className={iconClass} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className='overflow-hidden'>
                              <div className='px-6 pb-6 text-gray-600 leading-relaxed text-sm'>{item.a}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className='mt-20 p-8 bg-slate-950 rounded-[2.5rem] text-center relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl' />
            <h2 className='text-white mb-2 italic'>Still have technical questions?</h2>
            <p className='text-gray-400 text-sm mb-6'>Our liaison team is available for deep-dive research support.</p>
            <a href='/contact' className='inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all uppercase tracking-widest text-xs'>Liaison Office</a>
          </div>
        </div>
      </main>
    </>
  );
}
