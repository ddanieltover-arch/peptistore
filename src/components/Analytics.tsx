import React from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics';

function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function ensureMeta(name: string, content: string) {
  if (!content || document.querySelector(`meta[name="${name}"][content="${content}"]`)) return;
  const existing = document.querySelector(`meta[name="${name}"]`);
  if (existing) {
    existing.setAttribute('content', content);
    return;
  }
  const meta = document.createElement('meta');
  meta.name = name;
  meta.content = content;
  document.head.appendChild(meta);
}

export default function Analytics() {
  const location = useLocation();
  const gtmId = import.meta.env.VITE_GTM_ID;
  const gaId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  const gscVerification = import.meta.env.VITE_GSC_VERIFICATION;

  React.useEffect(() => {
    if (gscVerification) {
      ensureMeta('google-site-verification', gscVerification);
    }
  }, [gscVerification]);

  React.useEffect(() => {
    if (gtmId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      loadScript('gtm-script', 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(gtmId));
    }
    if (gaId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function gtag() { window.dataLayer?.push(arguments); };
      loadScript('ga4-script', 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId));
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        send_page_view: false,
        cookie_flags: 'SameSite=None;Secure',
      });
    }
  }, [gaId, gtmId]);

  React.useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location.pathname, location.search]);

  return null;
}
