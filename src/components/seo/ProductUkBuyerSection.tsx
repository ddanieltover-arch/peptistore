import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import type { UkBuyerFaq } from '../../lib/ukBuyerQuestions';
import { hubBuyerQuestionLinks } from '../../lib/ukBuyerQuestions';

type ProductUkBuyerSectionProps = {
  intro?: string;
  faqs: UkBuyerFaq[];
  className?: string;
};

export function ProductUkBuyerSection({ intro, faqs, className = '' }: ProductUkBuyerSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs.length) return null;

  return (
    <section
      id="uk-buyer-questions"
      aria-labelledby="uk-buyer-questions-heading"
      className={`mt-12 bg-white rounded-[2rem] border border-gray-100 p-8 md:p-10 shadow-sm ${className}`}
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 w-8 bg-blue-600 rounded-full" />
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">UK laboratory buyers</span>
        </div>
        <h2 id="uk-buyer-questions-heading" className="text-2xl md:text-3xl font-black text-gray-900 m-0">
          How to buy in the United Kingdom
        </h2>
        {intro ? (
          <p className="mt-4 text-sm md:text-[15px] text-gray-600 leading-relaxed font-medium m-0">{intro}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.q}
              className={`border rounded-2xl transition-all duration-300 ${
                isOpen ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-start justify-between gap-4 p-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm md:text-base font-bold text-gray-900 leading-snug">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              {isOpen ? (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed font-medium">{item.a}</div>
              ) : null}
            </div>
          );
        })}
      </div>

      <nav aria-label="Related UK buying guides" className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-600">
        {hubBuyerQuestionLinks.map((link, index) => (
          <span key={link.to}>
            {index > 0 ? <span className="text-gray-400"> · </span> : null}
            <Link to={link.to} className="text-blue-600 font-semibold hover:underline">
              {link.label}
            </Link>
          </span>
        ))}
      </nav>
    </section>
  );
}

type HubBuyerQuestionsBlockProps = {
  faqs: UkBuyerFaq[];
  heading?: string;
  className?: string;
};

export function HubBuyerQuestionsBlock({
  faqs,
  heading = 'Common UK buyer questions',
  className = '',
}: HubBuyerQuestionsBlockProps) {
  return (
    <section
      aria-labelledby="hub-buyer-questions-heading"
      className={`rounded-[2rem] border border-gray-100 bg-gray-50/80 p-8 md:p-10 ${className}`}
    >
      <h2 id="hub-buyer-questions-heading" className="text-xl md:text-2xl font-black text-gray-900 mb-6 m-0">
        {heading}
      </h2>
      <dl className="space-y-6 m-0">
        {faqs.map((item) => (
          <div key={item.q}>
            <dt className="text-sm font-bold text-gray-900 mb-2">{item.q}</dt>
            <dd className="text-sm text-gray-600 leading-relaxed font-medium m-0">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
