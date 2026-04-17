import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: './.env' });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY;

const TARGET_PRODUCTS = [
  "8938b4ae-d5f8-45b6-9490-c49f0291ae95",
  "02a2e007-5a18-45e4-9d28-cc9081e38ec7",
  "cb4c6dc1-9243-43d1-a38c-9450476c2c2a",
  "e891fa36-a294-4e94-a0ae-4250bf7e3ef2",
  "35053cfe-8f51-4cdb-96e5-b9cd35bcec62",
  "ed9d7ef5-467b-461b-8f8e-1f2ff285bd11",
  "21135d84-54a0-4a85-8391-e0c09634d9d4"
];

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  const proxyUrl = `http://api.scraperapi.com?api_key=${SCRAPERAPI_KEY}&url=${encodeURIComponent(url)}`;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(60000) });
      if (response.ok) return response;
      console.log(`  Attempt ${i + 1} failed for ${url}: ${response.statusText}`);
    } catch (err: any) {
      console.log(`  Attempt ${i + 1} threw error for ${url}: ${err.message}`);
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

async function uploadToSupabase(imageUrl: string, fileName: string): Promise<string | null> {
  try {
    const response = await fetchWithRetry(imageUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('products')
      .upload(`enhanced/${fileName}`, buffer, {
        contentType: blob.type || 'image/jpeg',
        upsert: true
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(`enhanced/${fileName}`);

    return publicUrl;
  } catch (error: any) {
    console.error(`  Error processing image ${imageUrl}: ${error.message}`);
    return null;
  }
}

async function run() {
  console.log("Starting targeted image fix...");

  for (const productId of TARGET_PRODUCTS) {
    const { data: product } = await supabase.from('products').select('*').eq('id', productId).single();
    if (!product) continue;

    console.log(`Processing: ${product.title}`);
    
    // Try to find the highest-res version
    // Current URL is likely thumbnail, try scaled
    const currentUrl = product.images[0];
    const fileName = `${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    
    // URLs to try in order of preference
    const possibleUrls = [
      currentUrl.replace('-300x300', '-scaled'),
      currentUrl.replace('-300x300', ''),
      currentUrl // fallback to the one we have
    ];

    let successUrl: string | null = null;
    for (const testUrl of possibleUrls) {
      console.log(`  Trying ${testUrl}...`);
      successUrl = await uploadToSupabase(testUrl, fileName);
      if (successUrl) break;
    }

    if (successUrl) {
      const { error } = await supabase
        .from('products')
        .update({ images: [successUrl] })
        .eq('id', productId);
      
      if (!error) console.log(`  Success! Updated ${product.title}`);
      else console.error(`  Error updating DB: ${error.message}`);
    } else {
      console.error(`  Failed to upgrade image for ${product.title}`);
    }
  }

  console.log("Image fix complete!");
}

run();
