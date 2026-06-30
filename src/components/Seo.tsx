import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_SITE_URL,
  assetUrl,
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  getSeoForPath,
  normalizePath,
} from '../lib/seo';

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  robots?: string;
  image?: string;
  /** Preload LCP candidate (e.g. product hero image). */
  preloadImage?: string;
  type?: 'website' | 'article' | 'product';
  revised?: string;
  jsonLd?: unknown | unknown[];
};

const MANAGED = 'data-managed-seo';

function siteUrl() {
  return (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
}

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(MANAGED, 'true');
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
}

function upsertLink(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute(MANAGED, 'true');
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
}

function applyJsonLd(items: unknown[]) {
  document.head.querySelectorAll('script[data-managed-seo]').forEach((script) => {
    if (script.getAttribute(MANAGED) === 'jsonld') script.remove();
  });
  items.filter(Boolean).forEach((item) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(MANAGED, 'jsonld');
    script.text = JSON.stringify(item);
    document.head.appendChild(script);
  });
}

export default function Seo(props: SeoProps) {
  const location = useLocation();
  const route = getSeoForPath(props.path || location.pathname);
  const path = normalizePath(props.path || route.path || location.pathname);
  const base = siteUrl();
  const title = props.title || route.title;
  const description = props.description || route.description;
  const robots = props.robots || (route.index ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
  const canonical = absoluteUrl(path, base);
  const image = assetUrl(props.image || DEFAULT_OG_IMAGE, base);
  const type = props.type || (route.pageType === 'Article' ? 'article' : route.pageType === 'Product Page' ? 'product' : 'website');
  const revised = props.revised || route.revised;

  React.useEffect(() => {
    document.title = title;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertMeta('meta[name="revised"]', { name: 'revised', content: revised });
    upsertMeta('meta[name="author"]', { name: 'author', content: 'Research Peptides UK' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type === 'article' ? 'article' : 'website' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_GB' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Research Peptides UK' });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    upsertMeta('meta[name="twitter:site"]', { name: 'twitter:site', content: '@researchpeptideuk' });
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical });
    upsertLink('link[rel="alternate"][hreflang="en-GB"]', { rel: 'alternate', hreflang: 'en-GB', href: canonical });

    document.head.querySelectorAll('link[data-managed-seo="preload-image"]').forEach((node) => node.remove());
    if (props.preloadImage) {
      const preloadHref = assetUrl(props.preloadImage, base);
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = preloadHref;
      link.setAttribute(MANAGED, 'preload-image');
      document.head.appendChild(link);
    }

    const breadcrumb = buildBreadcrumbJsonLd(path, title, base);
    const pageJson = Array.isArray(props.jsonLd) ? props.jsonLd : props.jsonLd ? [props.jsonLd] : [];
    applyJsonLd([buildOrganizationJsonLd(base), buildWebsiteJsonLd(base), breadcrumb, ...pageJson]);
  }, [base, canonical, description, image, path, props.jsonLd, props.preloadImage, revised, robots, title, type]);

  return null;
}
