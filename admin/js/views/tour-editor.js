// Nancy Tours admin — tour editor (identity + operation + description + details)
// =====================================================================
// Handles three URL patterns through the 'tours' view registration:
//   #tours/new           → new tour form
//   #tours/<slug>/edit   → edit existing tour
//   #tours/<slug>/leads  → redirect to #leads/<slug>
//
// Lists (itinerary, incl, excl, bring, faq, related) are mounted by the
// optional window.ADM_LISTS_MOUNT hook from Task 18. If it's not yet
// available the editor still saves the non-list fields.

(function () {
  'use strict';

  const STATE_LABEL = {
    'searching': '🟡 Buscando',
    'near_threshold': '🟠 Casi confirmado',
    'confirmed': '🟢 Confirmado',
    'postponed': '🔴 Pospuesto',
    'completed': '⚪ Completado',
  };

  // Empty-string sentinels for fields that are DATE/timestamp/numeric in DB —
  // strip them so PostgREST doesn't reject the row.
  const NULLABLE_IF_EMPTY = new Set([
    'tentativeDate', 'confirmedDate', // stored as TEXT in our schema but treat empty as null for cleanliness
  ]);

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  // Normalize bare-relative hero paths (e.g. "img/x.jpg") to root-absolute
  // so they resolve from "/" not from "/admin/...". URLs (http/https/data:)
  // and root-absolute paths pass through unchanged.
  function heroUrl(s) {
    const v = String(s || '');
    if (!v) return '';
    if (/^(https?:|data:|\/)/i.test(v)) return v;
    return '/' + v;
  }

  function slugify(s) {
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || `tour-${Date.now()}`;
  }

  function blankTour() {
    return {
      slug: '', title: '', tag: '', loc: '', elev: '', hero: '',
      state: 'searching', threshold: 6, maxCapacity: 12,
      duration: '', diff: '', minAge: '', price: '',
      tentativeDate: '', confirmedDate: '',
      lead: '', blurb: '',
      itinerary: [], incl: [], excl: [], bring: [], faq: [], related: [],
    };
  }

  function renderEditor(t, isNew) {
    return `
      <div class="adm-editor">
        <header class="adm-editor-head">
          <a href="#dashboard" class="adm-back">← Tours</a>
          <h1>${isNew ? 'Nuevo tour' : `Editando: ${escapeHtml(t.title)}`}</h1>
          <div class="adm-editor-actions">
            ${!isNew ? `<button type="button" class="adm-btn adm-btn--danger" data-act="delete">Eliminar</button>` : ''}
            <button type="button" class="adm-btn" data-act="save">Guardar</button>
          </div>
        </header>

        <details open class="adm-section">
          <summary><h2>Identidad</h2></summary>
          <div class="adm-grid-2">
            ${isNew ? `<div class="adm-field"><label>Slug (URL)</label><input data-f="slug" value="${escapeHtml(t.slug)}" placeholder="auto desde el título" /></div>` : `<div class="adm-field"><label>Slug</label><input data-f="slug" value="${escapeHtml(t.slug)}" readonly /></div>`}
            <div class="adm-field"><label>Título</label><input data-f="title" value="${escapeHtml(t.title)}" placeholder="Cerro Chirripó" /></div>
            <div class="adm-field"><label>Etiqueta</label><input data-f="tag" value="${escapeHtml(t.tag)}" placeholder="AVENTURA · 3 DÍAS" /></div>
            <div class="adm-field"><label>Ubicación</label><input data-f="loc" value="${escapeHtml(t.loc)}" placeholder="Pérez Zeledón · 3.820 m" /></div>
            <div class="adm-field"><label>Elevación / referencia</label><input data-f="elev" value="${escapeHtml(t.elev)}" placeholder="3.820 m" /></div>
          </div>
          <div class="adm-field">
            <label>Foto principal</label>
            <div class="adm-photo-drop" data-act="dropzone">
              <img data-f="heroPreview" src="${escapeHtml(heroUrl(t.hero))}" alt="" ${t.hero ? '' : 'hidden'} />
              <p>Arrastrá una imagen o clic para elegir.</p>
              <input type="file" accept="image/*" data-f="heroFile" hidden />
            </div>
            <input type="hidden" data-f="hero" value="${escapeHtml(t.hero)}" />
          </div>
        </details>

        <details class="adm-section">
          <summary><h2>Operación</h2></summary>
          <div class="adm-grid-2">
            <div class="adm-field"><label>Cupo mínimo (threshold)</label><input data-f="threshold" type="number" value="${t.threshold || 6}" min="1" /></div>
            <div class="adm-field"><label>Cupo máximo</label><input data-f="maxCapacity" type="number" value="${t.maxCapacity || 12}" min="1" /></div>
            <div class="adm-field"><label>Precio</label><input data-f="price" value="${escapeHtml(t.price)}" placeholder="$340" /></div>
            <div class="adm-field"><label>Fecha tentativa</label><input data-f="tentativeDate" value="${escapeHtml(t.tentativeDate)}" placeholder="13–15 jun · vie a dom" /></div>
          </div>
          ${!isNew ? `
          <div class="adm-state-controls">
            <div class="adm-field"><label>Estado actual</label><div class="adm-state-current">${STATE_LABEL[t.state] || t.state}</div></div>
            <div class="adm-state-btns">
              ${t.state !== 'confirmed' ? '<button type="button" class="adm-btn" data-act="confirm">✓ Confirmar tour</button>' : ''}
              ${t.state !== 'postponed' ? '<button type="button" class="adm-btn adm-btn--ghost" data-act="postpone">Posponer</button>' : ''}
              ${t.state !== 'completed' ? '<button type="button" class="adm-btn adm-btn--ghost" data-act="complete">Marcar completado</button>' : ''}
              ${t.state !== 'searching' ? '<button type="button" class="adm-btn adm-btn--ghost" data-act="reopen">Reabrir como buscando</button>' : ''}
            </div>
          </div>` : ''}
        </details>

        <details class="adm-section">
          <summary><h2>Descripción</h2></summary>
          <div class="adm-field"><label>Lead (1 frase corta)</label><textarea data-f="lead" rows="2" placeholder="El techo de Costa Rica…">${escapeHtml(t.lead)}</textarea></div>
          <div class="adm-field"><label>Blurb (descripción larga)</label><textarea data-f="blurb" rows="6">${escapeHtml(t.blurb)}</textarea></div>
        </details>

        <details class="adm-section">
          <summary><h2>Detalles</h2></summary>
          <div class="adm-grid-2">
            <div class="adm-field"><label>Duración</label><input data-f="duration" value="${escapeHtml(t.duration)}" placeholder="3 días · 2 noches" /></div>
            <div class="adm-field"><label>Nivel</label><input data-f="diff" value="${escapeHtml(t.diff)}" placeholder="Alta" /></div>
            <div class="adm-field"><label>Edad mínima</label><input data-f="minAge" value="${escapeHtml(t.minAge)}" placeholder="14 años" /></div>
          </div>
        </details>

        <div id="adm-editor-listsmount"></div>
      </div>
    `;
  }

  function collect(root) {
    const out = {};
    root.querySelectorAll('[data-f]').forEach((el) => {
      if (el.type === 'file' || el.dataset.f === 'heroPreview' || el.dataset.f === 'heroFile') return;
      let v;
      if (el.tagName === 'INPUT' && el.type === 'number') v = Number(el.value);
      else if ('value' in el) v = el.value;
      else return;
      if (typeof v === 'string') v = v.trim();
      // Empty string → null for nullable fields
      if (NULLABLE_IF_EMPTY.has(el.dataset.f) && v === '') v = null;
      out[el.dataset.f] = v;
    });
    return out;
  }

  function flash(msg, ok = true) {
    const f = document.createElement('div');
    f.className = 'adm-flash' + (ok ? '' : ' adm-flash--bad');
    f.textContent = msg;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1800);
  }

  function wireEditor(tour, isNew) {
    const root = document.querySelector('.adm-editor');
    if (!root) return;

    // Optional: list editors (Task 18)
    if (window.ADM_LISTS_MOUNT) {
      window.ADM_LISTS_MOUNT(document.getElementById('adm-editor-listsmount'), tour);
    }

    // Photo upload
    const dz = root.querySelector('[data-act="dropzone"]');
    const fileInput = root.querySelector('[data-f="heroFile"]');
    const heroHidden = root.querySelector('[data-f="hero"]');
    const preview = root.querySelector('[data-f="heroPreview"]');
    if (dz && fileInput) {
      dz.addEventListener('click', () => fileInput.click());
      dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('is-drop'); });
      dz.addEventListener('dragleave', () => dz.classList.remove('is-drop'));
      dz.addEventListener('drop', (e) => {
        e.preventDefault();
        dz.classList.remove('is-drop');
        if (e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0]);
      });
      fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) uploadFile(fileInput.files[0]);
      });
    }
    async function uploadFile(f) {
      const overlay = document.createElement('div');
      overlay.className = 'adm-upload-overlay';
      overlay.textContent = 'Subiendo foto…';
      document.body.appendChild(overlay);
      try {
        const slugForPath = (heroHidden.value && tour.slug) || tour.slug || 'new';
        const ext = (f.name.match(/\.[a-z0-9]+$/i) || ['.jpg'])[0];
        const filename = `${slugForPath}-${Date.now()}${ext}`;
        const res = await window.ADM_API.uploadImage(f, filename);
        heroHidden.value = res.url;
        preview.src = res.url;
        preview.hidden = false;
        flash('Foto subida ✓');
      } catch (e) {
        console.error('[ADM.upload]', e);
        flash('No pude subir la foto: ' + (e.message || e), false);
      } finally {
        overlay.remove();
      }
    }

    // Save
    root.querySelector('[data-act="save"]').addEventListener('click', async (ev) => {
      const btn = ev.currentTarget;
      btn.disabled = true;
      btn.textContent = 'Guardando…';
      try {
        const fields = collect(root);
        if (window.ADM_LISTS_COLLECT) Object.assign(fields, window.ADM_LISTS_COLLECT());
        if (isNew) {
          if (!fields.title || fields.title.trim().length < 2) {
            throw new Error('Falta el título.');
          }
          if (!fields.slug || !fields.slug.trim()) {
            fields.slug = slugify(fields.title);
          } else {
            fields.slug = slugify(fields.slug);
          }
          const res = await window.ADM_API.createTour(fields);
          flash('Tour creado ✓');
          setTimeout(() => { location.hash = `#tours/${encodeURIComponent(res.slug)}/edit`; }, 400);
        } else {
          // Strip slug from update payload — PK can't change
          const { slug: _drop, ...updates } = fields;
          await window.ADM_API.updateTour(tour.slug, updates);
          flash('Guardado ✓');
        }
      } catch (err) {
        console.error('[ADM.save]', err);
        flash('No se pudo guardar: ' + (err.message || err), false);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Guardar';
      }
    });

    // Delete
    const del = root.querySelector('[data-act="delete"]');
    if (del) del.addEventListener('click', async () => {
      if (!confirm(`¿Eliminar "${tour.title}"? Esto borra el tour y los interesados.`)) return;
      try {
        await window.ADM_API.deleteTour(tour.slug);
        flash('Tour eliminado');
        setTimeout(() => { location.hash = '#dashboard'; }, 400);
      } catch (err) {
        console.error('[ADM.delete]', err);
        flash('No se pudo eliminar: ' + (err.message || err), false);
      }
    });

    // State transitions
    async function transition(newState, promptDate, successMsg) {
      let date;
      if (promptDate) {
        date = prompt(promptDate, tour.tentativeDate || '');
        if (date == null) return;
      }
      try {
        await window.ADM_API.setState(tour.slug, newState, date || null);
        flash(successMsg);
        setTimeout(() => location.reload(), 600);
      } catch (err) {
        console.error('[ADM.setState]', err);
        flash('No se pudo cambiar el estado: ' + (err.message || err), false);
      }
    }
    root.querySelector('[data-act="confirm"]')?.addEventListener('click', () =>
      transition('confirmed', 'Fecha definitiva del tour:', 'Tour confirmado ✓')
    );
    root.querySelector('[data-act="postpone"]')?.addEventListener('click', () =>
      transition('postponed', 'Nueva fecha tentativa:', 'Tour pospuesto')
    );
    root.querySelector('[data-act="complete"]')?.addEventListener('click', async () => {
      if (!confirm('¿Marcar este tour como completado? Desaparecerá del catálogo público.')) return;
      transition('completed', null, 'Tour completado');
    });
    root.querySelector('[data-act="reopen"]')?.addEventListener('click', () =>
      transition('searching', null, 'Tour reabierto')
    );
  }

  window.ADM_REGISTER_VIEW('tours', async (app, param) => {
    if (!param) { location.hash = '#dashboard'; return; }

    // Redirect "/leads" suffix to the leads view
    if (param.endsWith('/leads')) {
      const slug = param.replace(/\/leads$/, '');
      location.hash = `#leads/${slug}`;
      return;
    }

    const isNew = param === 'new';
    const slug = isNew ? null : param.replace(/\/edit$/, '');
    app.innerHTML = `<p class="adm-loading">${isNew ? 'Nuevo tour…' : 'Cargando tour…'}</p>`;

    const tour = isNew ? blankTour() : (await window.ADM_API.getTour(slug));
    if (!isNew && !tour) {
      app.innerHTML = `<p class="adm-loading">Tour no encontrado. <a href="#dashboard">Volver →</a></p>`;
      return;
    }
    app.innerHTML = renderEditor(tour, isNew);
    wireEditor(tour, isNew);
  });
})();
