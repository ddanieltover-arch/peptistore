# Analytics & Search Console Setup — Research Peptides UK

**Site:** https://www.researchpeptide.uk  
**GA4 account:** Research Peptides UK (`395411140`)  
**GA4 property:** `538450148`  
**Search Console:** `researchpeptide.uk` (verified — 43+ clicks in overview)

---

## 1. Google Search Console (done)

Your property is verified and receiving data. Complete these checks:

| Task | Where in GSC | Status |
|------|----------------|--------|
| Submit sitemap | **Indexing → Sitemaps** → add `https://www.researchpeptide.uk/sitemap.xml` | Do if not already submitted |
| Inspect homepage | **URL inspection** → `https://www.researchpeptide.uk/` → Request indexing | After major deploys |
| Check www vs non-www | Ensure both `www` and apex redirect to one canonical (`www` is canonical in code) | Verify in browser |
| Core Web Vitals | **Experience → Core Web Vitals** | Monitor weekly |
| Link to GA4 | **Settings → Associations → Google Analytics** → link property `538450148` | Do once GA4 is live |

---

## 2. Google Analytics 4 — activate on site

### Get your Measurement ID

1. Open [Google Analytics](https://analytics.google.com/) → **Research Peptides UK** property.
2. **Admin** (gear) → **Data collection and modification → Data streams**.
3. Open your **Web** stream for `researchpeptide.uk` (create one if missing).
4. Copy the **Measurement ID** (format `G-XXXXXXXXXX`) — this is **not** the numeric Property ID `538450148`.

### Add to Vercel

1. Vercel → **peptistore** project → **Settings → Environment Variables**.
2. Add:

   | Name | Value | Environments |
   |------|--------|--------------|
   | `VITE_GA4_MEASUREMENT_ID` | `G-XXTCQPY79Y` | Production, Preview |

3. **Redeploy** production so the tag loads.

### Verify it works

1. GA4 → **Admin → DebugView** (or install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) extension).
2. Visit https://www.researchpeptide.uk — you should see `page_view` events.
3. Test conversions: add to cart, start checkout, submit contact form.

---

## 3. Link GSC ↔ GA4

1. **Search Console** → **Settings** → **Associations** → **Google Analytics associations** → **Associate**.
2. Select GA4 property **Research Peptides UK** (`538450148`).
3. In **GA4** → **Admin → Product links → Google Search Console links** → confirm the link.

This unlocks Search Console reports inside GA4 (queries, landing pages, devices).

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
