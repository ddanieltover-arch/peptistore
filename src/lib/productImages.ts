const EXTERNAL_HOSTS = ['researchpeptide.co.uk', 'wp-content'];

export function isSupabaseProductImage(url?: string | null): boolean {
  if (!url) return false;
  return url.includes('/storage/v1/object/public/products/');
}

export function isExternalProductImage(url?: string | null): boolean {
  if (!url) return false;
  if (isSupabaseProductImage(url)) return false;
  return EXTERNAL_HOSTS.some((host) => url.includes(host));
}

/** Prefer first catalog WebP hero; ignore COA entries in gallery slots. */
export function resolveProductImageUrl(
  product: { images?: string[] | null; id?: string | number },
  index = 0,
): string {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const catalog = images.find((url) => url.includes('/catalog/') && /\.webp/i.test(url));
  if (catalog) return catalog;
  const url = images[index] || images[0] || '';
  return url;
}
