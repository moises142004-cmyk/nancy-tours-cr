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
  let lastFocused = null;
  let errorIdCounter = 0;

  function getFocusable(root) {
    return Array.from(root.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((el) => {
      // Exclude controls inside a hidden subtree (e.g. .nt-modal-success
      // while the form is showing, or .nt-modal-form-wrap after success).
      if (el.closest('[hidden]')) return false;
      // Belt-and-braces: also skip zero-size / display:none controls.
      if (el.offsetParent === null && el.tagName !== 'BODY') return false;
      return true;
    });
  }

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
            <div class="nt-modal-field" data-field="consent">
              <label class="nt-modal-check">
                <input type="checkbox" name="consent" />
                <span>Acepto que Nancy me contacte por WhatsApp</span>
              </label>
              <div data-field="consent-error"></div>
            </div>
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

    // Focus trap — keep Tab/Shift+Tab cycling inside the modal.
    overlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || overlay.hidden) return;
      const focusable = getFocusable(overlay.querySelector('.nt-modal'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    overlay.querySelector('form').addEventListener('submit', submit);
  }

  function setError(field, message) {
    const wrap = overlay.querySelector(`.nt-modal-field[data-field="${field}"]`);
    if (!wrap) return;
    wrap.classList.add('is-invalid');

    // Consent uses a dedicated error region (not announced on numPeople).
    let errContainer = wrap;
    if (field === 'consent') {
      const ce = wrap.querySelector('[data-field="consent-error"]');
      if (ce) errContainer = ce;
    }

    let err = errContainer.querySelector(':scope > .nt-modal-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'nt-modal-error';
      err.setAttribute('role', 'alert');
      err.id = `nt-modal-err-${++errorIdCounter}`;
      errContainer.appendChild(err);
    }
    err.textContent = message;

    // Wire aria-invalid + aria-describedby onto the actual control.
    const control = wrap.querySelector('input, select, textarea');
    if (control) {
      control.setAttribute('aria-invalid', 'true');
      control.setAttribute('aria-describedby', err.id);
    }
  }

  function clearErrors() {
    overlay.querySelectorAll('.nt-modal-field').forEach((w) => w.classList.remove('is-invalid'));
    overlay.querySelectorAll('.nt-modal-error').forEach((e) => e.remove());
    overlay.querySelectorAll('[aria-invalid="true"]').forEach((el) => {
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    });
  }

  async function submit(e) {
    e.preventDefault();
    // Guard: if a keystroke (Enter) re-fires submit while we're mid-flight,
    // bail out before doing any work.
    const submitBtn = overlay.querySelector('.nt-modal-submit');
    if (submitBtn.disabled) {
      return;
    }

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
      setError('consent', 'Confirmá el consentimiento para continuar.');
      firstError = firstError || 'consent';
    }
    if (firstError) {
      const wrap = overlay.querySelector(`.nt-modal-field[data-field="${firstError}"]`);
      const el = wrap && wrap.querySelector('input, select, textarea');
      if (el) el.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

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
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sumarme al tour →';
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
    // Remember who triggered the modal so we can restore focus on close.
    lastFocused = document.activeElement;
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
    setTimeout(() => {
      overlay.hidden = true;
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }, 200);
  }

  window.NT = window.NT || {};
  window.NT.interestModal = { open, close };
})();
