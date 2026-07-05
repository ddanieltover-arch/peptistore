# Weekly SEO Monitoring Runbook — Research Peptides UK

**Cadence:** 30–45 minutes every Monday  
**Owner:** Marketing / SEO  
**Last updated:** 2026-07-06 (Phase 9)

---

## 1. Semrush rank check (10 keywords)

1. Open Semrush → **Position Tracking** (or Organic Research → domain overview).
2. Country: **UK**, device: **Desktop**.
3. Update `seo/rank_tracker.csv` — fill the current week column for all 10 rows.
4. Flag any keyword that moved **±5 positions** or crossed page 1 (pos ≤ 10).

**Priority keywords:** `custom peptide synthesis`, `research peptides uk`, `tested peptides`, `peptides buy uk`.

---

## 2. Google Search Console (weekly)

1. **Performance → Search results** → Last 7 days → filter by query.
2. Export or copy metrics for the 5 queries in `seo/gsc_weekly_tracker.csv`.
3. Fill: Impressions, Clicks, CTR, Avg position, Top landing page.
4. **Pages → Indexing** — note any new “Crawled – not indexed” on pillar URLs.
5. **URL Inspection** — request indexing only when you shipped new content that week.

**Success signals:** `custom peptide synthesis` impressions rising; `/shop` and `/coas` appearing as landing pages for buy/tested queries.

---

## 3. GA4 snapshot (optional, monthly deep-dive)

1. **Reports → Acquisition → Traffic acquisition** → Organic Search — sessions vs prior week.
2. **Reports → Engagement → Events** — `purchase`, `generate_lead`, `begin_checkout`, `view_item`.
3. Log totals in `seo/seo_baseline.json` under `weeklySnapshots` (append array).

---

## 4. Link building (ongoing — ~50 outreach/month)

1. Pick **10–15 prospects** from `seo/link_building_crm.csv` with Status `Prospect` or `Queued`.
2. Send outreach using templates in `seo/email_templates.md`.
3. Update CRM: Outreach Date, Status → `Sent`, schedule Follow-up 1 (+5 business days).
4. Target: **5–10 new contacts/week** → **1–2 links/month** initially.

---

## 5. Guest posts (2 pitches/month minimum)

1. Review `seo/guest_post_pipeline.csv` — advance one target to `Pitched` per fortnight.
2. Use **Guest post pitch** template; link to pillar content (custom synthesis or buy guide).

---

## 6. AI citation spot-check (monthly — first Monday of month)

Run these queries in Perplexity, ChatGPT (browse), and Google (AI Overview if shown):

| Query | Ideal cite URL |
|-------|----------------|
| What are research peptides UK? | `/` or `/blog/what-are-research-peptides` |
| How to buy research peptides in the UK? | `/blog/how-to-buy-research-peptides-in-the-uk` |
| Custom peptide synthesis UK | Custom synthesis blog |
| Tested peptides UK COA | `/coas` |
| Oxford peptides research sourcing | Oxford blog or `/contact` |

Log results in `seo/ai_citation_log.csv`.

---

## 7. Automate reminder (local)

```bash
npm run seo:monitoring
```

Prints overdue tasks based on file dates and empty columns in trackers.

---

## Escalation triggers

| Signal | Action |
|--------|--------|
| Core keyword drops ≥10 positions | Check GSC for manual action; verify canonical/prerender |
| Zero impressions for 14 days on pillar URL | URL Inspection + internal links audit |
| New toxic referring domain in GSC Links | Evaluate for `seo/disavow.txt` |
| CWV lab score drops below budget | Run PSI; check hero preload and third-party scripts |
