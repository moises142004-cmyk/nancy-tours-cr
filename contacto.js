// Nancy Tours Costa Rica — Contacto page JS
// =====================================================================
// Form submit → open WhatsApp with pre-filled message.

(function () {
  'use strict';

  function initForm() {
    const form = document.getElementById('cp-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const consent = form.elements.namedItem('consent');
      if (consent && !consent.checked) {
        consent.focus();
        return;
      }

      const v = (k) => {
        const el = form.elements.namedItem(k);
        return (el && el.value ? el.value : '').trim();
      };

      const lines = [
        '¡Hola Nancy! Quiero hacer una consulta:',
        '',
        `• Nombre: ${v('nombre') || '—'}`,
        `• Email: ${v('email') || '—'}`,
        `• WhatsApp: ${v('whatsapp') || '—'}`,
        `• Grupo: ${v('grupo') || '—'}`,
        `• Fecha tentativa: ${v('fecha') || '—'}`,
        `• Tour de interés: ${v('tour') || '—'}`,
      ];
      const mensaje = v('mensaje');
      if (mensaje) {
        lines.push('');
        lines.push('Detalles:');
        lines.push(mensaje);
      }

      const url = 'https://wa.me/50689494655?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(initForm);
})();
