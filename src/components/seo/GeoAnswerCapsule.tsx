import React from 'react';
import { useLocation } from 'react-router-dom';
import { getSeoForPath } from '../../lib/seo';

type GeoAnswerCapsuleProps = {
  answer?: string;
  className?: string;
};

export function GeoAnswerCapsule({ answer, className = '' }: GeoAnswerCapsuleProps) {
  const location = useLocation();
  const route = getSeoForPath(location.pathname);
  
  const text = answer || route.answer;

  if (!text) return null;

  return (
    <section 
      id="answer" 
      aria-label="Quick Answer" 
      className={`mb-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-sm leading-relaxed text-blue-950 shadow-sm ${className}`}
    >
      <p className="m-0">
        <strong>Quick Answer:</strong> {text}
      </p>
    </section>
  );
}
