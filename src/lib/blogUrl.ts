import { slugify } from './seo';

export function blogPath(post: { id?: string; slug?: string | null; title?: string | null }) {
  return `/blog/${post.slug || post.id || slugify(String(post.title || 'article'))}`;
}
