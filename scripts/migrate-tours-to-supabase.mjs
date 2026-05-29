#!/usr/bin/env node
// Nancy Tours — one-time migration of static tours into Supabase
// =============================================================
// Reads js/tours-data.js (the legacy single-source-of-truth that
// powers tour-detail.js) and upserts each tour into the
// `nancy_tours.tours` table via PostgREST.
//
// Usage:
//   /Users/moisesvillalobos/.nvm/versions/node/v24.15.0/bin/node \
//     scripts/migrate-tours-to-supabase.mjs
//
// Notes:
// - Idempotent: uses `on_conflict=slug` + `resolution=merge-duplicates`.
// - Requires admin auth (RLS only allows public SELECT on tours).
// - Does NOT delete or modify js/tours-data.js (Task 13 owns that).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// -----------------------------------------------------------------
// Config (inline — one-time script, no env vars required)
// -----------------------------------------------------------------
const PROJECT_URL = 'https://bxafkbnfdgoqofdwccpo.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_09QlAy3FmLI85b7-5xHu4A_BsapG-U-';
const SCHEMA = 'nancy_tours';
const ADMIN_EMAIL = 'admin+nancy@dreamos.dev';
const ADMIN_PASSWORD = 'Nancytours2026*';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TOURS_DATA_PATH = resolve(__dirname, '..', 'js', 'tours-data.js');

// -----------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------
function loadLegacyTours(path) {
  const code = readFileSync(path, 'utf8');
  const sandbox = {};
  // tours-data.js sets `window.TOURS = {...}`. Rewrite to a local var.
  // eslint-disable-next-line no-eval
  eval(code.replace('window.TOURS', 'sandbox.TOURS'));
  if (!sandbox.TOURS || typeof sandbox.TOURS !== 'object') {
    throw new Error('Failed to extract window.TOURS from tours-data.js');
  }
  return sandbox.TOURS;
}

function parseCupo(cupo) {
  if (typeof cupo !== 'string') return { threshold: 6, max_capacity: 12 };
  const m = cupo.match(/(\d+)\s*\/\s*(\d+)/);
  if (!m) return { threshold: 6, max_capacity: 12 };
  const cap = Number(m[2]);
  return { threshold: cap, max_capacity: cap };
}

function mapTour(slug, t) {
  const { threshold, max_capacity } = parseCupo(t.cupo);
  return {
    slug,
    title: t.title ?? '',
    tag: t.tag ?? '',
    loc: t.loc ?? '',
    elev: t.elev ?? '',
    hero: t.hero ?? '',
    duration: t.duration ?? '',
    diff: t.diff ?? '',
    min_age: t.minAge ?? '',
    price: t.price ?? '',
    tentative_date: t.nextDate ?? '',
    lead: t.lead ?? '',
    blurb: t.blurb ?? '',
    itinerary: Array.isArray(t.itinerary) ? t.itinerary : [],
    incl: Array.isArray(t.incl) ? t.incl : [],
    excl: Array.isArray(t.excl) ? t.excl : [],
    bring: Array.isArray(t.bring) ? t.bring : [],
    faq: Array.isArray(t.faq) ? t.faq : [],
    related: Array.isArray(t.related) ? t.related : [],
    state: 'searching',
    threshold,
    max_capacity,
    confirmed_date: '',
  };
}

async function signIn() {
  const url = `${PROJECT_URL}/auth/v1/token?grant_type=password`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const body = await res.json();
  if (!res.ok || !body.access_token) {
    throw new Error(
      `Auth failed: ${res.status} ${res.statusText} — ${JSON.stringify(body)}`
    );
  }
  return body.access_token;
}

async function upsertTour(accessToken, row) {
  const url = `${PROJECT_URL}/rest/v1/tours?on_conflict=slug`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: PUBLISHABLE_KEY,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Profile': SCHEMA,
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} — ${text}`);
  }
}

async function verify() {
  const url = `${PROJECT_URL}/rest/v1/tours_with_counts?select=slug&order=slug`;
  const res = await fetch(url, {
    headers: {
      apikey: PUBLISHABLE_KEY,
      'Accept-Profile': SCHEMA,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Verify query failed: ${res.status} ${res.statusText} — ${text}`
    );
  }
  return res.json();
}

// -----------------------------------------------------------------
// Main
// -----------------------------------------------------------------
async function main() {
  console.log('Nancy Tours — migrate static tours -> Supabase');
  console.log('---------------------------------------------');

  const TOURS = loadLegacyTours(TOURS_DATA_PATH);
  const slugs = Object.keys(TOURS).filter((k) => k !== 'default');
  console.log(`Loaded ${slugs.length} tours from ${TOURS_DATA_PATH}`);
  console.log(`Skipping fallback key: 'default'`);
  console.log('');

  console.log('Signing in as admin...');
  let accessToken;
  try {
    accessToken = await signIn();
    console.log('  ok — got access token');
  } catch (err) {
    console.error('  FAILED:', err.message);
    process.exit(1);
  }
  console.log('');

  const results = { ok: [], failed: [] };
  for (const slug of slugs) {
    const t = TOURS[slug];
    const row = mapTour(slug, t);
    const cupoNote = t.cupo ? ` (cupo "${t.cupo}" -> threshold=${row.threshold}, max=${row.max_capacity})` : '';
    console.log(`-> migrating ${slug}${cupoNote}`);
    try {
      await upsertTour(accessToken, row);
      console.log('   ok');
      results.ok.push(slug);
    } catch (err) {
      console.log('   FAIL:', err.message);
      results.failed.push({ slug, error: err.message });
    }
  }

  console.log('');
  console.log('Summary');
  console.log('-------');
  console.log(`  succeeded: ${results.ok.length}/${slugs.length}`);
  console.log(`  failed:    ${results.failed.length}`);
  if (results.failed.length) {
    for (const f of results.failed) {
      console.log(`    - ${f.slug}: ${f.error}`);
    }
  }
  console.log('');

  console.log('Verifying via tours_with_counts...');
  let verifyRows;
  try {
    verifyRows = await verify();
  } catch (err) {
    console.error('  FAILED:', err.message);
    process.exit(2);
  }
  console.log(`  rows returned: ${verifyRows.length}`);
  console.log(`  slugs: ${verifyRows.map((r) => r.slug).join(', ')}`);
  console.log('');

  if (results.failed.length > 0) {
    console.log('DONE_WITH_FAILURES');
    process.exit(3);
  }

  console.log('DONE');
  process.exit(0);
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(99);
});
