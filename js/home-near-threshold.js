// Nancy Tours — home page "near-threshold" tours section
// =====================================================================
// Renders up to 3 tours in near_threshold state into the home page.
// Section stays hidden entirely if zero such tours exist.

(function () {
  'use strict';

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function renderCard(t) {
    const n = t.interested || 0;
    const threshold = t.threshold || 1;
    const remaining = Math.max(0, threshold - n);
    const pct = Math.min(100, Math.round((n / threshold) * 100));
    return `
      <a href="/tours/${encodeURIComponent(t.slug)}" class="nt-tour-card nt-state--near-threshold">
        <div class="nt-tour-photo" style="background-image:url('${escapeHtml(t.hero || '')}')">
          <span class="nt-state-badge"><span class="nt-state-dot"></span>FALTAN ${remaining}</span>
        </div>
        <div class="nt-tour-body">
          <h2 class="nt-tour-title">${escapeHtml(t.title)}</h2>
          <div class="nt-tour-loc">${escapeHtml(t.loc || '')}</div>
          <div class="nt-progress">
            <div class="nt-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${threshold}" aria-valuenow="${n}" aria-label="${n} de ${threshold} interesados"><div class="nt-progress-fill" style="width:${pct}%"></div></div>
            <div class="nt-progress-text"><span><strong>${n}</strong>/${threshold} interesados</span><span class="nt-progress-accent">🔥</span></div>
          </div>
          <div class="nt-tour-foot"><strong class="nt-tour-price">${escapeHtml(t.price || '')}</strong><span class="nt-tour-cta">Sumarme →</span></div>
        </div>
      </a>
    `;
  }

  async function main() {
    const section = document.getElementById('nt-soonish');
    const grid = document.getElementById('nt-soonish-grid');
    if (!section || !grid) return;
    if (!window.NT || !window.NT.api) return;
    try {
      const tours = await window.NT.api.getTours();
      const near = tours.filter((t) => t.derivedState === 'near_threshold').slice(0, 3);
      if (!near.length) return; // section stays hidden
      grid.innerHTML = near.map(renderCard).join('');
      section.hidden = false;
    } catch (e) {
      console.error('[NT.home-near-threshold]', e);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();
