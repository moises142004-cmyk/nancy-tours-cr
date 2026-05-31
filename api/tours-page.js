// api/tours-page.js
// Vercel Serverless Function — server-renders /tours with live Supabase data.
// CDN-cached 60s + stale-while-revalidate 5min. New tours appear within 60s.
//
// Reads tours.html as a template, replaces only the #tp-grid inner HTML with
// server-rendered cards, and embeds the tour data as a JSON script so the
// client-side filter chips (js/tours.js) work without an extra round-trip.
//
// Falls back gracefully to an empty-state message if Supabase is unreachable.

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://bxafkbnfdgoqofdwccpo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_09QlAy3FmLI85b7-5xHu4A_BsapG-U-';

const STATE_LABEL = {
  'searching': 'BUSCANDO INTERESADOS',
  'near_threshold': 'CASI SE CONFIRMA',
  'confirmed': '✓ CONFIRMADO',
  'postponed': 'POSPUESTO · NUEVA FECHA',
};

const STATE_CSS_CLASS = {
  'searching': 'nt-state--searching',
  'near_threshold': 'nt-state--near-threshold',
  'confirmed': 'nt-state--confirmed',
  'postponed': 'nt-state--postponed',
};

const STATE_ORDER = ['near_threshold', 'confirmed', 'searching', 'postponed'];

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

function rootImg(s) {
  if (!s) return '';
  if (/^https?:/i.test(s)) return s;
  return '/' + String(s).replace(/^\//, '');
}

function ctaLabel(state) {
  if (state === 'confirmed') return 'Reservar →';
  if (state === 'postponed') return 'Me sumo en esta fecha →';
  if (state === 'near_threshold') return 'Sumarme →';
  return 'Me interesa →';
}

function progressPercent(t) {
  if (t.derived_state === 'confirmed') return 100;
  const n = t.interested || 0;
  const th = t.threshold || 1;
  return Math.min(100, Math.round((n / th) * 100));
}

function progressTextHtml(t) {
  const state = t.derived_state;
  const n = t.interested || 0;
  const th = t.threshold || 0;
  if (state === 'confirmed') {
    const max = t.max_capacity || th;
    const remaining = Math.max(0, max - n);
    return `<span><strong>${n}</strong> personas en ruta</span><span class="nt-progress-accent">${remaining > 0 ? 'Quedan ' + remaining + ' cupos' : 'Tour lleno'}</span>`;
  }
  const remaining = Math.max(0, th - n);
  const fire = state === 'near_threshold' && remaining > 0 ? ' 🔥' : '';
  return `<span><strong>${n}</strong> interesados</span><span class="nt-progress-accent">Faltan ${remaining} más${fire}</span>`;
}

function dateBlockHtml(t) {
  if (t.derived_state === 'confirmed') {
    const date = t.confirmed_date || t.tentative_date || '';
    return `<div class="nt-date-confirmed"><span class="nt-date-num">${esc(date)}</span></div>`;
  }
  const label = t.derived_state === 'postponed' ? 'Nueva fecha tentativa:' : 'Fecha tentativa:';
  const date = t.tentative_date || '';
  return `<div class="nt-date-tentative"><span>📅 ${label}</span> <span class="nt-date-num">${esc(date)}</span></div>`;
}

function renderCard(t) {
  const state = t.derived_state;
  const remaining = Math.max(0, (t.threshold || 0) - (t.interested || 0));
  const badgeText = state === 'near_threshold'
    ? `${STATE_LABEL[state]} · FALTAN ${remaining}`
    : (STATE_LABEL[state] || state);
  const cssClass = STATE_CSS_CLASS[state] || '';
  const ariaLabel = `${t.title} — ${STATE_LABEL[state] || ''}, ${t.tentative_date || ''}, desde ${t.price || ''}`;
  return `
    <a href="/tours/${encodeURIComponent(t.slug)}" class="nt-tour-card ${cssClass}" aria-label="${esc(ariaLabel)}">
      <div class="nt-tour-photo" style="background-image: url('${esc(rootImg(t.hero))}')">
        <span class="nt-state-badge"><span class="nt-state-dot"></span>${esc(badgeText)}</span>
      </div>
      <div class="nt-tour-body">
        <div>
          <h2 class="nt-tour-title">${esc(t.title)}</h2>
          <div class="nt-tour-loc">${esc(t.loc || '')}</div>
        </div>
        ${dateBlockHtml(t)}
        <div class="nt-progress">
          <div class="nt-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${t.threshold || 0}" aria-valuenow="${Math.min(t.interested || 0, t.threshold || 0)}" aria-label="${t.interested || 0} de ${t.threshold || 0} interesados">
            <div class="nt-progress-fill" style="width: ${progressPercent(t)}%"></div>
          </div>
          <div class="nt-progress-text">${progressTextHtml(t)}</div>
        </div>
        <div class="nt-tour-foot">
          <div><span class="nt-meta-k">DESDE</span><strong class="nt-tour-price">${esc(t.price || '')}</strong></div>
          <span class="nt-tour-cta">${esc(ctaLabel(state))}</span>
        </div>
      </div>
    </a>
  `;
}

function sortTours(tours) {
  return [...tours].sort((a, b) => {
    const ai = STATE_ORDER.indexOf(a.derived_state);
    const bi = STATE_ORDER.indexOf(b.derived_state);
    const ax = ai === -1 ? STATE_ORDER.length : ai;
    const bx = bi === -1 ? STATE_ORDER.length : bi;
    return ax - bx;
  });
}

module.exports = async (req, res) => {
  let tours = [];
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/tours_with_counts?select=*&state=neq.completed`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Accept-Profile': 'nancy_tours',
        },
      }
    );
    if (r.ok) tours = await r.json();
  } catch (e) {
    console.error('[/tours] supabase fetch failed:', e);
  }

  tours = sortTours(tours);

  const cardsHtml = tours.length > 0
    ? tours.map(renderCard).join('\n')
    : '<p class="tp-empty">No hay tours abiertos por ahora. Volvé pronto.</p>';

  // Embed serialized tours so client-side filter chips (js/tours.js) skip the
  // network round-trip. Escape `<` so a tour title can't break out of the script.
  const dataScript = `<script type="application/json" id="tp-data">${JSON.stringify(tours).replace(/</g, '\\u003c')}</script>`;

  // Read template from disk. process.cwd() points at the project root on Vercel.
  const templatePath = path.join(process.cwd(), 'tours.html');
  let html;
  try {
    html = fs.readFileSync(templatePath, 'utf8');
  } catch (e) {
    console.error('[/tours] failed to read tours.html template:', e);
    res.status(500).send('Failed to read tours template');
    return;
  }

  // Replace the grid inner HTML with server-rendered cards + embedded JSON.
  html = html.replace(
    /(<div id="tp-grid"[^>]*>)[\s\S]*?(<\/div>\s*<\/section>)/,
    `$1\n${cardsHtml}\n${dataScript}\n$2`
  );

  // Drop aria-busy since the grid is now pre-populated.
  html = html.replace(/(<div id="tp-grid"[^>]*?)\s+aria-busy="true"/, '$1');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  res.status(200).send(html);
};
