import { supabase } from '../supabase';
import { slugifyProductName } from './productUrl';

/** Columns needed for listing cards — avoids hauling large `specifications` / unused blobs over the wire. */
export const SHOP_PRODUCT_COLUMNS =
  'id,slug,title,description,price,compare_at_price,images,categories,rating,review_count,inventory,variants,created_at' as const;

/** Product detail page — excludes unused blobs while keeping PDP fields. */
export const PRODUCT_DETAIL_COLUMNS =
  'id,slug,title,description,price,compare_at_price,images,categories,rating,review_count,inventory,variants,specifications,created_at' as const;

type ProductRow = {
  id: string | number;
  title?: string | null;
  slug?: string | null;
  variants?: Array<{ variation_id?: string | number; display_price?: number; display_name?: string; attributes?: Record<string, string> }>;
  images?: string[];
  [key: string]: unknown;
};

function matchesSlug(row: ProductRow, slug: string): boolean {
  const stored = row.slug && String(row.slug).trim();
  if (stored === slug) return true;
  return slugifyProductName(String(row.title || '')) === slug;
}

/** Resolve a product by SEO slug, legacy slugified title, or id. */
export async function fetchProductDetail(slugOrId: string, bySlug = true): Promise<ProductRow | null> {
  if (bySlug) {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_DETAIL_COLUMNS)
      .eq('slug', slugOrId)
      .maybeSingle();

    if (error) {
      console.error('Product slug lookup failed:', error.message);
      return null;
    }
    if (data) return data;

    const keyword = slugOrId.split('-').filter(Boolean)[0];
    if (!keyword) return null;

    const { data: candidates, error: fallbackError } = await supabase
      .from('products')
      .select(PRODUCT_DETAIL_COLUMNS)
      .ilike('title', `%${keyword}%`)
      .limit(25);

    if (fallbackError) {
      console.error('Product title fallback lookup failed:', fallbackError.message);
      return null;
    }

    return candidates?.find((row) => matchesSlug(row, slugOrId)) ?? null;
  }

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_DETAIL_COLUMNS)
    .eq('id', slugOrId)
    .maybeSingle();

  if (error) {
    console.error('Product id lookup failed:', error.message);
    return null;
  }
  return data;
}
