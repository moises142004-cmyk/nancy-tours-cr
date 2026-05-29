// Nancy Tours Costa Rica — i18n ES/EN
// =====================================================================
// Simple dictionary-based translation system. Apply by adding data-i18n
// attributes to elements:
//   <span data-i18n="nav.home">Inicio</span>
//   <img data-i18n-attr="alt:hero.alt" alt="..." />
//   <meta data-i18n-attr="content:meta.desc" name="description" />
//
// To change language: NT.i18n.setLang('en') — persists in localStorage.

(function () {
  'use strict';

  const I18N = {
    es: {
      // ── Document
      'doc.lang': 'es',
      'meta.home.title': 'Nancy Tours Costa Rica · Tours guiados por todo el país',
      'meta.home.desc': 'Tours guiados por Nancy. 15 años recorriendo Costa Rica — Chirripó, Tortuguero, Bajos del Toro, Volcán Poás. Grupos pequeños, guía profesional, radios + GPS.',
      'meta.tours.title': 'Tours · Nancy Tours Costa Rica',
      'meta.tours.desc': 'Catálogo completo de tours guiados en Costa Rica. Chirripó, Tortuguero, Bajos del Toro, Volcán Poás, Cavernas de Venado, Ballenas Uvita y más.',
      'meta.nancy.title': 'Sobre Nancy · Nancy Tours Costa Rica',
      'meta.nancy.desc': 'Nancy Villalobos, Licenciada en Turismo. 15 años guiando grupos por cada provincia de Costa Rica.',
      'meta.contact.title': 'Contacto · Nancy Tours Costa Rica',
      'meta.contact.desc': 'Reservá tu tour. WhatsApp, correo o formulario. Métodos de pago: SINPE móvil, depósito BN/BAC, efectivo.',

      // ── Nav
      'nav.home': 'Inicio',
      'nav.tours': 'Tours',
      'nav.nancy': 'Sobre Nancy',
      'nav.contact': 'Contacto',
      'nav.book': 'Reservar',
      'nav.openMenu': 'Abrir menú',
      'nav.closeMenu': 'Cerrar menú',
      'nav.brand.aria': 'Nancy Tours CR — Inicio',
      'nav.skipLink': 'Saltar al contenido',

      // ── Hero
      'hero.eyebrow': 'EXPERIENCIAS QUE CONECTAN · DESDE 2010',
      'hero.h1.l1': 'Los mejores',
      'hero.h1.l2': 'tours de',
      'hero.h1.l3': 'Costa Rica.',
      'hero.lead': 'Tours guiados por Nancy — Licenciada en Turismo, 15 años caminando cada volcán, río y catarata de Costa Rica. Equipo de radios, GPS y la calma de saber a dónde vamos.',
      'hero.cta.tours': 'Próximos tours →',
      'hero.cta.wa': 'WhatsApp',
      'hero.stats.years': 'años en ruta',
      'hero.stats.destinations': 'destinos cubiertos',
      'hero.stats.reviews': '★ reseñas',

      // ── Audio chip
      'chip.title': 'AUDIO · CHIRRIPÓ',
      'chip.play': 'TOCÁ PARA OÍR',
      'chip.playing': 'AVES · SELVA',
      'chip.aria.play': 'Audio Chirripó · Tocá para oír sonido de selva',
      'chip.aria.pause': 'Pausar sonido de selva',

      // ── Intro de Nancy
      'intro.eyebrow': 'DIME A DÓNDE QUIERES IR',
      'intro.h2.l1': 'Y yo organizo',
      'intro.h2.l2': 'tu',
      'intro.h2.l3': 'aventura',
      'intro.p1': 'Creo tours organizados y experiencias personalizadas por todo Costa Rica, diseñadas especialmente para que disfrutes sin preocuparte por nada.',
      'intro.p2.start': 'Organizo tours para',
      'intro.p2.bold1': 'grupos grandes desde 10 personas',
      'intro.p2.mid': 'en adelante, así como',
      'intro.p2.bold2': 'experiencias privadas y personalizadas',
      'intro.p2.end': 'para familias, parejas o pequeños grupos de 2, 3 o 5 personas. Cada viaje se adapta a lo que ustedes desean vivir: naturaleza, aventura, descanso, hiking, playas, volcanes, cultura y momentos inolvidables.',
      'intro.p3': 'Tú solo dime qué lugar sueñas conocer y yo me encargo de todo: transporte, organización, recorridos y cada detalle, para que solamente disfrutes, tomes fotografías hermosas y vivas Costa Rica de una manera auténtica y feliz.',
      'intro.feat1': 'Tours grupales',
      'intro.feat2': 'Tours familiares personalizados',
      'intro.feat3': 'Hiking y naturaleza',
      'intro.feat4': 'Playas, montañas y volcanes',
      'intro.feat5': 'Experiencias hechas a tu gusto',
      'intro.closer.l1': 'Tú eliges el destino…',
      'intro.closer.l2': 'yo hago que el viaje sea inolvidable.',
      'intro.cta.wa': 'Decime a dónde quieres ir →',
      'intro.cta.tours': 'Ver catálogo de tours',
      'intro.cta.wa.msg': '¡Hola Nancy! Me gustaría que me organices un tour.',

      // ── Tours section
      'tours.eyebrow': '01 / TOURS ABIERTOS',
      'tours.h2': 'Cada salida, una historia distinta.',
      'tours.viewAll': 'Calendario completo →',
      'tours.book': 'Reservar →',
      'tours.from': 'DESDE',
      'tours.meta.date': 'FECHA',
      'tours.meta.duration': 'DURACIÓN',
      'tours.meta.level': 'NIVEL',
      'tours.meta.spots': 'CUPO',

      // ── Why Nancy
      'diff.eyebrow': '02 / POR QUÉ NANCY',
      'diff.h2': 'No es solo conocer Costa Rica. Es conocerla bien.',
      'diff.1.tag': 'CREDENCIAL',
      'diff.1.title': 'Lic. en Turismo',
      'diff.1.desc': 'Credencial formal del ICT. Sé de qué hablo en cada parque nacional.',
      'diff.1.proof': 'Cédula profesional vigente',
      'diff.2.tag': 'TRAYECTORIA',
      'diff.2.title': 'Quince años',
      'diff.2.desc': 'Recorrí cada provincia con grupos chicos y grandes desde 2010.',
      'diff.2.proof': '2010 → 2026 · activa',
      'diff.2.yearsLabel': 'años',
      'diff.3.tag': 'SEGURIDAD',
      'diff.3.title': 'Radios + GPS',
      'diff.3.desc': 'Equipo de comunicación en cada tour. Seguridad real, no improvisada.',
      'diff.3.proof': 'VHF + GPS en cada salida',
      'diff.4.tag': 'METODOLOGÍA',
      'diff.4.title': 'A tu ritmo',
      'diff.4.desc': 'Familias, tercera edad, jóvenes. Leo el grupo y ajusto el paso.',
      'diff.4.proof': 'Grupos máximo 12 personas',

      // ── About split
      'about.eyebrow': '03 / TU GUÍA',
      'about.h2': 'Nancy.',
      'about.lead': '"Empecé caminando los senderos de Heredia con mi familia. Hoy soy Licenciada en Turismo y llevo grupos por todo Costa Rica desde hace quince años. Si vas conmigo, vas tranquilo: sé los caminos, conozco el clima, leo el grupo. Mi promesa es simple — terminar el día cansados, pero felices."',
      'about.signature': '— Nancy Villalobos, Lic. Turismo',
      'about.cta': 'Conocé mi historia →',

      // ── Final CTA
      'book.eyebrow': '04 / RESERVÁ',
      'book.h2.l1': 'Decime',
      'book.h2.l1.accent': 'cuándo',
      'book.h2.l2': 'y armamos el resto.',
      'book.opt.wa': 'WhatsApp',
      'book.opt.wa.sub': 'Respuesta en el día',
      'book.opt.sinpe': 'SINPE móvil',
      'book.opt.sinpe.sub': 'Para apartar tu cupo',
      'book.opt.bank': 'Depósito bancario',
      'book.opt.bank.sub': 'BN / BAC',
      'book.opt.mail': 'Correo',
      'book.opt.mail.sub': 'hola@nancytourscr.com',

      // ── Footer
      'footer.tagline': 'EXPERIENCIAS QUE CONECTAN',
      'footer.blurb': 'Tours guiados por toda Costa Rica.',
      'footer.address': 'Heredia, Mercedes Norte. ICT en trámite.',
      'footer.nav.h': 'Navegación',
      'footer.nav.all': 'Todos los tours',
      'footer.featured.h': 'Tours destacados',
      'footer.featured.all': 'Ver todos →',
      'footer.cat.h': 'Por categoría',
      'footer.cat.adventure': 'Aventura',
      'footer.cat.day': 'Día completo',
      'footer.cat.seniors': 'Tercera edad',
      'footer.cat.cultural': 'Cultural',
      'footer.cat.custom': 'A medida',
      'footer.contact.h': 'Contacto',
      'footer.contact.maps': 'Heredia, Mercedes Norte',
      'footer.copy': '© 2026 NANCY TOURS COSTA RICA · Todos los derechos reservados',
      'footer.design': 'Diseño',

      // ── WhatsApp float
      'wa.float.aria': 'WhatsApp Nancy',
    },

    en: {
      // ── Document
      'doc.lang': 'en',
      'meta.home.title': 'Nancy Tours Costa Rica · Guided tours all across the country',
      'meta.home.desc': 'Guided tours with Nancy. 15 years exploring Costa Rica — Chirripó, Tortuguero, Bajos del Toro, Poás Volcano. Small groups, professional guide, radios + GPS.',
      'meta.tours.title': 'Tours · Nancy Tours Costa Rica',
      'meta.tours.desc': 'Full catalog of guided tours in Costa Rica. Chirripó, Tortuguero, Bajos del Toro, Poás Volcano, Venado Caves, Whales in Uvita and more.',
      'meta.nancy.title': 'About Nancy · Nancy Tours Costa Rica',
      'meta.nancy.desc': 'Nancy Villalobos, Tourism Degree. 15 years guiding groups across every province of Costa Rica.',
      'meta.contact.title': 'Contact · Nancy Tours Costa Rica',
      'meta.contact.desc': 'Book your tour. WhatsApp, email or form. Payment methods: SINPE, bank transfer, cash.',

      // ── Nav
      'nav.home': 'Home',
      'nav.tours': 'Tours',
      'nav.nancy': 'About Nancy',
      'nav.contact': 'Contact',
      'nav.book': 'Book',
      'nav.openMenu': 'Open menu',
      'nav.closeMenu': 'Close menu',
      'nav.brand.aria': 'Nancy Tours CR — Home',
      'nav.skipLink': 'Skip to content',

      // ── Hero
      'hero.eyebrow': 'EXPERIENCES THAT CONNECT · SINCE 2010',
      'hero.h1.l1': 'The best',
      'hero.h1.l2': 'tours in',
      'hero.h1.l3': 'Costa Rica.',
      'hero.lead': 'Tours guided by Nancy — Tourism degree, 15 years walking every volcano, river and waterfall in Costa Rica. Radios, GPS, and the calm of knowing the way.',
      'hero.cta.tours': 'Upcoming tours →',
      'hero.cta.wa': 'WhatsApp',
      'hero.stats.years': 'years on the road',
      'hero.stats.destinations': 'destinations covered',
      'hero.stats.reviews': '★ reviews',

      // ── Audio chip
      'chip.title': 'AUDIO · CHIRRIPÓ',
      'chip.play': 'TAP TO LISTEN',
      'chip.playing': 'BIRDS · JUNGLE',
      'chip.aria.play': 'Audio Chirripó · Tap to play jungle sounds',
      'chip.aria.pause': 'Pause jungle sounds',

      // ── Intro de Nancy
      'intro.eyebrow': 'TELL ME WHERE YOU WANT TO GO',
      'intro.h2.l1': 'And I plan',
      'intro.h2.l2': 'your',
      'intro.h2.l3': 'adventure',
      'intro.p1': "I create organized tours and custom experiences across Costa Rica, designed so you can enjoy without worrying about anything.",
      'intro.p2.start': 'I organize tours for',
      'intro.p2.bold1': 'large groups from 10 people',
      'intro.p2.mid': 'onwards, as well as',
      'intro.p2.bold2': 'private and personalized experiences',
      'intro.p2.end': 'for families, couples, or small groups of 2, 3 or 5 people. Each trip adapts to what you want to live: nature, adventure, rest, hiking, beaches, volcanoes, culture, and unforgettable moments.',
      'intro.p3': 'Just tell me what place you dream of seeing and I take care of everything: transportation, planning, routes, and every detail — so you only enjoy, take beautiful photos, and live Costa Rica in an authentic, happy way.',
      'intro.feat1': 'Group tours',
      'intro.feat2': 'Custom family tours',
      'intro.feat3': 'Hiking & nature',
      'intro.feat4': 'Beaches, mountains & volcanoes',
      'intro.feat5': 'Experiences made to fit you',
      'intro.closer.l1': 'You choose the destination…',
      'intro.closer.l2': 'I make the trip unforgettable.',
      'intro.cta.wa': 'Tell me where you want to go →',
      'intro.cta.tours': 'Browse tour catalog',
      'intro.cta.wa.msg': "Hi Nancy! I'd love for you to organize a tour for me.",

      // ── Tours section
      'tours.eyebrow': '01 / OPEN TOURS',
      'tours.h2': 'Every trip, a different story.',
      'tours.viewAll': 'Full calendar →',
      'tours.book': 'Book →',
      'tours.from': 'FROM',
      'tours.meta.date': 'DATE',
      'tours.meta.duration': 'DURATION',
      'tours.meta.level': 'LEVEL',
      'tours.meta.spots': 'SPOTS',

      // ── Why Nancy
      'diff.eyebrow': '02 / WHY NANCY',
      'diff.h2': "It's not just about seeing Costa Rica. It's about knowing it well.",
      'diff.1.tag': 'CREDENTIAL',
      'diff.1.title': 'Tourism Degree',
      'diff.1.desc': 'Formal ICT credential. I know what I am talking about in every national park.',
      'diff.1.proof': 'Active professional license',
      'diff.2.tag': 'TRACK RECORD',
      'diff.2.title': 'Fifteen years',
      'diff.2.desc': 'I have walked every province with small and large groups since 2010.',
      'diff.2.proof': '2010 → 2026 · active',
      'diff.2.yearsLabel': 'years',
      'diff.3.tag': 'SAFETY',
      'diff.3.title': 'Radios + GPS',
      'diff.3.desc': 'Communication gear on every tour. Real safety, not improvised.',
      'diff.3.proof': 'VHF + GPS on every trip',
      'diff.4.tag': 'METHOD',
      'diff.4.title': 'At your pace',
      'diff.4.desc': 'Families, seniors, young travelers. I read the group and adjust the pace.',
      'diff.4.proof': 'Groups of 12 people max',

      // ── About split
      'about.eyebrow': '03 / YOUR GUIDE',
      'about.h2': 'Nancy.',
      'about.lead': '"I started walking the trails of Heredia with my family. Today I am a Tourism graduate and I have been guiding groups across Costa Rica for fifteen years. If you go with me, you go calm: I know the trails, I know the weather, I read the group. My promise is simple — finish the day tired, but happy."',
      'about.signature': '— Nancy Villalobos, Tourism Degree',
      'about.cta': 'Read my story →',

      // ── Final CTA
      'book.eyebrow': '04 / BOOK',
      'book.h2.l1': 'Tell me',
      'book.h2.l1.accent': 'when',
      'book.h2.l2': 'and I handle the rest.',
      'book.opt.wa': 'WhatsApp',
      'book.opt.wa.sub': 'Same-day reply',
      'book.opt.sinpe': 'SINPE mobile',
      'book.opt.sinpe.sub': 'To reserve your spot',
      'book.opt.bank': 'Bank transfer',
      'book.opt.bank.sub': 'BN / BAC',
      'book.opt.mail': 'Email',
      'book.opt.mail.sub': 'hola@nancytourscr.com',

      // ── Footer
      'footer.tagline': 'EXPERIENCES THAT CONNECT',
      'footer.blurb': 'Guided tours all across Costa Rica.',
      'footer.address': 'Heredia, Mercedes Norte. ICT pending.',
      'footer.nav.h': 'Navigation',
      'footer.nav.all': 'All tours',
      'footer.featured.h': 'Featured tours',
      'footer.featured.all': 'See all →',
      'footer.cat.h': 'By category',
      'footer.cat.adventure': 'Adventure',
      'footer.cat.day': 'Day trip',
      'footer.cat.seniors': 'Seniors',
      'footer.cat.cultural': 'Cultural',
      'footer.cat.custom': 'Custom',
      'footer.contact.h': 'Contact',
      'footer.contact.maps': 'Heredia, Mercedes Norte',
      'footer.copy': '© 2026 NANCY TOURS COSTA RICA · All rights reserved',
      'footer.design': 'Design',

      // ── WhatsApp float
      'wa.float.aria': 'WhatsApp Nancy',
    },
  };

  function getLang() {
    try {
      const stored = localStorage.getItem('nt-lang');
      if (stored === 'es' || stored === 'en') return stored;
    } catch (e) {}
    return 'es';
  }

  function setLang(lang) {
    if (lang !== 'es' && lang !== 'en') lang = 'es';
    try { localStorage.setItem('nt-lang', lang); } catch (e) {}
    apply(lang);
  }

  function t(key, lang) {
    lang = lang || getLang();
    const dict = I18N[lang] || I18N.es;
    return dict[key] || (I18N.es[key] || key);
  }

  function apply(lang) {
    lang = lang || getLang();
    const dict = I18N[lang] || I18N.es;

    // <html lang="...">
    document.documentElement.setAttribute('lang', lang);

    // Text content via [data-i18n="key"]
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key in dict) el.textContent = dict[key];
    });

    // Attribute via [data-i18n-attr="attr:key,attr2:key2"]
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key && key in dict) el.setAttribute(attr, dict[key]);
      });
    });

    // <title> and <meta name="description"> by data-i18n-title / data-i18n-desc
    if (document.title && document.querySelector('[data-i18n-title]')) {
      const key = document.querySelector('[data-i18n-title]').getAttribute('data-i18n-title');
      if (key in dict) document.title = dict[key];
    }

    // Custom event for components that need to re-render
    document.dispatchEvent(new CustomEvent('nt:langchange', { detail: { lang } }));
  }

  // Expose
  window.NT = window.NT || {};
  window.NT.i18n = {
    t,
    apply,
    setLang,
    getLang,
    dict: I18N,
  };

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(() => apply());
})();
