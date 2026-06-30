# KPI Dashboard

## Targets

- Organic sessions: baseline from GA4, target +30% in 90 days.
- Top 10 organic keywords: baseline from GSC/Ahrefs, target 2x in 6 months.
- CTR: target >3%.
- LCP: <=2.5s.
- INP: <=200ms.
- CLS: <0.1.
- AI citation rate: monthly manual spot-check.
- Conversion rate: site-specific target after GA4 baseline.

## Monthly review (first week of each month)

| Step | Where | Record in |
|------|-------|-----------|
| Organic sessions (28d) | GA4 → Acquisition | `seo/seo_baseline.json` → `organicSessions` |
| Top 10 queries + CTR | GSC → Performance | `seo/seo_baseline.json` → `topQueries` |
| Indexed / not indexed count | GSC → Pages | `seo/seo_baseline.json` → `indexedPages` |
| Conversions | GA4 → Events (`purchase`, `generate_lead`) | note in baseline |
| Lab CWV (mobile) | PageSpeed Insights on `/`, `/shop`, 1 product | `seo/core_web_vitals_baseline.json` |
| AI citations | Manual search for brand + pillar topics | note in baseline |

## Blocked until tools or scale

- **Backlink gap analysis** — needs Ahrefs/SEMrush (`seo/link_gap_opportunities.csv`).
- **Outreach pipeline** — needs prospect export (`seo/link_building_crm.csv`).
- **CrUX field data** — needs more traffic; use Lighthouse until then.
- **Domain authority** — needs Moz/Ahrefs (`seo/seo_baseline.json` → `domainAuthority`).

## Events to watch in GA4

`page_view`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `generate_lead`, `search`, `sign_up`
