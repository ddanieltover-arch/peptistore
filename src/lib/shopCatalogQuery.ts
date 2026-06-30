/** Columns needed for listing cards — avoids hauling large `specifications` / unused blobs over the wire. */
export const SHOP_PRODUCT_COLUMNS =
  'id,slug,title,description,price,compare_at_price,images,categories,rating,review_count,inventory,variants,created_at' as const;

/** Product detail page — excludes unused blobs while keeping PDP fields. */
export const PRODUCT_DETAIL_COLUMNS =
  'id,slug,title,description,price,compare_at_price,compare_at,images,categories,rating,review_count,inventory,variants,specifications,created_at' as const;
