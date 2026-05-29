// Nancy Tours — interest capture modal
// =====================================================================
// Singleton modal built on first open. Reused across tour-detail and
// (future) catalog interactions. Submits to NT.api.postInterest.
//
// Public surface: window.NT.interestModal.open(tour) / .close()
//
// postInterest returns {ok, newCount, threshold, derivedState} — we use
// newCount + threshold directly for the success copy (no second roundtrip).

(function () {
  'use strict';

  let overlay = null;
  let currentTour = null;

  function ensureDom() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'nt-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'nt-modal-title');
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="nt-modal">
        <button type="button" class="nt-modal-close" aria-label="Cerrar">✕</button>
        <div class="nt-modal-form-wrap">
          <div class="nt-modal-eyebrow">🌿 SUMATE AL TOUR</div>
          <h2 id="nt-modal-title">Sumate a <span class="nt-modal-tour"></span></h2>
          <form class="nt-modal-form" novalidate>
            <div class="nt-modal-field" data-field="name">
              <label for="nt-modal-name">TU NOMBRE</label>
              <input id="nt-modal-name" name="name" type="text" placeholder="María Solís" autocomplete="name" />
            </div>
            <div class="nt-modal-field" data-field="whatsapp">
              <label for="nt-modal-whatsapp">TU WHATSAPP</label>
              <input id="nt-modal-whatsapp" name="whatsapp" type="tel" placeholder="+506 ____ ____" autocomplete="tel" />
            </div>
            <div class="nt-modal-field" data-field="numPeople">
              <label for="nt-modal-num">¿CUÁNTAS PERSONAS?</label>
              <select id="nt-modal-num" name="numPeople">
                ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
              </select>
            </div>
            <label class="nt-modal-check">
              <input type="checkbox" name="consent" />
              <span>Acepto que Nancy me contacte por WhatsApp</span>
            </label>
            <button type="submit" class="nt-modal-submit">Sumarme al tour →</button>
            <p class="nt-modal-foot">Sin pago ahora. Nancy te avisa cuando el tour se confirma.</p>
          </form>
        </div>
        <div class="nt-modal-success" hidden>
          <div class="nt-modal-success-icon">🎉</div>
          <h2 class="nt-modal-success-title">¡Listo!</h2>
          <p class="nt-modal-success-msg"></p>
          <button type="button" class="nt-btn nt-btn-ghost" style="margin-top:18px" data-close>Cerrar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.nt-modal-close').addEventListener('click', close);
    overlay.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay && !overlay.hidden) close();
    });
    overlay.querySelector('form').addEventListener('submit', submit);
  }

  function setError(field, message) {
    const wrap = overlay.querySelector(`[data-field="${field}"]`);
    if (!wrap) return;
    wrap.classList.add('is-invalid');
    let err = wrap.querySelector('.nt-modal-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'nt-modal-error';
      wrap.appendChild(err);
    }
    err.textContent = message;
  }

  function clearErrors() {
    overlay.querySelectorAll('.nt-modal-field').forEach((w) => w.classList.remove('is-invalid'));
    overlay.querySelectorAll('.nt-modal-error').forEach((e) => e.remove());
  }

  async function submit(e) {
    e.preventDefault();
    clearErrors();
    const form = e.currentTarget;
    const name = form.elements.name.value.trim();
    const whatsapp = form.elements.whatsapp.value.trim();
    const numPeople = Number(form.elements.numPeople.value);
    const consent = form.elements.consent.checked;

    let firstError = null;
    if (!name || name.length < 2) {
      setError('name', 'Necesito tu nombre.');
      firstError = firstError || 'name';
    }
    if (!/^[+\d][\d\s().-]{6,}$/.test(whatsapp)) {
      setError('whatsapp', 'Número inválido. Ej: +506 8888-8888');
      firstError = firstError || 'whatsapp';
    }
    if (!consent) {
      // The consent checkbox lives at the end of the form; we attach the
      // error message to the numPeople field so it's visible just above.
      setError('numPeople', 'Confirmá el consentimiento abajo.');
      firstError = firstError || 'numPeople';
    }
    if (firstError) {
      const el = overlay.querySelector(`[data-field="${firstError}"] input, [data-field="${firstError}"] select`);
      if (el) el.focus();
      return;
    }

    const btn = form.querySelector('.nt-modal-submit');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      const result = await window.NT.api.postInterest({
        slug: currentTour.slug,
        name,
        whatsapp,
        numPeople,
      });
      showSuccess(name, result);
    } catch (err) {
      console.error('[NT.interestModal]', err);
      btn.disabled = false;
      btn.textContent = 'Sumarme al tour →';
      setError('numPeople', 'Algo salió mal. Probá de nuevo o WhatsApp a Nancy.');
    }
  }

  function showSuccess(name, result) {
    overlay.querySelector('.nt-modal-form-wrap').hidden = true;
    const succ = overlay.querySelector('.nt-modal-success');
    succ.hidden = false;

    // postInterest returned {ok, newCount, threshold, derivedState}.
    // Fall back to the cached tour values if any field came back null
    // (rare: admin deleted the tour between insert and refetch).
    const threshold = (result && result.threshold) || (currentTour && currentTour.threshold) || 0;
    const newCount = (result && result.newCount) != null
      ? result.newCount
      : ((currentTour && currentTour.interested) || 0);
    const remaining = Math.max(0, threshold - newCount);

    const msg = remaining > 0
      ? `${name}, sos parte del tour. Faltan ${remaining} más para que se confirme. Te aviso por WhatsApp.`
      : `${name}, ya llegamos al cupo. Te contacto pronto para confirmar la fecha.`;
    succ.querySelector('.nt-modal-success-msg').textContent = msg;
  }

  function open(tour) {
    ensureDom();
    currentTour = tour;
    clearErrors();
    overlay.querySelector('.nt-modal-form-wrap').hidden = false;
    overlay.querySelector('.nt-modal-success').hidden = true;
    overlay.querySelector('form').reset();
    const submitBtn = overlay.querySelector('.nt-modal-submit');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sumarme al tour →';
    overlay.querySelector('.nt-modal-tour').textContent = (tour && tour.title) || 'este tour';
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const nameInput = overlay.querySelector('#nt-modal-name');
      if (nameInput) nameInput.focus();
    }, 200);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.hidden = true; }, 200);
  }

  window.NT = window.NT || {};
  window.NT.interestModal = { open, close };
})();
