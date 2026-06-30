-- SEO-friendly blog post slugs (title-derived, unique)
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_unique_idx
ON public.blog_posts(slug)
WHERE slug IS NOT NULL;

COMMENT ON COLUMN public.blog_posts.slug IS 'SEO-friendly slug derived from title.';
