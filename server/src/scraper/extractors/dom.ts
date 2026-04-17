import { Page } from 'playwright';
import { ScrapedProduct } from './structured.js';

export async function extractFromDom(page: Page): Promise<ScrapedProduct | null> {
  // Wait for network requests to finish, helping with lazy load
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  } catch (e) {
    // Ignore timeout, just proceed with what we have
  }

  // Scroll down to trigger lazy loaded images
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);

  // General DOM extractors for typical WooCommerce/Shopify/Custom sites
  const productInfo = await page.evaluate(() => {
    let name = '';
    const nameEls = document.querySelectorAll('h1.product_title, h1.product-title, h1, .product-details h1');
    for (let i = 0; i < nameEls.length; i++) {
        if (nameEls[i]?.textContent) {
            name = nameEls[i].textContent!.trim();
            if (name) break;
        }
    }
    
    let priceText = '';
    const priceEls = document.querySelectorAll('.price .amount, .product-price, p.price, span.price');
    for (let i = 0; i < priceEls.length; i++) {
        if (priceEls[i]?.textContent) {
            priceText = priceEls[i].textContent!.trim();
            if (priceText) break;
        }
    }
    
    let price = 0;
    let currency = 'GBP';
    if (priceText) {
      const match = priceText.match(/[\\d,.]+/);
      if (match) price = parseFloat(match[0].replace(/,/g, ''));
      if (priceText.includes('$')) currency = 'USD';
      if (priceText.includes('€')) currency = 'EUR';
    }

    let description = '';
    const descEls = document.querySelectorAll('#tab-description, .product-description, .woocommerce-product-details__short-description, .description');
    for (let i = 0; i < descEls.length; i++) {
        if (descEls[i]?.textContent) {
            description = descEls[i].textContent!.trim();
            if (description) break;
        }
    }

    const imageEls = document.querySelectorAll('.woocommerce-product-gallery__wrapper img, .product-images img, .gallery img, img[itemprop="image"]');
    const images: string[] = [];
    for (let i = 0; i < imageEls.length; i++) {
      const img = imageEls[i];
      const src = img.getAttribute('src');
      const dataSrc = img.getAttribute('data-src');
      if (src && images.indexOf(src) === -1) images.push(src);
      if (dataSrc && images.indexOf(dataSrc) === -1) images.push(dataSrc);
    }

    return { name, price, currency, description, images };
  });


  if (!productInfo.name || productInfo.price === 0) {
    return null; // Not a valid product page
  }

  return {
    name: productInfo.name,
    description: productInfo.description,
    price_gbp: productInfo.price, // Assuming parsed value
    original_price: productInfo.price,
    original_currency: productInfo.currency,
    images: productInfo.images,
    url: page.url()
  };
}
