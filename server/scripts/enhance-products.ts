import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const SCRAPERAPI_KEY = '57598939deeac0e6fcd3c03247788a03';

async function fetchWithRetry(url: string, retries = 3, options = {}): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      console.warn(`    Attempt ${i + 1} failed: ${res.statusText}`);
    } catch (e) {
      console.warn(`    Attempt ${i + 1} threw error:`, (e as any).message);
    }
    await new Promise(r => setTimeout(r, 2000 * (i + 1)));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

async function downloadAndUploadImage(url: string, productId: string): Promise<string | null> {
  try {
    // Proxy the image download as well
    const proxiedUrl = `http://api.scraperapi.com?api_key=${SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}`;
    const res = await fetchWithRetry(proxiedUrl);
    const buffer = await res.arrayBuffer();
    
    const fileName = `${productId}/${path.basename(new URL(url).pathname)}`;
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, buffer, {
        contentType: res.headers.get('content-type') || 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (e) {
    console.error(`  Error processing image ${url}:`, (e as any).message);
    return null;
  }
}

async function enhanceProducts() {
  try {
    console.log('Fetching products to enhance...');
    
    // Fetch products that need enhancement
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, title')
      // Filtering in JS because nested joins with external tables (scrape_products)
      // is easier if we just fetch all and filter, or we can use a raw SQL RPC if needed.
      // For simplicity, let's get all titles and match.
      
    if (fetchError) throw fetchError;

    // Get source URLs from scrape_products
    // We can't easily join in Supabase client without views, so we'll fetch scrape_data separately
    const { data: scrapeData, error: scrapeError } = await supabase
      .from('scrape_products')
      .select('name, source_url');
    
    if (scrapeError) throw scrapeError;

    const productsToEnhance = products.filter(p => {
      // Logic: variants is null or image is hotlinked
      // We'll just filter manually for now or fetch more columns
      return true; // We'll process them and if they have hotlinked images we continue
    });

    console.log(`Found ${productsToEnhance.length} products to check for enhancement.`);

    for (const prod of productsToEnhance) {
      const sp = scrapeData.find(s => s.name === prod.title);
      if (!sp) continue;

      // Check if already enhanced
      const { data: currentProd } = await supabase
        .from('products')
        .select('variants, images')
        .eq('id', prod.id)
        .single();
      
      if (currentProd?.variants && currentProd.images?.[0] && !currentProd.images[0].includes('researchpeptide.co.uk')) {
        // console.log(`  ${prod.title} already enhanced. Skipping.`);
        continue;
      }

      console.log(`Processing ${prod.title}...`);
      
      try {
        const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPERAPI_KEY}&url=${encodeURIComponent(sp.source_url)}`;
        const res = await fetchWithRetry(scraperUrl);
        const html = await res.text();

        // 1. Extract Variations
        let variants = null;
        const variationsMatch = html.match(/data-product_variations=["']([^"']+)["']/);
        if (variationsMatch) {
          try {
            const unescaped = variationsMatch[1]
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&apos;/g, "'");
            variants = JSON.parse(unescaped);
            console.log(`    Found ${variants.length} variations.`);
          } catch (e) {
            console.error(`    Failed to parse variations for ${prod.title}:`, e);
          }
        }

        // 2. Extract High-Res Images
        const imageUrls: string[] = [];
        const mainImgMatch = html.match(/data-large_image=["']([^"']+)["']/);
        if (mainImgMatch) {
          const publicUrl = await downloadAndUploadImage(mainImgMatch[1], prod.id);
          if (publicUrl) {
             imageUrls.push(publicUrl);
             console.log(`    Downloaded main image.`);
          }
        }

        const galleryRegex = /data-large_image=["']([^"']+)["']/g;
        let match;
        while ((match = galleryRegex.exec(html)) !== null) {
          if (match[1] !== mainImgMatch?.[1]) {
            const publicUrl = await downloadAndUploadImage(match[1], prod.id);
            if (publicUrl) imageUrls.push(publicUrl);
          }
        }

        // 3. Update Database via Supabase Client
        const updateData: any = {};
        if (imageUrls.length > 0) updateData.images = imageUrls;
        if (variants) {
          updateData.variants = variants;
          const prices = variants.map((v: any) => v.display_price).filter((p: any) => p > 0);
          if (prices.length > 0) {
            updateData.price = Math.min(...prices);
          }
        }

        if (Object.keys(updateData).length > 0) {
          const { error: updateError } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', prod.id);

          if (updateError) throw updateError;
          console.log(`    Updated ${prod.title} successfully.`);
        }

      } catch (err) {
        console.error(`    Failed to enhance ${prod.title}:`, (err as any).message);
      }
      
      await new Promise(r => setTimeout(r, 500));
    }

    console.log('Enhancement complete!');

  } catch (error) {
    console.error('Enhancement failed:', error);
  }
}

enhanceProducts();
