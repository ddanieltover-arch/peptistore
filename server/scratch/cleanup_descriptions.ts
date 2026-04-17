import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../.env') }); // load frontend env for supabase keys

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables not found!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanupData() {
  console.log('Starting data cleanup...');
  
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ description: 'Premium research peptide for laboratory research use only.' })
      .ilike('description', '%Scraped from local dump%');

    if (error) {
      console.error('Error updating products:', error);
    } else {
      console.log('Successfully updated product descriptions.');
    }
  } catch (err) {
    console.error('Failed to cleanup:', err);
  } finally {
    process.exit(0);
  }
}

cleanupData();
