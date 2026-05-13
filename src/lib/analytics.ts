export type AnalyticsEventName =
  | 'generate_lead'
  | 'purchase'
  | 'begin_checkout'
  | 'sign_up'
  | 'schedule_appointment'
  | 'select_content'
  | 'view_item'
  | 'add_to_cart'
  | 'search'
  | 'cta_click';

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  }
}

export function trackPageView(path: string, title: string) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'page_view', page_path: path, page_title: title });
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', { page_path: path, page_title: title });
  }
}
