// Nancy Tours Costa Rica — tours/leads API wrapper
// =====================================================================
// Thin, opinionated wrapper around window.NT_SUPABASE. Exposes the
// three calls the public site actually makes:
//
//   NT_API.getTours(opts?)               → camelCase tour rows
//   NT_API.getTour(slug, opts?)          → single camelCase tour row
//   NT_API.postInterest({slug, name,
//                        whatsapp, numPeople})
//                                        → {ok, newCount, threshold, derivedState}
//
// Reads always hit the tours_with_counts VIEW — never the raw tours
// table — because the view already joins lead counts and computes the
// derived_state. Keeping that logic in Postgres means the JS can't drift
// out of sync with admin decisions.
//
// Writes go to the raw nancy_tours.leads table. RLS gates the insert.
//
// REQUIRES: js/supabase-client.js (and the Supabase UMD bundle) must
// load BEFORE this file.

(function () {
  'use strict';

  if (!window.NT_SUPABASE) {
    throw new Error(
      '[NT_API] window.NT_SUPABASE missing. Load js/supabase-client.js first.'
    );
  }

  const sb = window.NT_SUPABASE;

  // ── Cache ───────────────────────────────────────────────────────────
  // sessionStorage so it auto-clears on tab close. 60s TTL is long
  // enough to absorb tours.html → tour-detail navigation, short enough
  // that interest-bar updates feel live to a returning visitor.
  const CACHE_TTL_MS = 60 * 1000;
  const CACHE_KEY_TOURS = 'nt:tours';
  const cacheKeyTour = (slug) => `nt:tour:${slug}`;

  function cacheRead(key) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.expires !== 'number') return null;
      if (Date.now() > parsed.expires) return null;
      return parsed.value;
    } catch (e) {
      // Private mode, quota, or malformed JSON — treat as cache miss.
      return null;
    }
  }

  function cacheWrite(key, value) {
    try {
      sessionStorage.setItem(
        key,
        JSON.stringify({ value, expires: Date.now() + CACHE_TTL_MS })
      );
    } catch (e) {
      // Quota or private mode — silently skip; the next call just refetches.
    }
  }

  function cacheDelete(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      // Ignore.
    }
  }

  // ── Field mapping (snake_case → camelCase) ─────────────────────────
  // The DB is snake_case (Postgres convention); JS callers want camelCase.
  // We map at the boundary so the rest of the site never sees snake_case.
  // Listed fields stay untouched on the right-hand side; jsonb arrays
  // (itinerary, incl, excl, bring, faq, related) pass through as-is.
  function mapTour(row) {
    if (!row) return null;
    return {
      slug: row.slug,
      title: row.title,
      tag: row.tag,
      loc: row.loc,
      elev: row.elev,
      hero: row.hero,
      state: row.state,
      threshold: row.threshold,
      maxCapacity: row.max_capacity,
      duration: row.duration,
      diff: row.diff,
      minAge: row.min_age,
      price: row.price,
      tentativeDate: row.tentative_date,
      confirmedDate: row.confirmed_date,
      lead: row.lead,
      blurb: row.blurb,
      itinerary: row.itinerary,
      incl: row.incl,
      excl: row.excl,
      bring: row.bring,
      faq: row.faq,
      related: row.related,
      interested: row.interested,
      derivedState: row.derived_state,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // ── Reads ───────────────────────────────────────────────────────────
  // Both reads hit tours_with_counts. We filter `state != 'completed'`
  // server-side so the catalog never has to remember to hide them.

  async function getTours(opts) {
    const noCache = !!(opts && opts.noCache);
    if (!noCache) {
      const hit = cacheRead(CACHE_KEY_TOURS);
      if (hit) return hit;
    }

    const { data, error } = await sb
      .from('tours_with_counts')
      .select('*')
      .neq('state', 'completed')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const tours = (data || []).map(mapTour);
    cacheWrite(CACHE_KEY_TOURS, tours);
    return tours;
  }

  async function getTour(slug, opts) {
    if (!slug) throw new Error('[NT_API.getTour] slug is required');
    const key = cacheKeyTour(slug);
    const noCache = !!(opts && opts.noCache);
    if (!noCache) {
      const hit = cacheRead(key);
      if (hit) return hit;
    }

    const { data, error } = await sb
      .from('tours_with_counts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const tour = mapTour(data);
    cacheWrite(key, tour);
    return tour;
  }

  // ── Write: postInterest ────────────────────────────────────────────
  // 1. INSERT into nancy_tours.leads with snake_case payload.
  // 2. Re-query the view (noCache) to read the freshly-computed
  //    `interested` count and `derived_state`. Doing the recompute
  //    server-side keeps JS out of the threshold logic.
  // 3. Invalidate both the tours list cache and this slug's cache so
  //    the next read by any other component reflects the new lead.
  async function postInterest(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('[NT_API.postInterest] payload required');
    }
    const { slug, name, whatsapp, numPeople } = payload;
    if (!slug) throw new Error('[NT_API.postInterest] slug required');
    if (!name) throw new Error('[NT_API.postInterest] name required');
    if (!whatsapp) throw new Error('[NT_API.postInterest] whatsapp required');
    const n = Number(numPeople);
    if (!Number.isFinite(n) || n < 1) {
      throw new Error('[NT_API.postInterest] numPeople must be >= 1');
    }

    const insertRow = {
      slug,
      name,
      whatsapp,
      num_people: n,
      contacted: false,
      contacted_at: null,
    };

    const { error: insertError } = await sb
      .from('leads')
      .insert(insertRow);

    if (insertError) throw insertError;

    // Invalidate caches BEFORE the refetch so getTour can't accidentally
    // serve a stale entry (and so other tabs/components do a fresh read).
    cacheDelete(CACHE_KEY_TOURS);
    cacheDelete(cacheKeyTour(slug));

    const fresh = await getTour(slug, { noCache: true });
    if (!fresh) {
      // The insert succeeded but the tour vanished between calls (rare:
      // admin deleted it). Surface what we know and let the UI decide.
      return {
        ok: true,
        newCount: null,
        threshold: null,
        derivedState: null,
      };
    }

    return {
      ok: true,
      newCount: fresh.interested,
      threshold: fresh.threshold,
      derivedState: fresh.derivedState,
    };
  }

  // ── Public surface ──────────────────────────────────────────────────
  window.NT_API = {
    getTours,
    getTour,
    postInterest,
  };
})();
