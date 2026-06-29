# Analytics & Search Console Setup — Research Peptides UK

**Site:** https://www.researchpeptide.uk  
**GA4 account:** Research Peptides UK (`395411140`)  
**GA4 property:** `538450148`  
**Search Console:** `researchpeptide.uk` (verified — 43+ clicks in overview)

---

## 1. Google Search Console ✅

| Task | Status |
|------|--------|
| Property verified (`researchpeptide.uk`) | ✅ Done |
| Sitemap submitted (`/sitemap.xml`) | ✅ Done |
| Linked to GA4 property `538450148` | ✅ Done |

---

## 2. Google Analytics 4 ✅

| Task | Status |
|------|--------|
| Measurement ID `G-XXTCQPY79Y` in Vercel | ✅ Done |
| Production deploy | ✅ Done |
| Realtime hits confirmed | ✅ Done |
| `purchase` + `generate_lead` marked as key events | ✅ Done |

### Reference (already configured)

## 3. Link GSC ↔ GA4 ✅

Association complete between Search Console and GA4 property `538450148`.

---

## 4. Events implemented in code

| Event | Trigger |
|-------|---------|
| `page_view` | Every route change (SPA) |
| `add_to_cart` | Product added to cart |
| `begin_checkout` | Checkout page loaded with items |
| `purchase` | Order successfully created |
| `generate_lead` | Contact form or newsletter signup |
| `sign_up` | New account registration |

### Mark conversions in GA4

After events appear in **Reports → Realtime** or **DebugView**:

1. **Admin → Events** — confirm `purchase`, `generate_lead`, `begin_checkout` are listed.
2. Toggle **Mark as key event** (conversion) for:
   - `purchase`
   - `generate_lead`
   - `begin_checkout` (optional)

---

## 5. Enhanced measurement (GA4 UI)

In your **Web data stream** → **Enhanced measurement**, enable:

- Page views (supplement to manual SPA tracking)
- Scrolls
- Outbound clicks
- Site search (if you add `search` events later)
- Form interactions
- File downloads

---

## 6. Optional: GTM instead of direct GA4

If you prefer Google Tag Manager:

1. Create a GTM container at [tagmanager.google.com](https://tagmanager.google.com).
2. Set `VITE_GTM_ID=GTM-XXXXXXX` in Vercel.
3. Configure GA4 Configuration tag inside GTM.
4. Remove or leave `VITE_GA4_MEASUREMENT_ID` unset to avoid double-loading.

---

## 7. Local development

Add to `.env` (never commit real IDs to git if the repo is public):

```env
VITE_GA4_MEASUREMENT_ID=G-XXTCQPY79Y
```

Restart `npm run dev`. Events only fire in the browser when this variable is set.

---

## 8. KPI baseline (from GSC screenshot)

| Metric | Baseline (May 2026) | 90-day target |
|--------|---------------------|---------------|
| Search clicks | ~43 total | +30% organic sessions (GA4) |
| Indexed pages | Check GSC → Pages | Full sitemap coverage |
| CTR | GSC Performance | > 3% |
| Conversions | Set after GA4 live | Track `purchase` + `generate_lead` |

Update `seo/seo_baseline.json` after GA4 is live and GSC is linked.

---

## 9. Build-time prerender (Option B) ✅

Each production build runs `seo:generate --dist` after Vite, writing static HTML snapshots into `dist/` for crawlers and AI bots.

| Route type | Count (typical) | Example |
|------------|-----------------|---------|
| Static SEO pages | 16 | `/shop`, `/faq`, `/peptide-guide` |
| Product pages | ~146 | `/product/adamax` |
| Blog articles | 5 | `/blog/{id}` |

### What crawlers receive

- Full `<title>`, meta description, canonical, OG/Twitter tags
- JSON-LD (`Product`, `Article`, `BreadcrumbList`, etc.)
- Visible `<h1>` and answer capsule in `#seo-prerender` (no JS required)

### Vercel env (build)

```env
SEO_FETCH_REMOTE=true
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...   # server-only; enables product + blog fetch
```

### After deploy — verify in GSC

1. **URL Inspection** → test `/product/adamax` and one `/blog/{id}` URL.
2. Confirm **Google-selected canonical** and rendered HTML show product/article content (not empty SPA shell).
3. **Request indexing** for a sample product + blog URL.
4. Check `seo/prerender_manifest.json` in the repo after build logs (`Prerendered N HTML snapshots`).

### Notes

- Vercel serves static files from `dist/` before the SPA rewrite, so prerender HTML is returned for matching paths.
- Blog URLs use post `id` (no `slug` column in DB yet).
- Local builds need `server/.env` or root `.env` with Supabase credentials; anon key works for public tables.
