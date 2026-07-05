import { existsSync, readFileSync } from 'node:fs';

const SITE = 'https://www.researchpeptide.uk';

function readCsv(path: string): string[][] {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.split(','));
}

function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 999;
  return Math.floor((Date.now() - then) / 86400000);
}

console.log('\n=== SEO Monitoring Report ===');
console.log('Site:', SITE);
console.log('Generated:', new Date().toISOString().slice(0, 10));
console.log('');

const tasks: string[] = [];

// Rank tracker — check if latest week column has empty cells
const rankRows = readCsv('seo/rank_tracker.csv');
if (rankRows.length === 0) {
  tasks.push('[ ] Create or restore seo/rank_tracker.csv');
} else {
  const header = readFileSync('seo/rank_tracker.csv', 'utf8').split(/\r?\n/)[0].split(',');
  const weekCols = header.filter((h) => h.startsWith('Week '));
  const latestWeek = weekCols[weekCols.length - 1];
  const empty = rankRows.filter((row) => {
    const idx = header.indexOf(latestWeek);
    return idx >= 0 && !row[idx]?.trim();
  }).length;
  if (empty > 0) {
    tasks.push(`[ ] Semrush: fill "${latestWeek}" for ${empty}/${rankRows.length} keywords in rank_tracker.csv`);
  } else {
    console.log('OK  Rank tracker — latest week column filled');
  }
}

// GSC weekly — check current week row
const gscRows = readCsv('seo/gsc_weekly_tracker.csv');
const incompleteGsc = gscRows.filter((row) => row.length >= 3 && !row[2]?.trim() && row[0] !== '2026-07-04').length;
if (incompleteGsc > 0) {
  tasks.push(`[ ] GSC: complete ${incompleteGsc} rows in gsc_weekly_tracker.csv (impressions/clicks)`);
} else if (gscRows.length > 0) {
  console.log('OK  GSC weekly tracker — no empty impression rows flagged');
}

// AI citation — monthly
const aiRows = readCsv('seo/ai_citation_log.csv');
const lastAi = aiRows[aiRows.length - 1];
if (lastAi && !lastAi[3]?.trim()) {
  tasks.push('[ ] AI citations: complete ai_citation_log.csv (monthly spot-check)');
} else if (aiRows.length > 0) {
  console.log('OK  AI citation log has entries (review monthly)');
}

// Link CRM — count prospects ready
const crmRows = readCsv('seo/link_building_crm.csv');
const queued = crmRows.filter((r) => /^(Prospect|Queued)$/i.test(r[7] || '')).length;
const sent = crmRows.filter((r) => /^Sent$/i.test(r[7] || '')).length;
console.log(`    Link CRM: ${queued} prospects queued, ${sent} awaiting follow-up`);
if (queued >= 5) {
  tasks.push(`[ ] Outreach: send 10+ emails this week (${queued} prospects in CRM)`);
}

// Guest posts
const guestRows = readCsv('seo/guest_post_pipeline.csv');
const notStarted = guestRows.filter((r) => /Not started|Queued/i.test(r[4] || '')).length;
if (notStarted > 0) {
  tasks.push(`[ ] Guest posts: advance 1 target in guest_post_pipeline.csv (${notStarted} queued/not started)`);
}

// Baseline review date
if (existsSync('seo/seo_baseline.json')) {
  const baseline = JSON.parse(readFileSync('seo/seo_baseline.json', 'utf8')) as {
    measurementNextReview?: string;
    offPage?: { linkBuildingStarted?: string };
  };
  if (baseline.measurementNextReview) {
    const overdue = daysSince(baseline.measurementNextReview);
    if (overdue > 7) {
      tasks.push(`[ ] Update seo_baseline.json — last review ${overdue} days ago`);
    }
  }
}

console.log('');
if (tasks.length) {
  console.log('Action items:');
  tasks.forEach((t) => console.log(t));
} else {
  console.log('All routine checks passed. See seo/weekly_monitoring_runbook.md for manual steps.');
}
console.log('\nDocs: seo/weekly_monitoring_runbook.md · seo/kpis_dashboard.md\n');
