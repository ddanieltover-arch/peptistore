/** Stored on PDF-imported products for dedupe/scripts — not shown on the storefront. */
export const PEPTIDE_POWDER_PDF_IMPORT_MARKER = 'Source: peptide-powder-price-list (PDF)';

function isPeptidePowderImportMetadata(spec: string): boolean {
  const trimmed = spec.trim();
  if (!trimmed) return true;
  if (trimmed === PEPTIDE_POWDER_PDF_IMPORT_MARKER) return true;
  if (trimmed === 'Lyophilized powder catalog line (research use only).') return true;
  if (trimmed.startsWith('Wholesale list amounts were USD nominal;')) return true;
  // Catalog SKU lines from import-peptide-powder-catalog.ts (e.g. "SM2: 2mg × 10 vials")
  if (/^[A-Z0-9]+:\s/.test(trimmed) && /vials/i.test(trimmed)) return true;
  return false;
}

/** Customer-facing product profile bullets (excludes import / ops metadata). */
export function filterProductSpecificationsForDisplay(
  specifications: string[] | null | undefined,
): string[] {
  if (!specifications?.length) return [];
  return specifications.filter((spec) => !isPeptidePowderImportMetadata(spec));
}
