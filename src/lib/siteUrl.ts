import { DEFAULT_SITE_URL } from './seo';

/** Canonical site origin for auth redirects and absolute links. */
export function getSiteOrigin(): string {
  const configured = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
  if (configured) return configured.replace(/\/+$/, '');

  const { origin, hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return origin.replace(/\/+$/, '');
  }

  if (import.meta.env.PROD) return DEFAULT_SITE_URL;

  return origin.replace(/\/+$/, '');
}

export function siteUrl(path = '/', query?: Record<string, string | undefined | null>) {
  const url = new URL(path.startsWith('/') ? path : `/${path}`, `${getSiteOrigin()}/`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value != null && value !== '') url.searchParams.set(key, value);
    }
  }
  return url.toString();
}
