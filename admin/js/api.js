// Nancy Tours admin — Supabase-backed API wrapper
// =====================================================================
// Wraps a Supabase client scoped to nancy_tours schema and exposes a thin
// CRUD surface for the admin UI. Auth uses Supabase email/password (single
// shared admin account: admin+nancy@dreamos.dev).
//
// Persists the session so that Nancy stays logged in across reloads.
// The token is auto-refreshed by the SDK. We don't expose the raw token.

(function () {
  'use strict';

  const SUPABASE_URL = 'https://bxafkbnfdgoqofdwccpo.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_09QlAy3FmLI85b7-5xHu4A_BsapG-U-';
  const SCHEMA = 'nancy_tours';
  const ADMIN_EMAIL = 'admin+nancy@dreamos.dev';
  const BUCKET = 'nancy-tour-images';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    throw new Error('[ADM] @supabase/supabase-js UMD bundle not loaded before js/api.js');
  }

  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      db: { schema: SCHEMA },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'nt-admin-auth',
      },
    }
  );

  // ── Field mapping: snake (DB) ↔ camel (JS) ─────────────────────────
  const SNAKE_TO_CAMEL = {
    max_capacity: 'maxCapacity',
    min_age: 'minAge',
    tentative_date: 'tentativeDate',
    confirmed_date: 'confirmedDate',
    derived_state: 'derivedState',
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    contacted_at: 'contactedAt',
    num_people: 'numPeople',
  };
  const CAMEL_TO_SNAKE = Object.fromEntries(
    Object.entries(SNAKE_TO_CAMEL).map(([s, c]) => [c, s])
  );
  function mapKeys(obj, table) {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((x) => mapKeys(x, table));
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[table[k] || k] = v;
    return out;
  }
  const toCamel = (o) => mapKeys(o, SNAKE_TO_CAMEL);
  const toSnake = (o) => mapKeys(o, CAMEL_TO_SNAKE);

  // ── Auth ───────────────────────────────────────────────────────────
  async function login(password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });
    if (error) throw error;
    return data;
  }
  async function logout() { await supabase.auth.signOut(); }
  async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  }

  // ── Tours ──────────────────────────────────────────────────────────
  async function listTours() {
    const { data, error } = await supabase
      .from('tours_with_counts')
      .select('*')
      .order('tentative_date', { ascending: true, nullsFirst: false });
    if (error) throw error;
    return data.map(toCamel);
  }
  async function getTour(slug) {
    const { data, error } = await supabase
      .from('tours_with_counts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return data ? toCamel(data) : null;
  }
  async function createTour(fields) {
    const { data, error } = await supabase
      .from('tours')
      .insert(toSnake(fields))
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }
  async function updateTour(slug, fields) {
    const { data, error } = await supabase
      .from('tours')
      .update(toSnake(fields))
      .eq('slug', slug)
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }
  async function deleteTour(slug) {
    const { error } = await supabase.from('tours').delete().eq('slug', slug);
    if (error) throw error;
    return { ok: true };
  }
  async function setState(slug, state, dateOverride) {
    const patch = { state };
    if (state === 'confirmed' && dateOverride) patch.confirmed_date = dateOverride;
    return updateTour(slug, patch);
  }

  // ── Leads ──────────────────────────────────────────────────────────
  async function listLeads(slug) {
    let q = supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (slug) q = q.eq('slug', slug);
    const { data, error } = await q;
    if (error) throw error;
    return data.map(toCamel);
  }
  async function markContacted(leadId, value) {
    const patch = {
      contacted: !!value,
      contacted_at: value ? new Date().toISOString() : null,
    };
    const { data, error } = await supabase
      .from('leads')
      .update(patch)
      .eq('id', leadId)
      .select()
      .single();
    if (error) throw error;
    return toCamel(data);
  }

  // ── Storage ────────────────────────────────────────────────────────
  async function uploadImage(file, filename) {
    const path = filename || `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw error;
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    return { url: pub.publicUrl, path: data.path };
  }

  // ── Config ─────────────────────────────────────────────────────────
  async function listConfig() {
    const { data, error } = await supabase.from('config').select('*');
    if (error) throw error;
    return data;
  }
  async function updateConfig(key, value) {
    const { data, error } = await supabase
      .from('config')
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  window.ADM_API = {
    supabase,
    login, logout, getSession,
    listTours, getTour, createTour, updateTour, deleteTour, setState,
    listLeads, markContacted,
    uploadImage,
    listConfig, updateConfig,
  };
})();
