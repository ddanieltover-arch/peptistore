import { WHATSAPP_NUMBER, DEFAULT_SITE_URL } from './seo';

export function getProductWhatsAppUrl(
  product: { title: string; slug?: string | null; id?: string | number },
  variantLabel?: string
): string {
  const number = WHATSAPP_NUMBER.replace('+', '');
  const variantPart = variantLabel ? ` (${variantLabel})` : '';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : DEFAULT_SITE_URL;
  const link = product.slug ? `${siteUrl}/product/${product.slug}` : `${siteUrl}/shop`;
  const text = `Hi, I would like to inquire about / order ${product.title}${variantPart}: ${link}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
