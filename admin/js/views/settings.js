// Nancy Tours admin — settings view
// =====================================================================
// Three sections:
//  1. Password rotation (Supabase Auth updateUser).
//  2. Notification email + daily summary toggle (config table).
//  3. Logout (Supabase Auth signOut).

(function () {
  'use strict';

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function flash(msg, ok = true) {
    const f = document.createElement('div');
    f.className = 'adm-flash' + (ok ? '' : ' adm-flash--bad');
    f.textContent = msg;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1800);
  }

  function configMap(rows) {
    const m = {};
    rows.forEach((r) => { m[r.key] = r.value; });
    return m;
  }

  // The config table stores values as TEXT (or jsonb if you used the
  // jsonb type — check by reading). The seeded rows are TEXT — so treat
  // booleans as the strings "true" / "false".
  function isTruthy(v) {
    if (v === true) return true;
    if (typeof v === 'string') return v.toLowerCase() === 'true';
    return false;
  }

  window.ADM_REGISTER_VIEW('settings', async (app) => {
    app.innerHTML = `<p class="adm-loading">Cargando ajustes…</p>`;
    const rows = await window.ADM_API.listConfig();
    const cfg = configMap(rows);

    app.innerHTML = `
      <div class="adm-editor" style="max-width: 640px;">
        <header class="adm-editor-head">
          <a href="#dashboard" class="adm-back">← Tablero</a>
          <h1>Ajustes</h1>
        </header>

        <details open class="adm-section">
          <summary><h2>Cambiar password</h2></summary>
          <div class="adm-field">
            <label>Password nuevo (mínimo 8 caracteres)</label>
            <input id="set-pw" type="password" autocomplete="new-password" />
          </div>
          <div class="adm-field">
            <label>Repetir password</label>
            <input id="set-pw-confirm" type="password" autocomplete="new-password" />
          </div>
          <button type="button" class="adm-btn" id="set-pw-save">Actualizar password</button>
        </details>

        <details open class="adm-section">
          <summary><h2>Notificación diaria por email</h2></summary>
          <p style="color: var(--adm-muted); margin: 0 0 16px;">Cada mañana te llega un resumen con tours listos para confirmar y personas sin contactar.</p>
          <div class="adm-field">
            <label>Email destino</label>
            <input id="set-email" type="email" placeholder="hola@nancytourscr.com" value="${escapeHtml(cfg.notification_email || '')}" />
          </div>
          <label style="display:flex; align-items:center; gap:10px; font-size:14px; margin-bottom:12px;">
            <input type="checkbox" id="set-daily" ${isTruthy(cfg.daily_summary_enabled) ? 'checked' : ''} />
            <span>Enviar resumen diario</span>
          </label>
          <button type="button" class="adm-btn" id="set-email-save">Guardar notificación</button>
        </details>

        <details class="adm-section">
          <summary><h2>Sesión</h2></summary>
          <button type="button" class="adm-btn adm-btn--ghost" id="set-logout">Cerrar sesión</button>
        </details>
      </div>
    `;

    document.getElementById('set-pw-save').addEventListener('click', async (e) => {
      const pw = document.getElementById('set-pw').value;
      const confirm = document.getElementById('set-pw-confirm').value;
      if (!pw || pw.length < 8) { flash('Mínimo 8 caracteres.', false); return; }
      if (pw !== confirm) { flash('Los passwords no coinciden.', false); return; }
      const btn = e.currentTarget;
      btn.disabled = true;
      btn.textContent = 'Actualizando…';
      try {
        const { error } = await window.ADM_API.supabase.auth.updateUser({ password: pw });
        if (error) throw error;
        document.getElementById('set-pw').value = '';
        document.getElementById('set-pw-confirm').value = '';
        flash('Password actualizado ✓');
      } catch (err) {
        console.error('[ADM.settings.pw]', err);
        flash('No pude actualizar el password: ' + (err.message || err), false);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Actualizar password';
      }
    });

    document.getElementById('set-email-save').addEventListener('click', async (e) => {
      const email = document.getElementById('set-email').value.trim();
      const daily = document.getElementById('set-daily').checked;
      const btn = e.currentTarget;
      btn.disabled = true;
      btn.textContent = 'Guardando…';
      try {
        await window.ADM_API.updateConfig('notification_email', email);
        await window.ADM_API.updateConfig('daily_summary_enabled', String(daily));
        flash('Guardado ✓');
      } catch (err) {
        console.error('[ADM.settings.email]', err);
        flash('No pude guardar: ' + (err.message || err), false);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Guardar notificación';
      }
    });

    document.getElementById('set-logout').addEventListener('click', async () => {
      await window.ADM_API.logout();
      location.hash = '#login';
    });
  });
})();
