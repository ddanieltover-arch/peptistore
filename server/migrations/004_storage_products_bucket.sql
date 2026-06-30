-- Public Supabase Storage bucket for product catalog images.
-- Run via Supabase SQL editor or: npm run db:migrate

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Service role upload product images" ON storage.objects;
CREATE POLICY "Service role upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products');

DROP POLICY IF EXISTS "Service role update product images" ON storage.objects;
CREATE POLICY "Service role update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Service role delete product images" ON storage.objects;
CREATE POLICY "Service role delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products');
