// Nancy Tours admin — hash router + session bootstrap
// =====================================================================
// Hash routes:
//   #login | #dashboard | #tours/new | #tours/<slug>/edit
//   | #tours/<slug>/leads | #leads | #settings
// Views self-register via window.ADM_REGISTER_VIEW(name, render).

(function () {
  'use strict';

  const VIEWS = {};
  window.ADM_REGISTER_VIEW = (name, render) => { VIEWS[name] = render; };

  async function route() {
    const app = document.getElementById('adm-app');
    const session = await window.ADM_API.getSession();

    // Anything but #login requires a session
    if (!session && location.hash !== '#login') {
      location.hash = '#login';
      return;
    }
    // If we have a session and land on #login, send them home
    if (session && (location.hash === '' || location.hash === '#login')) {
      location.hash = '#dashboard';
      return;
    }

    const hash = location.hash || '#dashboard';
    const m = hash.match(/^#([^/]+)(?:\/(.+))?$/);
    const view = m ? m[1] : 'dashboard';
    const param = m ? m[2] : '';
    const renderer = VIEWS[view];
    if (!renderer) {
      app.innerHTML = `<p class="adm-loading">Vista no encontrada: ${view}. <a href="#dashboard">Volver →</a></p>`;
      return;
    }
    try {
      app.setAttribute('aria-busy', 'true');
      await renderer(app, param);
      app.setAttribute('aria-busy', 'false');
    } catch (e) {
      console.error('[ADM]', e);
      // Treat auth failure as logged-out
      if (e && (e.status === 401 || e.code === 'PGRST301' || /jwt|auth|unauthor/i.test(e.message || ''))) {
        await window.ADM_API.logout();
        location.hash = '#login';
        return;
      }
      app.innerHTML = `<p class="adm-loading">Error: ${escapeHtml(e?.message || String(e))}. <a href="#dashboard">Reintentar →</a></p>`;
    }
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', route);
})();
