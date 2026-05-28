// Tour detail page — single template, content keyed by ?id=
// ───────────────────────────────────────────────────────────
// Reads window.location.search for the tour ID. Falls back to
// Chirripó if not specified. Layout: hero · meta strip ·
// description + itinerary (left) + booking card (right sticky)
// · gallery · what's included · FAQ · related tours · footer.

const TOURS = {
  'chirripo': {
    title: 'Cerro Chirripó',
    loc: 'Pérez Zeledón · Talamanca',
    elev: '3.820 m',
    tag: 'AVENTURA · 3 DÍAS',
    hero: 'img/chirripo-summit.jpg',
    nextDate: '13 — 15 jun · vie a dom',
    duration: '3 días · 2 noches',
    diff: 'Alta',
    cupo: '6 / 10',
    minAge: '14 años',
    price: '$340',
    lead: 'El techo de Costa Rica. Tres días de caminata por el Parque Nacional Chirripó, refugio Crestones la noche del segundo día, cumbre al amanecer. Una de las experiencias más bonitas e intensas del país — y lo hacés acompañada todo el camino.',
    blurb: 'El Chirripó no se sube de un solo tirón. Llegamos a San Gerardo el viernes en la tarde, dormimos en cabinas locales, arrancamos antes del amanecer. El primer día son 14 km hasta el refugio Crestones. El segundo día subimos a la cumbre al amanecer y bajamos. El tercero regresamos a Heredia. Llevo radios, GPS, botiquín de zona remota y un plan B para cada tramo. No improviso. Y aún así, queda tiempo para mirar las lagunas, sacar fotos y dormirse al final del día con una sonrisa.',
    itinerary: [
      { d: 'DÍA 1 · Viernes', items: ['6 AM salida desde Heredia', '11 AM almuerzo en San Isidro de El General', '2 PM check-in cabinas en San Gerardo', '4 PM charla técnica + revisión de equipo', 'Cena temprana, dormir 9 PM'] },
      { d: 'DÍA 2 · Sábado', items: ['3 AM desayuno + salida al puesto de control', '5 AM iniciamos ascenso (14 km, ~9 hrs)', '2 PM llegada al Refugio Base Crestones', '4 PM caminata corta a Las Morrenas (opcional)', 'Cena en refugio, dormir 8 PM'] },
      { d: 'DÍA 3 · Domingo', items: ['3 AM desayuno + ascenso a la cumbre', '5 AM cumbre — amanecer 3.820 m', '7 AM regreso al refugio, empacar', '8 AM bajada (14 km, ~6 hrs)', '4 PM regreso a Heredia llegando ~9 PM'] },
    ],
    incl: ['Transporte ida y vuelta desde Heredia', 'Cabinas en San Gerardo (2 noches en refugio)', 'Desayunos, almuerzos y cenas del tour', 'Guía profesional (Nancy)', 'Radios + GPS + botiquín', 'Permisos del parque (SINAC)'],
    excl: ['Bebidas alcohólicas', 'Bastones de trekking (alquiler $5/día)', 'Propinas a personal del refugio', 'Seguro de viaje (recomendado)'],
    bring: ['Botas de montaña ya probadas', 'Mochila 40-50 L', 'Saco de dormir < 0°C', 'Capa de lluvia obligatoria', 'Ropa térmica primera capa', 'Linterna frontal + baterías', 'Cantimplora 2 L mínimo', 'Bloqueador solar SPF 50+', 'Cédula o pasaporte'],
    faq: [
      ['¿Cuánta condición física se necesita?', 'Buena. Es una caminata exigente — recomiendo entrenar 1-2 meses antes con caminatas largas. No se necesita ser maratonista, pero sí caminante regular.'],
      ['¿Hay riesgo de mal de altura?', 'Algunas personas lo sienten leve sobre 3.000 m. Yo manejo el ritmo del grupo para minimizarlo. Si alguien se siente mal en serio, descendemos.'],
      ['¿Qué pasa si llueve mucho?', 'Subimos igual con equipo de lluvia. Solo cancelo si SINAC cierra el parque o hay alerta seria — en ese caso reembolso completo o reagendamos.'],
    ],
    related: ['bajos-toro', 'cavernas-venado', 'tortuguero'],
  },
  'bajos-toro': {
    title: 'Bajos del Toro',
    loc: 'Alajuela · Bosque nuboso',
    elev: '1.400 m',
    tag: 'DÍA COMPLETO',
    hero: 'img/waterfall.jpg',
    nextDate: '14 jun · sábado',
    duration: '1 día',
    diff: 'Media',
    cupo: '4 / 12',
    minAge: '12 años',
    price: '$85',
    lead: 'Una de las cataratas más fotogénicas del país, escondida en un cañón verde profundo. Caminata descendente con cuerdas en los tramos finales — vale cada paso.',
    blurb: 'Salimos temprano de Heredia, llegamos a la entrada del sendero como a las 8 AM. El descenso es de 1.5 km con cuerdas en los tramos verticales — no es técnico, pero requiere brazo y zapato cerrado. Abajo hay tiempo para nadar (¡el agua está fría!), sacar fotos, almorzar en el restaurante de la familia que mantiene el sendero. Volvemos antes de que oscurezca.',
    itinerary: [
      { d: 'MAÑANA', items: ['6 AM salida desde Heredia centro', '8 AM llegada al sendero', '8:30 AM inicio del descenso (1.5 km)', '10 AM llegada a la catarata + tiempo libre'] },
      { d: 'MEDIODÍA', items: ['12 PM almuerzo típico en restaurante local', '1:30 PM regreso al sendero', '3 PM ascenso al punto de salida'] },
      { d: 'TARDE', items: ['4 PM parada en mirador del valle', '6 PM regreso a Heredia'] },
    ],
    incl: ['Transporte ida y vuelta', 'Almuerzo típico', 'Guía profesional', 'Cuerdas y arnés', 'Entrada al sendero'],
    excl: ['Equipo personal (mochila, ropa)', 'Bebidas extra', 'Propinas'],
    bring: ['Zapato cerrado con buena tracción', 'Ropa de cambio (te vas a mojar)', 'Capa de lluvia', 'Bloqueador + repelente', 'Bolsa para basura propia'],
    faq: [
      ['¿Qué tan difícil es el descenso?', 'Es media. Hay cuerdas pero no se necesita experiencia previa — te explico todo antes. Si no estás cómoda con las cuerdas, podés esperar arriba.'],
      ['¿Se puede ir con niños?', 'Desde 12 años con buena condición. Más chicos no, las cuerdas requieren brazo.'],
    ],
    related: ['chirripo', 'cavernas-venado', 'ballenas-uvita'],
  },
  'tortuguero': {
    title: 'Tortuguero',
    loc: 'Limón · Caribe Norte',
    elev: 'Nivel del mar',
    tag: '2 DÍAS · 1 NOCHE',
    hero: 'img/boat-tour.jpg',
    nextDate: '21 — 22 jun · sáb-dom',
    duration: '2 días · 1 noche',
    diff: 'Baja',
    cupo: '2 / 14',
    minAge: 'Sin límite',
    price: '$220',
    lead: 'Canales caribeños, fauna abundante, lancha y lodge sencillo. El tour perfecto para tercera edad o familias — no se camina mucho, se mira y se respira.',
    blurb: 'Salimos sábado temprano de Heredia, transbordamos en La Pavona a la lancha que nos lleva al pueblo. Lodge sencillo pero limpio frente al canal. Tour de canales en la tarde (caimanes, monos, pájaros), cena tipica caribeña. Domingo en la mañana otra ronda de canales y caminata corta por el sendero del Cerro. Regresamos a Heredia llegando antes de noche.',
    itinerary: [
      { d: 'DÍA 1 · Sábado', items: ['5 AM salida Heredia', '10 AM transbordo a lancha en La Pavona', '12 PM llegada al lodge + almuerzo', '3 PM tour de canales en lancha', '7 PM cena caribeña'] },
      { d: 'DÍA 2 · Domingo', items: ['5:30 AM tour de canales al amanecer (mejor fauna)', '8 AM desayuno', '10 AM caminata sendero Cerro Tortuguero', '12 PM almuerzo + checkout', '2 PM regreso a Heredia llegando ~7 PM'] },
    ],
    incl: ['Transporte completo (bus + lancha)', 'Una noche en lodge', '4 comidas', 'Dos tours de canales', 'Guía + propinas básicas'],
    excl: ['Bebidas alcohólicas', 'Tour nocturno opcional ($15)', 'Tour de tortugas en temporada ($30)'],
    bring: ['Repelente fuerte (mucho mosquito)', 'Bloqueador SPF 50', 'Ropa ligera + capa de lluvia', 'Zapato cómodo'],
    faq: [
      ['¿Es bueno para tercera edad?', 'Excelente. Casi no se camina. Las lanchas tienen sombra y el lodge es de un solo piso.'],
      ['¿Se ven tortugas?', 'En temporada (julio-octubre) sí, con tour adicional nocturno. Fuera de temporada vemos los nidos vacíos pero no el desove.'],
    ],
    related: ['ballenas-uvita', 'chirripo', 'bajos-toro'],
  },
  // Generic stub for any other slug
  'default': {
    title: 'Tour',
    loc: 'Costa Rica',
    elev: '—',
    tag: 'TOUR',
    hero: 'img/chirripo-lakes.jpg',
    nextDate: 'Próxima fecha pendiente',
    duration: '—',
    diff: '—',
    cupo: '—',
    minAge: '—',
    price: 'Consultá',
    lead: 'Información detallada del tour próximamente. Mientras tanto, hablemos por WhatsApp y te cuento.',
    blurb: 'Este tour está siendo actualizado. Contactame para más información o consultá el catálogo completo.',
    itinerary: [],
    incl: [],
    excl: [],
    bring: [],
    faq: [],
    related: ['chirripo', 'bajos-toro', 'tortuguero'],
  },
};

function TourDetailPage() {
  // Read tour ID from URL once on mount
  const tourId = React.useMemo(() => {
    if (typeof window === 'undefined') return 'chirripo';
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'chirripo';
  }, []);
  const tour = TOURS[tourId] || TOURS.default;

  return (
    <div className="nt-frame nt-dir-b" style={{ position: 'relative', background: '#faf5e7' }}>
      <NTNav active="tours" />

      {/* ── Hero ──────────────────────────────────────── */}
      <section style={tdStyles.hero}>
        <div className="nt-photo" style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${tour.hero})`,
          backgroundSize: 'cover', backgroundPosition: 'center 35%',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,13,10,0.4) 0%, rgba(13,13,10,0.92) 100%)' }} />
        <div style={tdStyles.heroInner}>
          <a href="tours.html" style={tdStyles.crumb}>← Todos los tours</a>
          <div style={tdStyles.heroEye}><span style={tdStyles.dot} />{tour.tag}</div>
          <h1 style={tdStyles.heroH1}>{tour.title}</h1>
          <div style={tdStyles.heroMeta}>
            <span><strong>{tour.loc}</strong></span>
            <span style={tdStyles.dot2} />
            <span>{tour.elev}</span>
            <span style={tdStyles.dot2} />
            <span>{tour.diff} · {tour.duration}</span>
          </div>
        </div>
      </section>

      {/* ── Body: description left, booking card right ── */}
      <section style={tdStyles.body}>
        <div style={tdStyles.bodyMain}>
          <p style={tdStyles.lead}>{tour.lead}</p>
          <p style={tdStyles.blurb}>{tour.blurb}</p>

          {tour.itinerary.length > 0 && (
            <>
              <h2 style={tdStyles.h2}>Itinerario</h2>
              {tour.itinerary.map((day, i) => (
                <div key={i} style={tdStyles.dayBlock}>
                  <div style={tdStyles.dayLabel}>{day.d}</div>
                  <ul style={tdStyles.dayList}>
                    {day.items.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </>
          )}

          {tour.incl.length > 0 && (
            <>
              <h2 style={tdStyles.h2}>Qué incluye / qué no</h2>
              <div style={tdStyles.inclGrid}>
                <div>
                  <h3 style={tdStyles.h3incl}>✓ Incluido</h3>
                  <ul style={tdStyles.checkList}>{tour.incl.map((x, i) => <li key={i}>{x}</li>)}</ul>
                </div>
                <div>
                  <h3 style={{ ...tdStyles.h3incl, color: '#b5532e' }}>✗ No incluido</h3>
                  <ul style={tdStyles.checkList}>{tour.excl.map((x, i) => <li key={i}>{x}</li>)}</ul>
                </div>
              </div>
            </>
          )}

          {tour.bring.length > 0 && (
            <>
              <h2 style={tdStyles.h2}>Qué llevar</h2>
              <ul style={tdStyles.bringList}>
                {tour.bring.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </>
          )}

          {tour.faq.length > 0 && (
            <>
              <h2 style={tdStyles.h2}>Preguntas frecuentes</h2>
              {tour.faq.map(([q, a], i) => (
                <div key={i} style={tdStyles.faqItem}>
                  <h3 style={tdStyles.faqQ}>{q}</h3>
                  <p style={tdStyles.faqA}>{a}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Booking card — sticky on desktop */}
        <aside style={tdStyles.bookCard}>
          <div style={tdStyles.bookTag}>PRÓXIMA SALIDA</div>
          <div style={tdStyles.bookDate}>{tour.nextDate}</div>

          <div style={tdStyles.bookMetaGrid}>
            <div><span style={tdStyles.metaK}>DURACIÓN</span><span style={tdStyles.metaV}>{tour.duration}</span></div>
            <div><span style={tdStyles.metaK}>NIVEL</span><span style={tdStyles.metaV}>{tour.diff}</span></div>
            <div><span style={tdStyles.metaK}>CUPO</span><span style={tdStyles.metaV}>{tour.cupo}</span></div>
            <div><span style={tdStyles.metaK}>EDAD MÍN.</span><span style={tdStyles.metaV}>{tour.minAge}</span></div>
          </div>

          <div style={tdStyles.priceBlock}>
            <span style={tdStyles.metaK}>POR PERSONA</span>
            <strong style={tdStyles.price}>{tour.price}</strong>
          </div>

          <a href="https://wa.me/50689494655" className="nt-btn nt-btn-wa" style={{
            width: '100%', justifyContent: 'center',
            padding: '16px 0', fontSize: 14, marginBottom: 10,
          }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', color: '#25D366', fontSize: 11, fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>w</span>
            Reservar por WhatsApp
          </a>
          <a href="contacto.html" className="nt-btn nt-btn-ghost" style={{
            width: '100%', justifyContent: 'center', padding: '15px 0', fontSize: 14,
          }}>
            Formulario de reserva →
          </a>

          <div style={tdStyles.bookHint}>
            Apartá con 50% (SINPE / depósito).<br/>El saldo el día del tour.
          </div>
        </aside>
      </section>

      {/* ── Related tours ─────────────────────────────── */}
      {tour.related.length > 0 && (
        <section style={tdStyles.relatedSection}>
          <div style={tdStyles.formEye}>★ &nbsp;TAMBIÉN TE PUEDE GUSTAR</div>
          <h2 style={{ ...tdStyles.h2, color: '#faf5e7', marginTop: 8 }}>Otros tours en la misma onda</h2>
          <div style={tdStyles.relatedGrid}>
            {tour.related.map(slug => {
              const r = TOURS[slug] || TOURS.default;
              return (
                <a key={slug} href={`tour-detail.html?id=${slug}`} style={tdStyles.relCard}>
                  <div className="nt-photo" style={{ height: 220, backgroundImage: `url(${r.hero})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <span style={tdStyles.relTag}>{r.tag}</span>
                  </div>
                  <div style={tdStyles.relBody}>
                    <h3 style={tdStyles.relTitle}>{r.title}</h3>
                    <div style={{ fontSize: 13, color: 'rgba(250,245,231,0.7)', marginTop: 4 }}>{r.loc}</div>
                    <div style={tdStyles.relFoot}>
                      <strong style={{ color: '#b5532e' }}>{r.price}</strong>
                      <span style={{ color: 'rgba(250,245,231,0.7)' }}>{r.duration}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <NTFooter />

      <a href="https://wa.me/50689494655" className="nt-wa-float" style={{ position: 'fixed', right: 28, bottom: 28 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.1-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1.1 2.8.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.9 3.3 1.4 5.2 1.4 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
      </a>
    </div>
  );
}

const tdStyles = {
  hero: { position: 'relative', minHeight: '80vh', overflow: 'hidden' },
  heroInner: { position: 'absolute', bottom: 80, left: 48, color: '#faf5e7', maxWidth: 800 },
  crumb: {
    display: 'inline-block', fontSize: 13, color: 'rgba(250,245,231,0.8)',
    textDecoration: 'none', marginBottom: 18, fontWeight: 500,
  },
  heroEye: {
    fontSize: 11, letterSpacing: '0.22em', fontWeight: 700,
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '8px 14px', border: '1px solid rgba(250,245,231,0.3)', borderRadius: 999,
    marginBottom: 20, color: '#b5532e', background: 'rgba(13,13,10,0.4)',
  },
  dot: { width: 7, height: 7, borderRadius: '50%', background: '#b5532e' },
  heroH1: {
    fontFamily: 'Bricolage Grotesque, sans-serif',
    fontSize: 120, lineHeight: 0.9, fontWeight: 800, letterSpacing: '-0.04em',
    margin: 0, color: '#faf5e7',
  },
  heroMeta: {
    marginTop: 24, fontSize: 16, color: 'rgba(250,245,231,0.85)',
    display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
  },
  dot2: { width: 4, height: 4, borderRadius: '50%', background: '#b5532e' },

  body: {
    padding: '80px 48px',
    display: 'grid', gridTemplateColumns: '7fr 4fr', gap: 64,
    background: '#faf5e7', maxWidth: 1280, margin: '0 auto', alignItems: 'flex-start',
  },
  bodyMain: { color: '#1a160e' },
  lead: {
    fontFamily: 'Bricolage Grotesque, sans-serif',
    fontSize: 22, lineHeight: 1.5, color: '#1a160e', fontWeight: 400,
    marginTop: 0,
  },
  blurb: { fontSize: 16, lineHeight: 1.7, color: '#3a3328', marginTop: 24 },
  h2: {
    fontFamily: 'Bricolage Grotesque, sans-serif',
    fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em',
    color: '#1a160e', marginTop: 56, marginBottom: 20,
  },
  dayBlock: { paddingTop: 24, borderTop: '1px solid rgba(31,58,43,0.1)', marginBottom: 0 },
  dayLabel: {
    fontSize: 11, letterSpacing: '0.22em', fontWeight: 700,
    color: '#b5532e', marginBottom: 12,
  },
  dayList: { fontSize: 15, lineHeight: 1.8, color: '#1a160e', paddingLeft: 18, margin: '0 0 28px' },

  inclGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 },
  h3incl: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 700,
    color: '#1f3a2b', margin: '0 0 12px',
  },
  checkList: {
    fontSize: 14, lineHeight: 1.8, color: '#3a3328', paddingLeft: 0, margin: 0, listStyle: 'none',
  },
  bringList: {
    fontSize: 14, lineHeight: 1.8, color: '#3a3328',
    columnCount: 2, columnGap: 32,
    paddingLeft: 18,
  },

  faqItem: { paddingTop: 22, paddingBottom: 22, borderTop: '1px solid rgba(31,58,43,0.1)' },
  faqQ: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 700, color: '#1a160e', margin: '0 0 8px' },
  faqA: { fontSize: 14, lineHeight: 1.7, color: '#3a3328', margin: 0 },

  bookCard: {
    background: '#fff', border: '1px solid rgba(31,58,43,0.12)',
    padding: 32, position: 'sticky', top: 100,
  },
  bookTag: { fontSize: 10, letterSpacing: '0.22em', fontWeight: 700, color: '#b5532e', marginBottom: 8 },
  bookDate: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 800,
    letterSpacing: '-0.02em', color: '#1a160e', marginBottom: 28,
  },
  bookMetaGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px',
    paddingBottom: 24, borderBottom: '1px solid rgba(31,58,43,0.1)',
  },
  metaK: {
    display: 'block', fontSize: 9, letterSpacing: '0.18em', fontWeight: 700,
    color: '#6b6256', fontFamily: 'Bricolage Grotesque, sans-serif', marginBottom: 3,
  },
  metaV: { display: 'block', fontSize: 14, fontWeight: 600, color: '#1a160e' },
  priceBlock: { padding: '24px 0', display: 'flex', flexDirection: 'column' },
  price: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 56, fontWeight: 800,
    letterSpacing: '-0.04em', color: '#b5532e', lineHeight: 1, marginTop: 6,
  },
  bookHint: { fontSize: 12, color: '#6b6256', marginTop: 14, lineHeight: 1.6 },

  relatedSection: { background: '#1a160e', color: '#faf5e7', padding: '80px 48px' },
  formEye: { fontSize: 11, letterSpacing: '0.22em', fontWeight: 700, color: '#b5532e' },
  relatedGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40 },
  relCard: {
    background: 'rgba(250,245,231,0.04)', border: '1px solid rgba(250,245,231,0.12)',
    overflow: 'hidden', color: '#faf5e7', textDecoration: 'none',
    display: 'flex', flexDirection: 'column',
  },
  relTag: {
    position: 'absolute', top: 14, left: 14,
    background: '#b5532e', color: '#faf5e7',
    fontSize: 9, fontWeight: 800, letterSpacing: '0.18em',
    padding: '5px 9px', fontFamily: 'Bricolage Grotesque, sans-serif',
  },
  relBody: { padding: 22, display: 'flex', flexDirection: 'column', gap: 18, flex: 1 },
  relTitle: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 22, fontWeight: 800,
    letterSpacing: '-0.02em', color: '#faf5e7', margin: 0, lineHeight: 1.1,
  },
  relFoot: {
    marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(250,245,231,0.1)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 700,
  },
};

window.TourDetailPage = TourDetailPage;
