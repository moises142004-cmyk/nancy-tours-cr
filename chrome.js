// Nancy Tours Costa Rica — shared chrome JS
// =====================================================================
// Loaded on every page. Handles:
//   1. Mobile menu toggle (hamburger → fullscreen overlay)
//   2. ES/EN language switcher (notice + localStorage)

(function () {
  'use strict';

  // ── Mobile menu ─────────────────────────────────────────────────────
  function initMobileMenu() {
    const openBtn = document.querySelector('.nt-hamburger');
    const menu = document.getElementById('nt-mobile-menu');
    if (!openBtn || !menu) return;
    const closeBtn = menu.querySelector('.nt-mobile-close');

    const focusableSelector = 'a[href], button:not([disabled])';

    const open = () => {
      menu.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      // Move focus into the menu for keyboard / screen reader users
      const first = menu.querySelector(focusableSelector);
      if (first) first.focus();
    };
    const close = () => {
      menu.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      // Restore focus to the trigger
      openBtn.focus();
    };

    // Focus trap: keep Tab cycling within the open menu
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || menu.hidden) return;
      const items = Array.from(menu.querySelectorAll(focusableSelector));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) close();
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  }

  // ── Language switcher ───────────────────────────────────────────────
  function initLanguage() {
    const buttons = document.querySelectorAll('[data-lang]');
    if (!buttons.length) return;

    let current = 'es';
    try { current = localStorage.getItem('nt-lang') || 'es'; } catch (e) {}

    const apply = (lang) => {
      buttons.forEach((b) => {
        const isActive = b.dataset.lang === lang;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    };

    const notice = () => {
      const n = document.createElement('div');
      n.setAttribute('role', 'status');
      n.setAttribute('aria-live', 'polite');
      n.className = 'nt-lang-notice';
      n.innerHTML = '<span class="nt-lang-notice-dot"></span>English version coming soon — WhatsApp Nancy directly, she speaks English.';
      document.body.appendChild(n);
      setTimeout(() => n.remove(), 2600);
    };

    apply(current);

    buttons.forEach((b) => {
      b.addEventListener('click', () => {
        const next = b.dataset.lang;
        current = next;
        try { localStorage.setItem('nt-lang', next); } catch (e) {}
        apply(next);
        if (next === 'en') notice();
      });
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(() => {
    initMobileMenu();
    initLanguage();
  });
})();
