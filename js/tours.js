// Nancy Tours — public catalog renderer
// =====================================================================
// Fetches tours from Supabase via window.NT.api.getTours() and renders
// state-aware cards into #tp-grid. Filter chips toggle visible subset.

(function () {
  'use strict';

  // Display order: urgency first
  const STATE_ORDER = ['near_threshold', 'confirmed', 'searching', 'postponed'];

  const STATE_LABELS = {
    'searching': 'BUSCANDO INTERESADOS',
    'near_threshold': 'CASI SE CONFIRMA',
    'confirmed': '✓ CONFIRMADO',
    'postponed': 'POSPUESTO · NUEVA FECHA',
  };

  // CSS class suffix mapping. Keep snake-case state values aligned with kebab CSS classes.
  const STATE_CSS_CLASS = {
    'searching': 'nt-state--searching',
    'near_threshold': 'nt-state--near-threshold',
    'confirmed': 'nt-state--confirmed',
    'postponed': 'nt-state--postponed',
  };

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function ctaLabel(state) {
    if (state === 'confirmed') return 'Reservar →';
    if (state === 'postponed') return 'Me sumo en esta fecha →';
    if (state === 'near_threshold') return 'Sumarme →';
    return 'Me interesa →';
  }

  function progressPercent(tour) {
    if (tour.derivedState === 'confirmed') return 100;
    const n = tour.interested || 0;
    const t = tour.threshold || 1;
    return Math.min(100, Math.round((n / t) * 100));
  }

  function progressText(tour) {
    const state = tour.derivedState;
    const n = tour.interested || 0;
    const t = tour.threshold || 0;
    if (state === 'confirmed') {
      const max = tour.maxCapacity || t;
      const remaining = Math.max(0, max - n);
      return `<span><strong>${n}</strong> personas en ruta</span>
              <span class="nt-progress-accent">${remaining > 0 ? `Quedan ${remaining} cupos` : 'Tour lleno'}</span>`;
    }
    const remaining = Math.max(0, t - n);
    const fire = state === 'near_threshold' && remaining > 0 ? ' 🔥' : '';
    return `<span><strong>${n}</strong> interesados</span>
            <span class="nt-progress-accent">Faltan ${remaining} más${fire}</span>`;
  }

  function dateBlock(tour) {
    if (tour.derivedState === 'confirmed') {
      const date = tour.confirmedDate || tour.tentativeDate || '';
      return `<div class="nt-date-confirmed"><span class="nt-date-num">${escapeHtml(date)}</span></div>`;
    }
    const label = tour.derivedState === 'postponed' ? 'Nueva fecha tentativa:' : 'Fecha tentativa:';
    const date = tour.tentativeDate || '';
    return `<div class="nt-date-tentative"><span>📅 ${label}</span> <span class="nt-date-num">${escapeHtml(date)}</span></div>`;
  }

  function renderCard(tour) {
    const state = tour.derivedState;
    const remaining = Math.max(0, (tour.threshold || 0) - (tour.interested || 0));
    const badgeText = state === 'near_threshold'
      ? `${STATE_LABELS[state]} · FALTAN ${remaining}`
      : STATE_LABELS[state];

    const hero = tour.hero || '';
    const href = `/tours/${encodeURIComponent(tour.slug)}`;
    const cssClass = STATE_CSS_CLASS[state] || '';
    const n = tour.interested || 0;
    const threshold = tour.threshold || 1;
    const ariaLabel = `${escapeHtml(tour.title)} — ${escapeHtml(STATE_LABELS[state] || '')}, ${escapeHtml(tour.tentativeDate || '')}, desde ${escapeHtml(tour.price || '')}`;

    return `
      <a href="${href}" class="nt-tour-card ${cssClass}" aria-label="${ariaLabel}">
        <div class="nt-tour-photo" style="background-image: url('${escapeHtml(hero)}')">
          <span class="nt-state-badge"><span class="nt-state-dot"></span>${escapeHtml(badgeText)}</span>
        </div>
        <div class="nt-tour-body">
          <div>
            <h2 class="nt-tour-title">${escapeHtml(tour.title)}</h2>
            <div class="nt-tour-loc">${escapeHtml(tour.loc || '')}</div>
          </div>
          ${dateBlock(tour)}
          <div class="nt-progress">
            <div class="nt-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${threshold}" aria-valuenow="${n}" aria-label="${n} de ${threshold} interesados"><div class="nt-progress-fill" style="width: ${progressPercent(tour)}%"></div></div>
            <div class="nt-progress-text">${progressText(tour)}</div>
          </div>
          <div class="nt-tour-foot">
            <div><span class="nt-meta-k">DESDE</span><strong class="nt-tour-price">${escapeHtml(tour.price || '')}</strong></div>
            <span class="nt-tour-cta">${escapeHtml(ctaLabel(state))}</span>
          </div>
        </div>
      </a>
    `;
  }

  function sortTours(tours) {
    return [...tours].sort((a, b) => {
      const ai = STATE_ORDER.indexOf(a.derivedState);
      const bi = STATE_ORDER.indexOf(b.derivedState);
      // Unknown states sink to the bottom
      const ax = ai === -1 ? STATE_ORDER.length : ai;
      const bx = bi === -1 ? STATE_ORDER.length : bi;
      return ax - bx;
    });
  }

  function render(tours, filter) {
    const grid = document.getElementById('tp-grid');
    if (!grid) return;
    const filtered = filter === 'all' ? tours : tours.filter((t) => t.derivedState === filter);
    const sorted = sortTours(filtered);
    if (sorted.length === 0) {
      grid.innerHTML = `<p class="tp-empty">No hay tours en este estado por ahora.</p>`;
    } else {
      grid.innerHTML = sorted.map(renderCard).join('');
    }
    grid.setAttribute('aria-busy', 'false');
  }

  function wireFilters(tours) {
    document.querySelectorAll('.tp-state-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tp-state-filter').forEach((b) => {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        render(tours, btn.dataset.filter);
      });
    });
  }

  async function main() {
    try {
      const tours = await window.NT.api.getTours();
      render(tours, 'all');
      wireFilters(tours);
    } catch (e) {
      const grid = document.getElementById('tp-grid');
      if (grid) {
        grid.innerHTML = `<p class="tp-error">No pudimos cargar los tours. Refrescá la página o probá en unos minutos.</p>`;
        grid.setAttribute('aria-busy', 'false');
      }
      // Surface the error to console so devtools shows it
      console.error('[NT.tours]', e);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();
