import { Page } from 'playwright';

export interface ScrapedProduct {
  name: string;
  description: string;
  price_gbp: number;
  original_price?: number;
  original_currency?: string;
  category?: string;
  variants?: { name: string; price_gbp: number; original_price?: number; sku?: string }[];
  images: string[];
  url: string;
}

export async function extractStructuredData(page: Page): Promise<ScrapedProduct[]> {
  const products: ScrapedProduct[] = [];
  
  try {
    // 1. Look for JSON-LD Product schemas
    const jsonLdElements = await page.locator('script[type="application/ld+json"]').allTextContents();
    
    for (const jsonText of jsonLdElements) {
      try {
        const data = JSON.parse(jsonText);
        // Handle both single objects and arrays of schemas
        const schemas = Array.isArray(data) ? data : [data];
        
        for (const schema of schemas) {
          if (schema['@type'] === 'Product') {
            const product = parseJsonLdProduct(schema, page.url());
            if (product) products.push(product);
          } else if (schema['@graph']) {
             // Handle Yoast SEO style graphs
             for (const item of schema['@graph']) {
               if (item['@type'] === 'Product') {
                 const product = parseJsonLdProduct(item, page.url());
                 if (product) products.push(product);
               }
             }
          }
        }
      } catch (e) {
        // Parse error for this specific JSON-LD block
        console.warn('Failed to parse JSON-LD block on', page.url());
      }
    }
  } catch (error) {
    console.error('Error during structured data extraction', error);
  }

  return products;
}

function parseJsonLdProduct(schema: any, url: string): ScrapedProduct | null {
  if (!schema.name) return null;

  let price_gbp = 0;
  let original_currency = 'GBP';

  // Find price from offers
  if (schema.offers) {
    const offer = Array.isArray(schema.offers) ? schema.offers[0] : schema.offers;
    if (offer.price) {
      price_gbp = parseFloat(offer.price);
    }
    if (offer.priceCurrency) {
      original_currency = offer.priceCurrency;
    }
  }

  // Find images
  const images: string[] = [];
  if (schema.image) {
    if (Array.isArray(schema.image)) {
      images.push(...schema.image.map((img: any) => typeof img === 'string' ? img : img.url));
    } else if (typeof schema.image === 'string') {
      images.push(schema.image);
    } else if (schema.image.url) {
      images.push(schema.image.url);
    }
  }

  // Return base product
  return {
    name: schema.name,
    description: schema.description || '',
    price_gbp,
    original_currency,
    original_price: price_gbp,
    images: images.filter(Boolean),
    url
  };
}
