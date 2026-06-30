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

/** Prefer first hosted catalog image; pass through placeholders. */
export function resolveProductImageUrl(
  product: { images?: string[] | null; id?: string | number },
  index = 0,
): string {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const url = images[index] || images[0] || '';
  return url;
}
