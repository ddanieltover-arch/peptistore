/** Read product title/image left in static prerender HTML before React hydrates. */
export function getPrerenderProductHint(): { title?: string; image?: string } {
  if (typeof document === 'undefined') return {};

  const h1 = document.querySelector('#seo-prerender h1')?.textContent?.trim();
  const preload = document.querySelector('link[rel="preload"][as="image"]')?.getAttribute('href');
  const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const prerenderImg = document.querySelector('#seo-prerender img')?.getAttribute('src');

  return {
    title: h1 || undefined,
    image: preload || prerenderImg || ogImage || undefined,
  };
}
