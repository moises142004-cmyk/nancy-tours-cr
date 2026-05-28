// Direction A · "Editorial Earth"
// ───────────────────────────────────────────────────────────
// Magazine layout. Cream paper, generous whitespace, italic
// serif headlines, asymmetric grid, photos treated as plates.
// Reads as confident and warm — Nancy as guide/storyteller.

function HomeDirectionA({ density = 1 }) {
  const s = stylesA(density);
  return (
    <div className="nt-frame nt-dir-a" style={s.root}>
      {/* ── Top utility bar ───────────────────────────── */}
      <div style={s.utilBar}>
        <span>ICT en trámite · Heredia, CR</span>
        <span style={{ display: 'flex', gap: 18 }}>
          <strong>ES</strong>
          <span style={{ opacity: 0.5 }}>EN</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>+506 8949-4655</span>
        </span>
      </div>

      {/* ── Nav ───────────────────────────────────────── */}
      <header style={s.nav}>
        <a style={s.logo}>
          <svg viewBox="0 0 36 36" width="32" height="32"><polygon points="18,5 32,29 4,29" fill="none" stroke="#1f3a2b" strokeWidth="2"/><polygon points="18,11 28,27 8,27" fill="#b5532e"/></svg>
          <span><em style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontStyle: 'italic' }}>Nancy</em> <small style={{ letterSpacing: '0.24em', fontSize: 10, fontWeight: 700, marginLeft: 4 }}>TOURS · CR</small></span>
        </a>
        <nav style={s.navLinks}>
          <a>Tours</a>
          <a>Sobre Nancy</a>
          <a>Galería</a>
          <a>Contacto</a>
        </nav>
        <a className="nt-btn nt-btn-primary" style={{ padding: '12px 20px', fontSize: 13 }}>Reservar tour</a>
      </header>

      {/* ── Hero ──────────────────────────────────────── */}
      <section style={s.hero}>
        <div style={s.heroText}>
          <div className="nt-eyebrow" style={{ color: '#b5532e' }}>Tours guiados · Costa Rica</div>
          <h1 style={s.heroH1}>
            Caminemos<br/>
            <em style={{ color: '#b5532e' }}>Costa Rica</em><br/>
            juntos.
          </h1>
          <p style={s.heroLead}>
            Quince años recorriendo cada volcán, río, bosque y catarata del país.
            Te llevo a los lugares que solo los locales conocemos — con guía profesional,
            radios, GPS y la paciencia que un buen tour necesita.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <a className="nt-btn nt-btn-primary">Ver próximos tours →</a>
            <a className="nt-btn nt-btn-ghost">WhatsApp directo</a>
          </div>

          <div style={s.heroMeta}>
            <div><strong>15</strong><span>años guiando</span></div>
            <div><strong>200+</strong><span>tours realizados</span></div>
            <div><strong>4.9</strong><span>en reseñas</span></div>
          </div>
        </div>

        <div style={s.heroMedia}>
          <div style={{ ...s.heroPhoto, backgroundImage: 'url(img/chirripo-lakes.jpg)' }}>
            <div style={s.videoBadge}>
              <span style={s.playDot}>▶</span>
              <span style={{ fontSize: 11, letterSpacing: '0.16em', fontWeight: 600 }}>VIDEO AÉREO · 0:42</span>
            </div>
          </div>
          <div style={s.heroCaption}>
            <em>“Lagunas del Chirripó al amanecer.”</em><br/>
            <small>Tour Cerro Chirripó · 3 días</small>
          </div>
        </div>
      </section>

      {/* ── Differentiators strip ─────────────────────── */}
      <section style={s.diffStrip}>
        {[
          { k: '01', t: 'Lic. en Turismo', d: 'Formación profesional, no un tour-guía improvisado.' },
          { k: '02', t: '15 años de ruta', d: 'He recorrido cada provincia de Costa Rica con grupos.' },
          { k: '03', t: 'Radios + GPS', d: 'Equipo de comunicación en cada salida. Seguridad real.' },
          { k: '04', t: 'Grupos a tu ritmo', d: 'Familias, tercera edad, jóvenes — leo el grupo.' },
        ].map(d => (
          <div key={d.k} style={s.diffCell}>
            <div style={s.diffNum}>{d.k}</div>
            <div style={s.diffT}>{d.t}</div>
            <div style={s.diffD}>{d.d}</div>
          </div>
        ))}
      </section>

      {/* ── Featured tours ────────────────────────────── */}
      <section style={s.tours}>
        <div style={s.sectionHeader}>
          <div>
            <div className="nt-eyebrow" style={{ color: '#b5532e' }}>Lo que estamos haciendo</div>
            <h2 style={s.h2}>Próximos tours</h2>
          </div>
          <a style={s.viewAll}>Ver todos los tours →</a>
        </div>

        <div style={s.tourGrid}>
          <TourCard img="img/chirripo-summit.jpg" tag="Aventura · 3 días" title="Cerro Chirripó" sub="3.820 m · El techo de Costa Rica" price="$340" stylesRef={s} large />
          <TourCard img="img/waterfall.jpg" tag="Día completo" title="Bajos del Toro" sub="Catarata escondida + caminata bosque" price="$85" stylesRef={s} />
          <TourCard img="img/boat-tour.jpg" tag="2 días · 1 noche" title="Tortuguero" sub="Canales, fauna y costa caribeña" price="$220" stylesRef={s} />
          <TourCard img="img/cave.jpg" tag="Día completo" title="Cavernas de Venado" tinted sub="Estalactitas y río subterráneo" price="$95" stylesRef={s} />
          <TourCard img="img/whale.jpg" tag="Temporada · Día" title="Ballenas en Uvita" sub="Avistamiento responsable · jul-oct" price="$110" stylesRef={s} />
        </div>
      </section>

      {/* ── About Nancy teaser ────────────────────────── */}
      <section style={s.about}>
        <div style={{ ...s.aboutPhoto, backgroundImage: 'url(img/chirripo-summit.jpg)' }} />
        <div style={s.aboutCopy}>
          <div className="nt-eyebrow" style={{ color: '#b5532e' }}>Conocé a tu guía</div>
          <h2 style={s.h2}>Soy Nancy.</h2>
          <p style={s.aboutP}>
            Empecé caminando los senderos de Heredia con mi familia. Hoy soy Licenciada en Turismo
            y llevo quince años guiando grupos por todo Costa Rica — desde el Chirripó al amanecer
            hasta los canales de Tortuguero. Si te llevo a un tour, lo hago como te llevaría a un
            amigo: con calma, con humor y con todo el conocimiento del país que pude juntar.
          </p>
          <p style={{ ...s.aboutP, fontStyle: 'italic', color: '#1f3a2b' }}>
            “Terminar el día cansados, pero felices — esa es la idea.”
          </p>
          <a className="nt-btn nt-btn-ghost" style={{ marginTop: 18 }}>Leer mi historia →</a>
        </div>
      </section>

      {/* ── Testimonial band ──────────────────────────── */}
      <section style={s.testi}>
        <div style={s.testiQuote}>“</div>
        <blockquote style={s.testiText}>
          Fuimos un grupo de doce personas, edades de 30 a 72. Nancy nos llevó al Chirripó
          como si fuéramos su familia. Tres días impecables. Vuelvo con ella el año entrante.
        </blockquote>
        <div style={s.testiAttr}>
          <strong>María Solís</strong>&nbsp;&nbsp;·&nbsp;&nbsp;San José · Tour Chirripó, marzo 2025
        </div>
      </section>

      {/* ── Booking CTA ───────────────────────────────── */}
      <section style={s.cta}>
        <div>
          <h2 style={{ ...s.h2, color: '#faf5e7' }}>¿Listo para salir al monte?</h2>
          <p style={{ color: 'rgba(250,245,231,0.85)', fontSize: 16, maxWidth: 520, marginTop: 12 }}>
            Mandame mensaje por WhatsApp con la fecha y cuántos van. Te armo el tour o te
            sumo a uno ya programado. SINPE móvil o depósito bancario para apartar.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 280 }}>
          <a className="nt-btn nt-btn-wa" style={{ justifyContent: 'center', padding: '18px 24px', fontSize: 15 }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', color: '#25D366', fontSize: 13, fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>w</span>
            WhatsApp · +506 8949-4655
          </a>
          <a className="nt-btn nt-btn-ghost" style={{ justifyContent: 'center', color: '#faf5e7', borderColor: '#faf5e7' }}>
            Calendario de tours abiertos →
          </a>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer style={s.footer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ ...s.logo, marginBottom: 14 }}>
              <svg viewBox="0 0 36 36" width="26" height="26"><polygon points="18,5 32,29 4,29" fill="none" stroke="#faf5e7" strokeWidth="2"/><polygon points="18,11 28,27 8,27" fill="#b5532e"/></svg>
              <span style={{ color: '#faf5e7' }}><em style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18 }}>Nancy</em> <small style={{ letterSpacing: '0.24em', fontSize: 9, fontWeight: 700 }}>TOURS · CR</small></span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(250,245,231,0.65)', lineHeight: 1.6 }}>
              Tours guiados por toda Costa Rica. Heredia, Mercedes Norte.
              ICT en trámite.
            </p>
          </div>
          <div style={s.footCol}>
            <h4>Tours</h4>
            <a>Aventura</a><a>Cultural</a><a>Tercera edad</a><a>A medida</a>
          </div>
          <div style={s.footCol}>
            <h4>Nancy</h4>
            <a>Historia</a><a>Credenciales</a><a>Galería</a><a>Reseñas</a>
          </div>
          <div style={s.footCol}>
            <h4>Contacto</h4>
            <a>WhatsApp</a><a>Email</a><a>Facebook</a><a>Instagram</a>
          </div>
        </div>
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(250,245,231,0.12)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(250,245,231,0.45)' }}>
          <span>© 2026 Nancy Tours Costa Rica</span>
          <span>nancytourscr.com</span>
        </div>
      </footer>

      <a className="nt-wa-float" title="Mensaje por WhatsApp" style={{ position: 'absolute', right: 28, bottom: 28 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.1-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1.1 2.8.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.9 3.3 1.4 5.2 1.4 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.4-.5-4.8-1.4l-.3-.2-2.9.9.9-2.8-.2-.3C3.6 14.7 3 13.4 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9z"/></svg>
      </a>
    </div>
  );
}

function TourCard({ img, tag, title, sub, price, stylesRef, large, tinted }) {
  return (
    <div style={{ ...stylesRef.tourCard, gridColumn: large ? 'span 2' : 'span 1', gridRow: large ? 'span 2' : 'span 1' }}>
      <div className="nt-photo" style={{
        ...stylesRef.tourPhoto,
        backgroundImage: `url(${img})`,
        height: large ? 360 : 220,
      }}>
        <span style={stylesRef.tourTag}>{tag}</span>
      </div>
      <div style={stylesRef.tourBody}>
        <div>
          <h3 style={stylesRef.tourTitle}>{title}</h3>
          <p style={stylesRef.tourSub}>{sub}</p>
        </div>
        <div style={stylesRef.tourFoot}>
          <span style={{ fontSize: 11, color: '#6b6256' }}>Desde</span>
          <strong style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: '#1f3a2b', lineHeight: 1, fontStyle: 'italic' }}>{price}</strong>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#b5532e', fontWeight: 600 }}>Ver tour →</span>
        </div>
      </div>
    </div>
  );
}

function stylesA(d) {
  const pad = 64 * d;
  return {
    root: { position: 'relative', display: 'flex', flexDirection: 'column' },
    utilBar: {
      background: '#1f3a2b', color: '#faf5e7',
      padding: '8px 32px', fontSize: 11, letterSpacing: '0.06em',
      display: 'flex', justifyContent: 'space-between',
    },
    nav: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 48px', borderBottom: '1px solid rgba(31,58,43,0.15)',
    },
    logo: { display: 'flex', alignItems: 'center', gap: 10, color: '#1f3a2b' },
    navLinks: {
      display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#1a160e',
    },
    hero: {
      display: 'grid', gridTemplateColumns: '5fr 6fr', gap: 56,
      padding: `${pad}px 48px ${pad}px 48px`,
    },
    heroText: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    heroH1: {
      fontFamily: 'Instrument Serif, Georgia, serif',
      fontSize: 96, lineHeight: 0.95, color: '#1f3a2b',
      margin: '20px 0 28px', fontWeight: 400, letterSpacing: '-0.01em',
    },
    heroLead: { fontSize: 17, lineHeight: 1.6, color: '#3a3328', maxWidth: 480 },
    heroMeta: {
      display: 'flex', gap: 36, marginTop: 48, paddingTop: 28,
      borderTop: '1px solid rgba(31,58,43,0.15)',
    },
    heroMediaDecor: {},
    heroMedia: { display: 'flex', flexDirection: 'column', gap: 12 },
    heroPhoto: {
      flex: 1, minHeight: 520, borderRadius: 4, position: 'relative',
      backgroundSize: 'cover', backgroundPosition: 'center',
    },
    videoBadge: {
      position: 'absolute', bottom: 20, left: 20,
      background: 'rgba(26,22,14,0.75)', backdropFilter: 'blur(8px)',
      color: '#faf5e7', padding: '10px 16px', borderRadius: 24,
      display: 'flex', alignItems: 'center', gap: 10,
    },
    playDot: {
      width: 22, height: 22, borderRadius: '50%', background: '#b5532e',
      color: '#fff', fontSize: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 2,
    },
    heroCaption: {
      fontFamily: 'Instrument Serif, serif', fontSize: 15, color: '#6b6256',
      fontStyle: 'italic', lineHeight: 1.5,
    },
    diffStrip: {
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      background: '#1f3a2b', color: '#faf5e7',
      padding: '56px 48px',
    },
    diffCell: { padding: '0 24px', borderRight: '1px solid rgba(250,245,231,0.15)' },
    diffNum: {
      fontFamily: 'Instrument Serif, serif', fontSize: 38, fontStyle: 'italic',
      color: '#b5532e', lineHeight: 1, marginBottom: 14,
    },
    diffT: { fontSize: 18, fontWeight: 600, marginBottom: 8 },
    diffD: { fontSize: 13, lineHeight: 1.5, color: 'rgba(250,245,231,0.7)' },
    tours: { padding: `${pad}px 48px` },
    sectionHeader: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      marginBottom: 40,
    },
    h2: {
      fontFamily: 'Instrument Serif, Georgia, serif',
      fontSize: 56, lineHeight: 1, color: '#1f3a2b',
      margin: '8px 0 0', fontWeight: 400, letterSpacing: '-0.01em',
    },
    viewAll: { fontSize: 14, fontWeight: 600, color: '#b5532e' },
    tourGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridAutoRows: 'min-content',
      gap: 20,
    },
    tourCard: {
      background: '#faf5e7', borderRadius: 4, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    },
    tourPhoto: { position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center' },
    tourTag: {
      position: 'absolute', top: 12, left: 12,
      background: '#faf5e7', color: '#1f3a2b',
      fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
      padding: '6px 10px', borderRadius: 2,
    },
    tourBody: { padding: 20, display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'space-between' },
    tourTitle: { fontFamily: 'Instrument Serif, serif', fontSize: 24, color: '#1f3a2b', margin: 0, lineHeight: 1.1 },
    tourSub: { fontSize: 13, color: '#6b6256', margin: '6px 0 0' },
    tourFoot: { display: 'flex', alignItems: 'baseline', gap: 10, paddingTop: 14, borderTop: '1px solid rgba(31,58,43,0.1)' },
    about: {
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56,
      background: '#1f3a2b', color: '#faf5e7', padding: `${pad}px 48px`,
    },
    aboutPhoto: { minHeight: 520, borderRadius: 4, backgroundSize: 'cover', backgroundPosition: 'center' },
    aboutCopy: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    aboutP: { fontSize: 16, lineHeight: 1.7, color: 'rgba(250,245,231,0.85)', margin: '14px 0 0' },
    testi: { padding: `${pad}px 48px`, position: 'relative', textAlign: 'center', maxWidth: 900, margin: '0 auto' },
    testiQuote: {
      fontFamily: 'Instrument Serif, serif', fontSize: 200, color: '#b5532e',
      lineHeight: 1, marginBottom: -40, opacity: 0.4,
    },
    testiText: {
      fontFamily: 'Instrument Serif, serif', fontSize: 32, lineHeight: 1.4,
      color: '#1f3a2b', fontStyle: 'italic', margin: 0,
    },
    testiAttr: { marginTop: 32, fontSize: 13, color: '#6b6256', letterSpacing: '0.04em' },
    cta: {
      display: 'flex', justifyContent: 'space-between', gap: 56, alignItems: 'center',
      background: '#b5532e', color: '#faf5e7',
      padding: `${pad}px 48px`,
    },
    footer: {
      background: '#1a160e', color: '#faf5e7',
      padding: '64px 48px 32px',
    },
    footCol: {
      display: 'flex', flexDirection: 'column', gap: 8,
      fontSize: 13, color: 'rgba(250,245,231,0.7)',
    },
  };
}

window.HomeDirectionA = HomeDirectionA;
