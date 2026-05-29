// Nancy Tours Costa Rica — Contacto page JS
// =====================================================================
// Form submit → open WhatsApp with pre-filled message.
// Required: nombre + (whatsapp OR email) + consent. Tour/grupo/fecha/etc optional.

(function () {
  'use strict';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // Costa Rican format: 8 digits, optionally with +506 prefix and spaces/dashes
  const PHONE_RE = /^[+\d][\d\s().-]{6,}$/;

  function setFieldError(field, message) {
    if (!field) return;
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('is-invalid');
    let msg = field.parentElement?.querySelector('.cp-field-error');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'cp-field-error';
      msg.style.cssText = 'color:#b5532e;font-size:12px;margin-top:6px;font-weight:600;';
      field.parentElement?.appendChild(msg);
    }
    msg.textContent = message;
  }

  function clearFieldError(field) {
    if (!field) return;
    field.removeAttribute('aria-invalid');
    field.classList.remove('is-invalid');
    const msg = field.parentElement?.querySelector('.cp-field-error');
    if (msg) msg.remove();
  }

  function initForm() {
    const form = document.getElementById('cp-form');
    if (!form) return;

    // Clear errors as the user fixes them
    form.addEventListener('input', (e) => {
      if (e.target instanceof Element) clearFieldError(e.target);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const getEl = (k) => form.elements.namedItem(k);
      const v = (k) => {
        const el = getEl(k);
        return (el && el.value ? el.value : '').trim();
      };

      // Reset previous errors
      ['nombre', 'email', 'whatsapp', 'consent'].forEach((k) => clearFieldError(getEl(k)));

      const nombre = v('nombre');
      const email = v('email');
      const whatsapp = v('whatsapp');
      const consent = getEl('consent');

      let firstError = null;
      const fail = (field, msg) => {
        setFieldError(field, msg);
        if (!firstError) firstError = field;
      };

      // 1. Nombre required
      if (!nombre || nombre.length < 2) {
        fail(getEl('nombre'), 'Necesito tu nombre para responderte.');
      }

      // 2. Email + WhatsApp: al menos uno debe estar (preferimos WhatsApp)
      if (!whatsapp && !email) {
        fail(getEl('whatsapp'), 'Dejame tu WhatsApp o email para responderte.');
      } else {
        if (email && !EMAIL_RE.test(email)) {
          fail(getEl('email'), 'Ese email no parece válido. Revisalo.');
        }
        if (whatsapp && !PHONE_RE.test(whatsapp)) {
          fail(getEl('whatsapp'), 'Ese número no parece válido. Ejemplo: +506 8888-8888');
        }
      }

      // 3. Consent
      if (consent && !consent.checked) {
        fail(consent, '');
        consent.parentElement?.classList.add('is-invalid');
      }

      if (firstError) {
        firstError.focus();
        if (typeof firstError.scrollIntoView === 'function') {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // ── Build WhatsApp message ──────────────────────────────────────
      const lines = [
        '¡Hola Nancy! Quiero hacer una consulta:',
        '',
        `• Nombre: ${nombre}`,
      ];
      if (email) lines.push(`• Email: ${email}`);
      if (whatsapp) lines.push(`• WhatsApp: ${whatsapp}`);
      if (v('grupo')) lines.push(`• Grupo: ${v('grupo')}`);
      if (v('fecha')) lines.push(`• Fecha tentativa: ${v('fecha')}`);
      if (v('tour')) lines.push(`• Tour de interés: ${v('tour')}`);

      const mensaje = v('mensaje');
      if (mensaje) {
        lines.push('');
        lines.push('Detalles:');
        lines.push(mensaje);
      }

      const url = (window.NT && window.NT.contact
        ? window.NT.contact.waMsg(lines.join('\n'))
        : 'https://wa.me/50689494655?text=' + encodeURIComponent(lines.join('\n')));
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(initForm);
})();
