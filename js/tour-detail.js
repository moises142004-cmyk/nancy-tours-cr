// Nancy Tours — tour detail page
// =====================================================================
// Reads ?id= from URL, fetches the tour via window.NT.api.getTour,
// populates [data-td] slots, and morphs the booking card by state.

(function () {
  'use strict';

  const STATE_LABELS = {
    'searching': 'BUSCANDO INTERESADOS',
    'near_threshold': 'CASI SE CONFIRMA',
    'confirmed': '✓ CONFIRMADO',
    'postponed': 'POSPUESTO · NUEVA FECHA',
    'completed': '🏁 TOUR COMPLETADO',
  };

  const STATE_CSS_CLASS = {
    'searching': 'nt-state--searching',
    'near_threshold': 'nt-state--near-threshold',
    'confirmed': 'nt-state--confirmed',
    'postponed': 'nt-state--postponed',
    'completed': 'nt-state--completed',
  };

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }
  function escapeCssUrl(s) {
    return String(s ?? '').replace(/[\\"'() <>]/g, (c) => '\\' + c);
  }

  function getTourId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'chirripo';
  }

  function setText(key, value) {
    document.querySelectorAll(`[data-td="${key}"]`).forEach((el) => { el.textContent = value || ''; });
  }

  function waLink(msg) {
    return `https://wa.me/50688787370?text=${encodeURIComponent(msg)}`;
  }

  function actionsHtml(tour) {
    const state = tour.derivedState;
    if (state === 'confirmed') {
      const msg = `¡Hola Nancy! Quiero reservar el tour de ${tour.title} (${tour.confirmedDate || tour.tentativeDate || ''}).`;
      return `
        <a href="${waLink(msg)}" target="_blank" rel="noopener noreferrer" class="nt-btn nt-btn-wa td-book-btn">
          <span class="nt-wa-icon">w</span>Reservar por WhatsApp
        </a>
        <a href="contacto.html" class="nt-btn nt-btn-ghost td-book-btn">Formulario de reserva →</a>
      `;
    }
    if (state === 'completed') {
      return `<a href="tours.html" class="nt-btn nt-btn-ghost td-book-btn">Ver tours abiertos →</a>`;
    }
    const cta = state === 'near_threshold' ? 'Sumarme al tour'
              : state === 'postponed' ? 'Me sumo en esta fecha'
              : 'Me interesa';
    return `<button type="button" class="nt-btn nt-btn-primary td-book-btn" data-open-interest>${cta} →</button>`;
  }

  function renderBookingCard(tour) {
    const aside = document.querySelector('.td-book');
    if (!aside) return;
    const state = tour.derivedState;
    aside.dataset.tdState = state;
    Object.values(STATE_CSS_CLASS).forEach((c) => aside.classList.remove(c));
    if (STATE_CSS_CLASS[state]) aside.classList.add(STATE_CSS_CLASS[state]);

    const remaining = Math.max(0, (tour.threshold || 0) - (tour.interested || 0));
    setText(
      'stateBadge',
      STATE_LABELS[state] + (state === 'near_threshold' ? ` · FALTAN ${remaining}` : '')
    );

    const isConfirmed = state === 'confirmed';
    const dateLabel = isConfirmed ? 'Fecha definitiva'
                    : state === 'postponed' ? 'Nueva fecha tentativa'
                    : 'Fecha tentativa';
    setText('dateLabel', dateLabel);
    setText('dateValue', isConfirmed ? (tour.confirmedDate || tour.tentativeDate || '—') : (tour.tentativeDate || '—'));
    const noteEl = document.querySelector('[data-td="dateNote"]');
    if (noteEl) noteEl.style.display = isConfirmed ? 'none' : '';

    const n = tour.interested || 0;
    const t = tour.threshold || 1;
    const fill = document.querySelector('[data-td="progressFill"]');
    if (fill) fill.style.width = (isConfirmed ? 100 : Math.min(100, Math.round((n / t) * 100))) + '%';
    const text = document.querySelector('[data-td="progressText"]');
    if (text) {
      const max = tour.maxCapacity || t;
      const remainingCupos = Math.max(0, max - n);
      if (isConfirmed) {
        text.innerHTML = `<span><strong>${n}</strong> personas en ruta</span><span class="nt-progress-accent">${remainingCupos > 0 ? `Quedan ${remainingCupos} cupos` : 'Tour lleno'}</span>`;
      } else if (state === 'completed') {
        text.innerHTML = `<span><strong>${n}</strong> personas hicieron este tour</span>`;
      } else {
        const fire = state === 'near_threshold' ? ' 🔥' : '';
        text.innerHTML = `<span><strong>${n}</strong> de ${t} interesados</span><span class="nt-progress-accent">Faltan ${remaining} más${fire}</span>`;
      }
    }

    setText('duration', tour.duration);
    setText('diff', tour.diff);
    setText('minAge', tour.minAge);
    setText('maxCapacity', tour.maxCapacity || '—');

    setText('priceLabel', isConfirmed ? 'POR PERSONA' : 'ESTIMADO POR PERSONA');
    setText('price', tour.price);

    const actions = document.querySelector('[data-td-actions]');
    if (actions) actions.innerHTML = actionsHtml(tour);

    const hintMap = {
      'searching': 'Sin compromiso de pago. Nancy te contacta cuando el tour se confirma.',
      'near_threshold': 'Casi se lanza. Sumate y Nancy te confirma por WhatsApp.',
      'confirmed': 'Apartá 50% con SINPE para asegurar tu lugar.',
      'postponed': 'Si no llegamos al cupo, buscamos otra fecha juntos.',
      'completed': 'Este tour ya pasó. Mirá los abiertos →',
    };
    setText('hint', hintMap[state] || '');

    const openBtn = aside.querySelector('[data-open-interest]');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        if (window.NT && window.NT.interestModal) {
          window.NT.interestModal.open(tour);
        } else {
          // Fallback before Task 11 lands the modal
          const msg = `¡Hola Nancy! Me interesa el tour de ${tour.title} (${tour.tentativeDate || ''}).`;
          window.open(waLink(msg), '_blank', 'noopener');
        }
      });
    }
  }

  function renderHero(tour) {
    document.title = `${tour.title} · Nancy Tours Costa Rica`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', tour.lead || '');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${tour.title} · Nancy Tours Costa Rica`);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', tour.lead || '');
    const heroBg = document.querySelector('[data-td="hero-bg"]');
    if (heroBg && tour.hero) heroBg.style.backgroundImage = `url("${escapeCssUrl(tour.hero)}")`;
    ['title', 'tag', 'loc', 'elev', 'lead', 'blurb'].forEach((k) => setText(k, tour[k]));
  }

  function renderItinerary(tour) {
    const slot = document.querySelector('[data-td-slot="itinerary"]');
    const block = document.querySelector('[data-td-block="itinerary"]');
    if (!slot || !block) return;
    if (!Array.isArray(tour.itinerary) || !tour.itinerary.length) return;
    slot.innerHTML = tour.itinerary.map((day) => `
      <div class="td-day-block">
        <div class="td-day-label">${escapeHtml(day.d)}</div>
        <ul class="td-day-list">${day.items.map((it) => `<li>${escapeHtml(it)}</li>`).join('')}</ul>
      </div>
    `).join('');
    block.hidden = false;
  }

  function renderLists(tour) {
    const inclBlock = document.querySelector('[data-td-block="includes"]');
    if (inclBlock && ((tour.incl?.length) || (tour.excl?.length))) {
      const inclSlot = document.querySelector('[data-td-slot="incl"]');
      const exclSlot = document.querySelector('[data-td-slot="excl"]');
      if (inclSlot) inclSlot.innerHTML = (tour.incl || []).map((x) => `<li>${escapeHtml(x)}</li>`).join('');
      if (exclSlot) exclSlot.innerHTML = (tour.excl || []).map((x) => `<li>${escapeHtml(x)}</li>`).join('');
      inclBlock.hidden = false;
    }
    const bringSlot = document.querySelector('[data-td-slot="bring"]');
    const bringBlock = document.querySelector('[data-td-block="bring"]');
    if (bringSlot && bringBlock && (tour.bring?.length)) {
      bringSlot.innerHTML = tour.bring.map((x) => `<li>${escapeHtml(x)}</li>`).join('');
      bringBlock.hidden = false;
    }
    const faqSlot = document.querySelector('[data-td-slot="faq"]');
    const faqBlock = document.querySelector('[data-td-block="faq"]');
    if (faqSlot && faqBlock && (tour.faq?.length)) {
      faqSlot.innerHTML = tour.faq.map(([q, a]) => `
        <div class="td-faq-item"><h3 class="td-faq-q">${escapeHtml(q)}</h3><p class="td-faq-a">${escapeHtml(a)}</p></div>
      `).join('');
      faqBlock.hidden = false;
    }
  }

  async function main() {
    const slug = getTourId();
    try {
      const tour = await window.NT.api.getTour(slug);
      if (!tour) throw new Error(`Tour not found: ${slug}`);
      renderHero(tour);
      renderItinerary(tour);
      renderLists(tour);
      renderBookingCard(tour);
    } catch (e) {
      console.error('[NT.tour-detail]', e);
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.innerHTML = `<section style="padding:96px 24px;text-align:center"><h1>Tour no encontrado</h1><p><a href="tours.html">← Ver todos los tours</a></p></section>`;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();
