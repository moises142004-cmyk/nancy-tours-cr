// Nancy Tours admin — dynamic list editors
// =====================================================================
// Mounts itinerary, incl/excl/bring, FAQ and related editors into the
// tour editor. Exposes:
//   window.ADM_LISTS_MOUNT(rootEl, tour)  – render against a fresh tour
//   window.ADM_LISTS_COLLECT()            – return {itinerary, incl, excl, bring, faq, related}
//
// The collected payload is merged into the save fields by tour-editor.

(function () {
  'use strict';

  // Local working copy. We never mutate the tour object passed in.
  const state = { tour: null };

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function mount(rootEl, tour) {
    if (!rootEl) return;
    state.tour = {
      itinerary: Array.isArray(tour?.itinerary) ? JSON.parse(JSON.stringify(tour.itinerary)) : [],
      incl: Array.isArray(tour?.incl) ? [...tour.incl] : [],
      excl: Array.isArray(tour?.excl) ? [...tour.excl] : [],
      bring: Array.isArray(tour?.bring) ? [...tour.bring] : [],
      faq: Array.isArray(tour?.faq) ? JSON.parse(JSON.stringify(tour.faq)) : [],
      related: Array.isArray(tour?.related) ? [...tour.related] : [],
    };

    rootEl.innerHTML = `
      <details open class="adm-section">
        <summary><h2>Itinerario</h2></summary>
        <div id="adm-iti"></div>
        <button type="button" class="adm-btn adm-btn--ghost" data-add-day>+ Agregar día</button>
      </details>
      <details class="adm-section">
        <summary><h2>Qué incluye</h2></summary>
        <div id="adm-incl"></div>
        <button type="button" class="adm-btn adm-btn--ghost" data-add-incl>+ Agregar ítem</button>
      </details>
      <details class="adm-section">
        <summary><h2>Qué no incluye</h2></summary>
        <div id="adm-excl"></div>
        <button type="button" class="adm-btn adm-btn--ghost" data-add-excl>+ Agregar ítem</button>
      </details>
      <details class="adm-section">
        <summary><h2>Qué llevar</h2></summary>
        <div id="adm-bring"></div>
        <button type="button" class="adm-btn adm-btn--ghost" data-add-bring>+ Agregar ítem</button>
      </details>
      <details class="adm-section">
        <summary><h2>Preguntas frecuentes</h2></summary>
        <div id="adm-faq"></div>
        <button type="button" class="adm-btn adm-btn--ghost" data-add-faq>+ Agregar pregunta</button>
      </details>
      <details class="adm-section">
        <summary><h2>Tours relacionados</h2></summary>
        <div class="adm-field">
          <label>Slugs separados por coma</label>
          <input id="adm-related" value="${esc(state.tour.related.join(', '))}" placeholder="chirripo, bajos-toro" />
        </div>
      </details>
    `;

    renderItinerary();
    renderSimpleList('adm-incl', 'incl');
    renderSimpleList('adm-excl', 'excl');
    renderSimpleList('adm-bring', 'bring');
    renderFaq();

    rootEl.querySelector('[data-add-day]').addEventListener('click', () => {
      state.tour.itinerary.push({ d: 'NUEVO DÍA', items: [''] });
      renderItinerary();
    });
    rootEl.querySelector('[data-add-incl]').addEventListener('click', () => {
      state.tour.incl.push('');
      renderSimpleList('adm-incl', 'incl');
    });
    rootEl.querySelector('[data-add-excl]').addEventListener('click', () => {
      state.tour.excl.push('');
      renderSimpleList('adm-excl', 'excl');
    });
    rootEl.querySelector('[data-add-bring]').addEventListener('click', () => {
      state.tour.bring.push('');
      renderSimpleList('adm-bring', 'bring');
    });
    rootEl.querySelector('[data-add-faq]').addEventListener('click', () => {
      state.tour.faq.push(['', '']);
      renderFaq();
    });
  }

  function renderItinerary() {
    const el = document.getElementById('adm-iti');
    if (!el) return;
    el.innerHTML = state.tour.itinerary.map((d, i) => `
      <div class="adm-list-row">
        <div class="adm-field">
          <label>Etiqueta del día</label>
          <input data-iti-d="${i}" value="${esc(d.d)}" />
        </div>
        <div class="adm-field">
          <label>Pasos (uno por línea)</label>
          <textarea data-iti-items="${i}" rows="${Math.max(3, (d.items || []).length)}">${(d.items || []).map(esc).join('\n')}</textarea>
        </div>
        <button type="button" class="adm-btn adm-btn--ghost adm-row-del" data-iti-del="${i}">Eliminar día</button>
      </div>
    `).join('');
    el.querySelectorAll('[data-iti-d]').forEach((inp) =>
      inp.addEventListener('input', (e) => {
        state.tour.itinerary[Number(e.target.dataset.itiD)].d = e.target.value;
      })
    );
    el.querySelectorAll('[data-iti-items]').forEach((ta) =>
      ta.addEventListener('input', (e) => {
        state.tour.itinerary[Number(e.target.dataset.itiItems)].items =
          e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
      })
    );
    el.querySelectorAll('[data-iti-del]').forEach((b) =>
      b.addEventListener('click', (e) => {
        state.tour.itinerary.splice(Number(e.target.dataset.itiDel), 1);
        renderItinerary();
      })
    );
  }

  function renderSimpleList(elId, field) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = state.tour[field].map((v, i) => `
      <div class="adm-list-row adm-list-row--inline">
        <input data-l="${field}" data-i="${i}" value="${esc(v)}" />
        <button type="button" class="adm-btn adm-btn--ghost adm-row-del" data-l-del="${field}|${i}">×</button>
      </div>
    `).join('');
    el.querySelectorAll('input[data-l]').forEach((inp) =>
      inp.addEventListener('input', (e) => {
        state.tour[e.target.dataset.l][Number(e.target.dataset.i)] = e.target.value;
      })
    );
    el.querySelectorAll('[data-l-del]').forEach((b) =>
      b.addEventListener('click', (e) => {
        const [f, i] = e.target.dataset.lDel.split('|');
        state.tour[f].splice(Number(i), 1);
        renderSimpleList(elId, f);
      })
    );
  }

  function renderFaq() {
    const el = document.getElementById('adm-faq');
    if (!el) return;
    el.innerHTML = state.tour.faq.map(([q, a], i) => `
      <div class="adm-list-row">
        <div class="adm-field">
          <label>Pregunta</label>
          <input data-faq-q="${i}" value="${esc(q)}" />
        </div>
        <div class="adm-field">
          <label>Respuesta</label>
          <textarea data-faq-a="${i}" rows="3">${esc(a)}</textarea>
        </div>
        <button type="button" class="adm-btn adm-btn--ghost adm-row-del" data-faq-del="${i}">Eliminar</button>
      </div>
    `).join('');
    el.querySelectorAll('[data-faq-q]').forEach((inp) =>
      inp.addEventListener('input', (e) => {
        state.tour.faq[Number(e.target.dataset.faqQ)][0] = e.target.value;
      })
    );
    el.querySelectorAll('[data-faq-a]').forEach((ta) =>
      ta.addEventListener('input', (e) => {
        state.tour.faq[Number(e.target.dataset.faqA)][1] = e.target.value;
      })
    );
    el.querySelectorAll('[data-faq-del]').forEach((b) =>
      b.addEventListener('click', (e) => {
        state.tour.faq.splice(Number(e.target.dataset.faqDel), 1);
        renderFaq();
      })
    );
  }

  function collect() {
    // Filter out fully-empty rows so we don't save garbage
    const itinerary = state.tour.itinerary
      .filter((d) => (d.d && d.d.trim()) || (Array.isArray(d.items) && d.items.length > 0));
    const incl = state.tour.incl.map((s) => s.trim()).filter(Boolean);
    const excl = state.tour.excl.map((s) => s.trim()).filter(Boolean);
    const bring = state.tour.bring.map((s) => s.trim()).filter(Boolean);
    const faq = state.tour.faq.filter(([q, a]) => (q && q.trim()) || (a && a.trim()));
    const relatedRaw = document.getElementById('adm-related')?.value || '';
    const related = relatedRaw.split(',').map((s) => s.trim()).filter(Boolean);
    return { itinerary, incl, excl, bring, faq, related };
  }

  window.ADM_LISTS_MOUNT = mount;
  window.ADM_LISTS_COLLECT = collect;
})();
