import { ScrapedProduct } from './extractors/structured.js';

export function normalizeProduct(product: ScrapedProduct): ScrapedProduct {
  // 1. Trim names and descriptions
  let name = product.name.trim();
  let description = product.description.trim();

  // Remove common noise from name
  name = name.replace(/\s*-\s*researchpeptide\.(uk|co\.uk)/i, '');
  
  // Clean up HTML tags if accidentally captured
  description = description.replace(/<[^>]*>?/gm, '');

  // 2. Validate price
  let price_gbp = product.price_gbp;
  if (isNaN(price_gbp) || price_gbp < 0) {
    price_gbp = 0;
  }

  // 3. Ensure images are unique
  const uniqueImages = [...new Set(product.images)];

  // 4. Return normalized
  return {
    ...product,
    name,
    description,
    price_gbp,
    images: uniqueImages
  };
}
