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

export type EcommerceItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
};

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined | EcommerceItem[]>;

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

function pushEcommerceEvent(
  name: 'begin_checkout' | 'purchase' | 'add_to_cart' | 'view_item',
  payload: AnalyticsPayload & { items?: EcommerceItem[] },
) {
  trackEvent(name, { currency: 'GBP', ...payload });
}

export function trackAddToCart(item: EcommerceItem) {
  pushEcommerceEvent('add_to_cart', {
    value: item.price * item.quantity,
    items: [item],
  });
}

export function trackViewItem(item: EcommerceItem) {
  pushEcommerceEvent('view_item', {
    value: item.price,
    items: [item],
  });
}

export function trackBeginCheckout(items: EcommerceItem[], value: number) {
  pushEcommerceEvent('begin_checkout', { value, items });
}

export function trackPurchase(params: {
  transaction_id: string;
  value: number;
  items: EcommerceItem[];
  payment_method?: string;
}) {
  pushEcommerceEvent('purchase', {
    transaction_id: params.transaction_id,
    value: params.value,
    payment_method: params.payment_method,
    items: params.items,
  });
}

export function trackSearch(searchTerm: string, resultCount?: number) {
  const term = searchTerm.trim();
  if (!term) return;
  trackEvent('search', { search_term: term, result_count: resultCount });
}
