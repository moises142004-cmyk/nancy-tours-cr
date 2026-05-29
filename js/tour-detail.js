// Nancy Tours Costa Rica — Tour detail page JS
// =====================================================================
// Reads ?id= from URL, looks up window.TOURS (from tours-data.js),
// populates [data-td] slots in the markup. Falls back to TOURS.default.

(function () {
  'use strict';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  // Escape characters that could break out of `url(...)` in a style attribute
  function escapeCssUrl(s) {
    return String(s).replace(/[\\"'() <>]/g, (c) => '\\' + c);
  }

  function getTourId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'chirripo';
  }

  function render(tour) {
    // Set page title
    document.title = `${tour.title} · Nancy Tours Costa Rica`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', tour.lead);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${tour.title} · Nancy Tours Costa Rica`);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', tour.lead);

    // Hero bg — set via style.backgroundImage (the browser handles escaping)
    const heroBg = document.querySelector('[data-td="hero-bg"]');
    if (heroBg && tour.hero) heroBg.style.backgroundImage = `url("${escapeCssUrl(tour.hero)}")`;

    // Simple text fields
    const fields = ['title', 'tag', 'loc', 'elev', 'diff', 'duration', 'cupo', 'minAge', 'price', 'lead', 'blurb', 'nextDate'];
    fields.forEach((k) => {
      document.querySelectorAll(`[data-td="${k}"]`).forEach((el) => {
        el.textContent = tour[k] || '';
      });
    });

    // WhatsApp link with prefilled message
    const waLink = document.querySelector('[data-td="waLink"]');
    if (waLink) {
      const msg = `¡Hola Nancy! Me interesa el tour de ${tour.title}. ¿Cuándo es la próxima salida?`;
      waLink.href = (window.NT && window.NT.contact ? window.NT.contact.waMsg(msg)
                                                    : 'https://wa.me/50688787370?text=' + encodeURIComponent(msg));
    }

    // Itinerary
    const iti = document.querySelector('[data-td-slot="itinerary"]');
    const itiBlock = document.querySelector('[data-td-block="itinerary"]');
    if (iti && itiBlock) {
      if (tour.itinerary && tour.itinerary.length) {
        iti.innerHTML = tour.itinerary.map((day) => `
          <div class="td-day-block">
            <div class="td-day-label">${escapeHtml(day.d)}</div>
            <ul class="td-day-list">
              ${day.items.map((it) => `<li>${escapeHtml(it)}</li>`).join('')}
            </ul>
          </div>
        `).join('');
        itiBlock.hidden = false;
      }
    }

    // Includes / excludes — show the block if either list has items
    const incl = document.querySelector('[data-td-slot="incl"]');
    const excl = document.querySelector('[data-td-slot="excl"]');
    const inclBlock = document.querySelector('[data-td-block="includes"]');
    const inclLen = (tour.incl && tour.incl.length) || 0;
    const exclLen = (tour.excl && tour.excl.length) || 0;
    if (incl && excl && inclBlock && (inclLen || exclLen)) {
      incl.innerHTML = inclLen ? tour.incl.map((x) => `<li>${escapeHtml(x)}</li>`).join('') : '';
      excl.innerHTML = exclLen ? tour.excl.map((x) => `<li>${escapeHtml(x)}</li>`).join('') : '';
      inclBlock.hidden = false;
    }

    // Bring list
    const bring = document.querySelector('[data-td-slot="bring"]');
    const bringBlock = document.querySelector('[data-td-block="bring"]');
    if (bring && bringBlock && tour.bring && tour.bring.length) {
      bring.innerHTML = tour.bring.map((x) => `<li>${escapeHtml(x)}</li>`).join('');
      bringBlock.hidden = false;
    }

    // FAQ
    const faq = document.querySelector('[data-td-slot="faq"]');
    const faqBlock = document.querySelector('[data-td-block="faq"]');
    if (faq && faqBlock && tour.faq && tour.faq.length) {
      faq.innerHTML = tour.faq.map(([q, a]) => `
        <div class="td-faq-item">
          <h3 class="td-faq-q">${escapeHtml(q)}</h3>
          <p class="td-faq-a">${escapeHtml(a)}</p>
        </div>
      `).join('');
      faqBlock.hidden = false;
    }

    // Related
    const rel = document.querySelector('[data-td-slot="related"]');
    const relBlock = document.querySelector('[data-td-block="related"]');
    if (rel && relBlock && tour.related && tour.related.length) {
      rel.innerHTML = tour.related.map((slug) => {
        const r = (window.TOURS && window.TOURS[slug]) || window.TOURS.default;
        return `
          <a href="tour-detail.html?id=${encodeURIComponent(slug)}" class="td-rel-card">
            <div class="td-rel-photo" style="background-image: url(&quot;${escapeHtml(escapeCssUrl(r.hero || ''))}&quot;)">
              <span class="td-rel-tag">${escapeHtml(r.tag)}</span>
            </div>
            <div class="td-rel-body">
              <h3 class="td-rel-title">${escapeHtml(r.title)}</h3>
              <div class="td-rel-loc">${escapeHtml(r.loc)}</div>
              <div class="td-rel-foot">
                <strong>${escapeHtml(r.price)}</strong>
                <span>${escapeHtml(r.duration)}</span>
              </div>
            </div>
          </a>
        `;
      }).join('');
      relBlock.hidden = false;
    }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(() => {
    const tours = window.TOURS || {};
    const id = getTourId();
    const tour = tours[id] || tours.default || null;
    if (tour) render(tour);
  });
})();
