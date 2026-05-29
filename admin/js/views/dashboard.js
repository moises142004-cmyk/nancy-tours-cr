// Nancy Tours admin — dashboard view
// =====================================================================
// Fetches all tours via window.ADM_API.listTours() (the tours_with_counts
// view, so derivedState + interested are populated) and renders header
// stats + a grid of tour cards.

(function () {
  'use strict';

  const STATE_LABEL = {
    'searching': '🟡 Buscando',
    'near_threshold': '🟠 Casi confirmado',
    'confirmed': '🟢 Confirmado',
    'postponed': '🔴 Pospuesto',
    'completed': '⚪ Completado',
  };

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function pct(t) {
    if (t.derivedState === 'confirmed') return 100;
    const n = t.interested || 0;
    const threshold = t.threshold || 1;
    return Math.min(100, Math.round((n / threshold) * 100));
  }

  function heroUrl(h) {
    if (!h) return '';
    // Normalize bare relative paths (e.g. "img/foo.jpg") so they resolve from
    // the site root, not from /admin/. Leave absolute http(s):// and /-rooted
    // paths alone.
    if (/^(https?:)?\/\//.test(h) || h.startsWith('/')) return h;
    return '/' + h.replace(/^\.\//, '');
  }

  function renderTourCard(t) {
    const state = t.derivedState || t.state || 'searching';
    const ready = state === 'near_threshold';
    const heroSafe = heroUrl(t.hero).replace(/'/g, "\\'");
    return `
      <article class="adm-card adm-state--${state}">
        <a href="#tours/${encodeURIComponent(t.slug)}/edit" class="adm-card-link">
          <div class="adm-card-photo" style="background-image:url('${heroSafe}')">
            <span class="adm-state-pill">${STATE_LABEL[state] || state}</span>
            ${ready ? '<span class="adm-card-ready">⚡ LISTO PARA CONFIRMAR</span>' : ''}
          </div>
          <div class="adm-card-body">
            <h3>${escapeHtml(t.title)}</h3>
            <div class="adm-card-meta">${escapeHtml(t.tentativeDate || '—')}</div>
            <div class="adm-progress">
              <div class="adm-progress-bar"><div style="width:${pct(t)}%"></div></div>
              <div class="adm-progress-text">${t.interested || 0} de ${t.threshold || '?'} interesados</div>
            </div>
          </div>
        </a>
        <a href="#tours/${encodeURIComponent(t.slug)}/leads" class="adm-card-leads">👥 ${t.interested || 0} interesados →</a>
      </article>
    `;
  }

  window.ADM_REGISTER_VIEW('dashboard', async (app) => {
    app.innerHTML = `<p class="adm-loading">Cargando tus tours…</p>`;
    const tours = await window.ADM_API.listTours();

    const totalActive = tours.length;
    const totalNear = tours.filter((t) => t.derivedState === 'near_threshold').length;
    const totalInterested = tours.reduce((s, t) => s + (t.interested || 0), 0);

    app.innerHTML = `
      <header class="adm-header">
        <div>
          <h1>Hola Nancy 👋</h1>
          <p class="adm-muted">${totalActive} tours activos · ${totalInterested} personas interesadas hoy</p>
        </div>
        <div class="adm-header-actions">
          <a href="#settings" class="adm-btn adm-btn--ghost">⚙ Ajustes</a>
          <a href="#tours/new" class="adm-btn">+ Nuevo tour</a>
          <button type="button" class="adm-btn adm-btn--ghost" id="adm-logout">Salir</button>
        </div>
      </header>
      <section class="adm-stats">
        <div class="adm-stat"><div class="adm-stat-num">${totalActive}</div><div class="adm-stat-label">Tours activos</div></div>
        <div class="adm-stat"><div class="adm-stat-num">${totalNear}</div><div class="adm-stat-label">🟠 Listos para confirmar</div></div>
        <div class="adm-stat"><div class="adm-stat-num">${totalInterested}</div><div class="adm-stat-label">Personas interesadas</div></div>
      </section>
      <section class="adm-tour-grid">
        ${tours.map(renderTourCard).join('')}
      </section>
    `;

    document.getElementById('adm-logout').addEventListener('click', async () => {
      await window.ADM_API.logout();
      location.hash = '#login';
    });
  });
})();
