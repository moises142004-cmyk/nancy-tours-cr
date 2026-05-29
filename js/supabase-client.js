// Nancy Tours Costa Rica — Supabase client init
// =====================================================================
// Initializes the Supabase JS SDK against the nancy_tours Postgres schema.
// Exposes the configured client as window.NT_SUPABASE.
//
// REQUIRES: the official Supabase JS UMD bundle MUST be loaded BEFORE
// this file, e.g.:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
//   <script src="js/supabase-client.js"></script>
//
// The UMD bundle exposes window.supabase.createClient(...). If it's not
// present we throw a clear error rather than silently failing later.
//
// The URL and publishable key below are NOT secrets — they're the
// browser-safe public credentials. RLS gates what they can do:
//   • SELECT on nancy_tours.tours / tours_with_counts (allowed)
//   • INSERT on nancy_tours.leads (allowed, with validation)
//   • SELECT on nancy_tours.leads (denied — admin module reads those)

(function () {
  'use strict';

  // Project URL — points at the Nancy Tours Supabase project
  const SUPABASE_URL = 'https://bxafkbnfdgoqofdwccpo.supabase.co';

  // Publishable key — the new "sb_publishable_*" credential (replaces the
  // legacy anon key). Safe to ship in the browser; RLS enforces access.
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_09QlAy3FmLI85b7-5xHu4A_BsapG-U-';

  // All app tables/views live under the nancy_tours schema, not public.
  const SUPABASE_SCHEMA = 'nancy_tours';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    throw new Error(
      '[NT_SUPABASE] @supabase/supabase-js UMD bundle not found on window. ' +
      'Load it BEFORE js/supabase-client.js.'
    );
  }

  // Scope the client to the nancy_tours schema so every from('tours')
  // call resolves to nancy_tours.tours without per-call qualification.
  window.NT_SUPABASE = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      db: { schema: SUPABASE_SCHEMA },
      auth: {
        // Public site is read-mostly; admin module manages its own session.
        // Persisting + auto-refreshing here is harmless but unnecessary.
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
})();
