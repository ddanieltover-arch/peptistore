# Phase 1 — Deploy & Verify Baseline

**Site:** https://www.researchpeptide.uk  
**Last updated:** 2026-07-06

---

## 1. Pre-deploy build (local) ✅

```bash
npm run build          # vite + seo:generate --dist + seo:validate
npm run seo:monitoring # optional weekly reminder
npx tsx scripts/phase1-verify-dist.ts
```

**Expected:** 181 prerender snapshots, SEO validation pass.

| URL | Local dist title (ready to ship) |
|-----|----------------------------------|
| `/` | Research Peptides UK \| Buy Research Peptides UK |
| `/shop` | Peptides Buy UK \| Research Peptide Catalog |
| `/product/semaglutide` | Semaglutide Peptide UK \| Buy for Laboratory Research \| … |
| Custom synthesis blog | Full title + 4 JSON-LD blocks |

---

## 2. Deploy to production

**Option A — Git push (recommended if Vercel auto-deploys from `main`):**

```bash
git add -A
git commit -m "SEO Phases 2–9: cannibalization fix, GEO, prerender, monitoring"
git push origin main
```

**Option B — Vercel CLI (prebuilt):**

```bash
npm run build
npx vercel deploy --prebuilt --prod
```

**Option C — Vercel Dashboard:** Deploy → Redeploy latest commit with cache cleared.

### Vercel env (build must have)

- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — product/blog prerender
- `VITE_GA4_MEASUREMENT_ID` — analytics
- `VITE_SITE_URL=https://www.researchpeptide.uk`

---

## 3. Post-deploy verification

```bash
npx tsx scripts/phase1-verify-live.ts
```

**Pass criteria:**

| URL | Title must contain |
|-----|-------------------|
| `/` | `Buy Research Peptides UK` |
| `/shop` | `Peptides Buy UK` |
| `/product/semaglutide` | `Semaglutide Peptide UK` |
| All samples | `seo-prerender: true`, JSON-LD ≥ 2 |

### Live vs local snapshot (2026-07-06 — **deployed ✅**)

| URL | Live title (verified) |
|-----|----------------------|
| `/` | Research Peptides UK \| Buy Research Peptides UK |
| `/shop` | Peptides Buy UK \| Research Peptide Catalog |
| `/product/semaglutide` | Semaglutide Peptide UK \| Buy for Laboratory Research |
| Custom synthesis blog | Full title + 4 JSON-LD blocks |

---

## 4. Google Search Console — URL Inspection

After deploy, request indexing for each URL (Performance → URL Inspection → **Request indexing**):

1. https://www.researchpeptide.uk/
2. https://www.researchpeptide.uk/shop
3. https://www.researchpeptide.uk/peptide-research
4. https://www.researchpeptide.uk/coas
5. https://www.researchpeptide.uk/contact
6. https://www.researchpeptide.uk/blog/custom-peptide-synthesis-in-the-uk-navigating-quality-and-laboratory-standards
7. https://www.researchpeptide.uk/blog/how-to-buy-research-peptides-in-the-uk
8. https://www.researchpeptide.uk/product/semaglutide
9. https://www.researchpeptide.uk/product/ghrp-2
10. https://www.researchpeptide.uk/product/kpv-peptide

Confirm **Page fetch** shows prerendered `<h1>` and `#answer` block, not empty SPA shell.

---

## 5. PageSpeed Insights baseline

Run manually (API quota may be exhausted in CI):

- https://pagespeed.web.dev/analysis?url=https://www.researchpeptide.uk/
- https://pagespeed.web.dev/analysis?url=https://www.researchpeptide.uk/shop
- https://pagespeed.web.dev/analysis?url=https://www.researchpeptide.uk/blog/custom-peptide-synthesis-in-the-uk-navigating-quality-and-laboratory-standards

Log mobile scores in `seo/core_web_vitals_baseline.json`.

**Targets:** LCP ≤ 2.5s · INP ≤ 200ms · CLS < 0.1

---

## 6. GSC performance baseline

1. GSC → **Performance** → Last 3 months → Export.
2. Compare May vs July for: `research peptides uk`, `custom peptide synthesis`.
3. Fill week ending **2026-07-11** in `seo/gsc_weekly_tracker.csv`.

---

## 7. Sitemap (GSC)

Google deprecated the ping endpoint. After deploy, use **GSC → Sitemaps → Resubmit** `https://www.researchpeptide.uk/sitemap.xml`.

---

## Status checklist

- [x] Local build passes (`npm run build`)
- [x] Local dist prerender verified (`npm run seo:verify:dist`)
- [x] Production deploy — **2026-07-06** (`dpl_2aFhVVWHJtbhJBn5gP9tthUVeuAZ`)
- [x] Post-deploy live verify — titles + prerender match local (`npm run seo:verify:live`)
- [ ] GSC URL Inspection (10 URLs below)
- [ ] PSI scores logged in `core_web_vitals_baseline.json`
- [ ] GSC weekly tracker first entry (`seo/gsc_weekly_tracker.csv`)
