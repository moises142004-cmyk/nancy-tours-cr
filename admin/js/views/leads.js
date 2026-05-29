// Nancy Tours admin — leads view
// =====================================================================
// Lists everyone who expressed interest in a specific tour. Lets Nancy
// tick "contacted", open a WhatsApp chat with a pre-filled message,
// and copy all numbers to the clipboard for blasting.
//
// Route: #leads/<slug>

(function () {
  'use strict';

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function waNumber(raw) {
    // Strip non-digits, keep last 8 (CR mobile), prefix 506.
    const digits = String(raw || '').replace(/\D/g, '');
    return '506' + digits.slice(-8);
  }

  function waMessage(tour, lead) {
    if (tour?.derivedState === 'confirmed') {
      const date = tour.confirmedDate || tour.tentativeDate || '';
      return `Hola ${lead.name}, soy Nancy. El tour de ${tour.title} ya está confirmado para el ${date}. ¿Confirmás tu cupo?`;
    }
    return `Hola ${lead.name}, soy Nancy. Te escribo por tu interés en el tour de ${tour?.title || ''}.`;
  }

  function formatDate(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' });
    } catch {
      return '—';
    }
  }

  function flash(msg, ok = true) {
    const f = document.createElement('div');
    f.className = 'adm-flash' + (ok ? '' : ' adm-flash--bad');
    f.textContent = msg;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1800);
  }

  window.ADM_REGISTER_VIEW('leads', async (app, param) => {
    if (!param) { location.hash = '#dashboard'; return; }
    const slug = param;
    app.innerHTML = `<p class="adm-loading">Cargando interesados…</p>`;

    const [tour, leads] = await Promise.all([
      window.ADM_API.getTour(slug),
      window.ADM_API.listLeads(slug),
    ]);

    if (!tour) {
      app.innerHTML = `<p class="adm-loading">Tour no encontrado. <a href="#dashboard">Volver →</a></p>`;
      return;
    }

    // Newest first
    leads.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const totalPeople = leads.reduce((s, l) => s + Number(l.numPeople || 1), 0);

    app.innerHTML = `
      <div class="adm-leads">
        <header class="adm-editor-head">
          <a href="#tours/${encodeURIComponent(slug)}/edit" class="adm-back">← Editar tour</a>
          <h1>${totalPeople} ${totalPeople === 1 ? 'persona interesada' : 'personas interesadas'} en ${escapeHtml(tour.title)}</h1>
          <div class="adm-editor-actions">
            <a href="#dashboard" class="adm-btn adm-btn--ghost">← Tablero</a>
            <button type="button" class="adm-btn adm-btn--ghost" data-act="copy" ${leads.length === 0 ? 'disabled' : ''}>Copiar todos los WhatsApp</button>
          </div>
        </header>
        ${leads.length === 0 ? `
          <p class="adm-loading">Todavía nadie. En cuanto alguien muestre interés, va a aparecer acá.</p>
        ` : `
          <table class="adm-leads-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>WhatsApp</th>
                <th>Personas</th>
                <th>¿Ya hablé?</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              ${leads.map((l) => `
                <tr>
                  <td>${formatDate(l.createdAt)}</td>
                  <td>${escapeHtml(l.name)}</td>
                  <td><a href="https://wa.me/${waNumber(l.whatsapp)}?text=${encodeURIComponent(waMessage(tour, l))}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.whatsapp || '')}</a></td>
                  <td>${l.numPeople ?? 1}</td>
                  <td><input type="checkbox" data-lead-id="${escapeHtml(l.id)}" ${l.contacted ? 'checked' : ''} /></td>
                  <td>${escapeHtml(l.notes || '')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    `;

    app.querySelectorAll('input[type="checkbox"][data-lead-id]').forEach((cb) => {
      cb.addEventListener('change', async (e) => {
        const id = e.target.dataset.leadId;
        try {
          await window.ADM_API.markContacted(id, e.target.checked);
          flash(e.target.checked ? 'Marcado como contactado ✓' : 'Desmarcado');
        } catch (err) {
          console.error('[ADM.leads]', err);
          flash('No pude marcar: ' + (err.message || err), false);
          e.target.checked = !e.target.checked;
        }
      });
    });

    const copyBtn = app.querySelector('[data-act="copy"]');
    if (copyBtn && leads.length > 0) {
      copyBtn.addEventListener('click', async () => {
        const list = leads.map((l) => `${l.name}: +${waNumber(l.whatsapp)}`).join('\n');
        try {
          await navigator.clipboard.writeText(list);
          flash('WhatsApp copiados ✓');
        } catch (err) {
          console.error('[ADM.copy]', err);
          flash('No pude copiar al portapapeles', false);
        }
      });
    }
  });
})();
