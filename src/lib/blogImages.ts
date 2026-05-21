/** Branded blog hero images from New folder → public/blog */
export const BRAND_BLOG_IMAGES = [
  '/blog/storefront-street.png',
  '/blog/igf-1-peptide.png',
  '/blog/reception-lobby.png',
  '/blog/storefront-night.png',
  '/blog/kpv-peptide.png',
  '/blog/custom-peptide-synthesis.png',
  '/blog/storefront-wet-street.png',
  '/blog/reception-wide.png',
] as const;

const BRAND_IMAGE_BY_POST_ID: Record<string, (typeof BRAND_BLOG_IMAGES)[number]> = {
  '1cc4a3f1-eafd-486f-8f52-192c58141a7e': '/blog/igf-1-peptide.png',
  'f21bd3b3-48eb-4105-ab08-04b0c6e44e6b': '/blog/custom-peptide-synthesis.png',
  'c603f9c4-cf03-4c33-aac3-9102dcfce2f3': '/blog/kpv-peptide.png',
  '10546e55-2007-400b-abf7-7de3e70d83b5': '/blog/kpv-peptide.png',
  '386f14c2-d1f4-4a99-8cf5-fc1ef530538d': '/blog/reception-wide.png',
};

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash;
}

export function isBrandedBlogImage(url?: string | null): boolean {
  if (!url) return false;
  return url.includes('/blog/') && !url.includes('unsplash.com');
}

export function resolveBlogImagePath(post: { id?: string; image_url?: string | null }): string {
  if (isBrandedBlogImage(post.image_url)) {
    const path = post.image_url!.replace(/^https?:\/\/[^/]+/i, '');
    return path.startsWith('/') ? path : '/' + path;
  }
  if (post.id && BRAND_IMAGE_BY_POST_ID[post.id]) return BRAND_IMAGE_BY_POST_ID[post.id];
  if (post.id) return BRAND_BLOG_IMAGES[hashId(post.id) % BRAND_BLOG_IMAGES.length];
  return BRAND_BLOG_IMAGES[0];
}

export function resolveBlogImageUrl(post: { id?: string; image_url?: string | null }): string {
  const path = resolveBlogImagePath(post);
  if (post.image_url && isBrandedBlogImage(post.image_url)) return post.image_url;
  return path;
}
