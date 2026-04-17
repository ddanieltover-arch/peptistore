import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // load frontend env

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("Missing Supabase credentials in frontend .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function queueFromFile() {
  console.log('Initiating Batched Database Injection over HTTPS...');
  try {
    const html = fs.readFileSync('shop_dump.html', 'utf-8');
    const matches = html.match(/https:\/\/researchpeptide\.co\.uk\/product\/[a-zA-Z0-9-]+\//g);
    
    if (!matches) {
      console.log('No matches found in file.');
      return;
    }

    const discovered = Array.from(new Set(matches));
    console.log(`Found ${discovered.length} unique products in shop_dump.html`);

    let inserted = 0;
    
    // Process in smaller batches sequentially
    for (const url of discovered) {
      // 1. Check if it exists
      const { data: existing } = await supabase
        .from('scrape_queue')
        .select('id')
        .eq('type', 'SCRAPE_PRODUCT')
        .contains('payload', { url })
        .in('status', ['pending', 'processing'])
        .maybeSingle();

      if (!existing) {
        // 2. Insert if it doesn't exist
        const { error } = await supabase
          .from('scrape_queue')
          .insert({
            type: 'SCRAPE_PRODUCT',
            payload: { url }
          });
          
        if (!error) {
          inserted++;
          if (inserted % 10 === 0) console.log(`Enqueued ${inserted} items...`);
        } else {
             console.log(`Failed to enqueue ${url}: ${error.message}`);
        }
      }
    }

    console.log(`Successfully enqueued ${inserted} products into the queue table.`);
  } catch (e: any) {
    console.error('CRITICAL ERROR DURING QUEUEING:', e);
  } finally {
    process.exit(0);
  }
}

queueFromFile();
