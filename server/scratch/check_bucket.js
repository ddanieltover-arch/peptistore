import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkOrMakeBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error listing buckets:", error);
    return;
  }
  
  const bucketName = 'products';
  let bucket = buckets.find(b => b.name === bucketName);
  
  if (!bucket) {
    console.log(`Bucket '${bucketName}' not found. Creating...`);
    const { data, error: createError } = await supabase.storage.createBucket(bucketName, { public: true });
    if (createError) {
      console.error("Error creating bucket:", createError);
    } else {
      console.log("Bucket created successfully:", data);
    }
  } else {
    console.log(`Bucket '${bucketName}' already exists.`);
  }
}

checkOrMakeBucket();
