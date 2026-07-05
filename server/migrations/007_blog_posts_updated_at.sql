-- Track content freshness for Article schema dateModified
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

UPDATE public.blog_posts
SET updated_at = created_at
WHERE updated_at IS NULL;

COMMENT ON COLUMN public.blog_posts.updated_at IS 'Last content revision; used for SEO dateModified.';
