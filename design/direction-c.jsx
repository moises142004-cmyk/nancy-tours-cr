// Direction C · "Folk Mural"
// ───────────────────────────────────────────────────────────
// Inspired by the Volcán Poás mural in Nancy's FB cover —
// hand-illustrated botanicals, mustard/cream paper feel,
// DM Serif Display + Work Sans, crafty + artisanal.

function HomeDirectionC({ density = 1 }) {
  const s = stylesC(density);
  return (
    <div className="nt-frame nt-dir-c" style={s.root}>

      {/* Decorative botanical SVG repeats throughout */}
      <BotanicalDefs />

      {/* ── Announcement ribbon ───────────────────────── */}
      <div style={s.ribbon}>
        <span style={s.ribbonDot}>●</span>
        Próximo tour abierto&nbsp;·&nbsp;<strong>Bajos del Toro</strong>&nbsp;·&nbsp;sábado 14 de junio · 4 cupos
        <span style={{ marginLeft: 16, opacity: 0.7 }}>WhatsApp →</span>
      </div>

      {/* ── Nav ───────────────────────────────────────── */}
      <header style={s.nav}>
        <a style={s.logo}>
          <svg viewBox="0 0 64 64" width="44" height="44">
            <circle cx="32" cy="32" r="30" fill="none" stroke="#1f3a2b" strokeWidth="1.5" />
            <circle cx="32" cy="32" r="26" fill="none" stroke="#1f3a2b" strokeWidth="0.5" />
            <path d="M10 36 Q 22 22 32 32 Q 42 42 54 32" stroke="#b5532e" strokeWidth="1.5" fill="none"/>
            <text x="32" y="29" textAnchor="middle" fontFamily="DM Serif Display, serif" fontSize="11" fontStyle="italic" fill="#1f3a2b">Nancy</text>
            <text x="32" y="40" textAnchor="middle" fontFamily="Work Sans, sans-serif" fontSize="5" letterSpacing="0.3em" fontWeight="700" fill="#1f3a2b">TOURS · CR</text>
          </svg>
        </a>
        <nav style={s.navLinks}>
          <a>Tours</a>
          <a>Sobre Nancy</a>
          <a>Galería</a>
          <a>Contacto</a>
        </nav>
        <div style={s.navRight}>
          <span style={s.lang}>ES · <span style={{ opacity: 0.45 }}>EN</span></span>
          <a className="nt-btn nt-btn-primary" style={{ padding: '11px 18px', borderRadius: 999, fontSize: 13 }}>Reservar</a>
        </div>
      </header>

      {/* ── Hero — mural style ────────────────────────── */}
      <section style={s.hero}>
        {/* botanical decorations */}
        <svg style={s.heroLeaves} viewBox="0 0 400 600" preserveAspectRatio="xMinYMid meet">
          <use href="#leaf-fern" x="20" y="60" />
          <use href="#leaf-fern" x="-30" y="220" />
          <use href="#leaf-mono" x="50" y="380" />
          <use href="#flower-1" x="100" y="500" />
        </svg>
        <svg style={s.heroLeavesR} viewBox="0 0 400 600" preserveAspectRatio="xMaxYMid meet">
          <use href="#leaf-bird-paradise" x="220" y="40" />
          <use href="#leaf-fern" x="290" y="280" transform="scale(-1,1) translate(-580 0)" />
          <use href="#flower-1" x="240" y="460" />
        </svg>

        <div style={s.heroInner}>
          <div style={s.heroEye}>
            <span style={s.heroEyeLine} />
            DESDE HEREDIA · COSTA RICA
            <span style={s.heroEyeLine} />
          </div>

          <h1 style={s.heroH1}>
            Vamos a caminar<br/>
            <em style={s.heroEm}>Costa&nbsp;Rica</em>
          </h1>

          <p style={s.heroLead}>
            Tours guiados por Nancy. Quince años recorriendo volcanes, ríos,
            bosques y cataratas. Grupos pequeños, equipo profesional, rutas
            que solo los locales conocemos.
          </p>

          <div style={s.heroCtas}>
            <a className="nt-btn nt-btn-primary" style={{ borderRadius: 999, padding: '16px 28px' }}>Ver próximos tours</a>
            <a style={s.heroLink}>
              <span style={s.heroLinkDot}>▶</span> Mirá el video aéreo · 0:42
            </a>
          </div>

          {/* hero photo grid below */}
          <div style={s.heroPhotos}>
            <div className="nt-photo" style={{ ...s.heroPhoto, ...s.heroPhotoA, backgroundImage: 'url(img/chirripo-lakes.jpg)' }}>
              <span style={s.heroPhotoTag}>Lagunas del Chirripó</span>
            </div>
            <div className="nt-photo" style={{ ...s.heroPhoto, ...s.heroPhotoB, backgroundImage: 'url(img/waterfall.jpg)' }}>
              <span style={s.heroPhotoTag}>Bajos del Toro</span>
            </div>
            <div className="nt-photo" style={{ ...s.heroPhoto, ...s.heroPhotoC, backgroundImage: 'url(img/foggy-bridge.jpg)' }}>
              <span style={s.heroPhotoTag}>Puente colgante</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Differentiator chips ──────────────────────── */}
      <section style={s.chipsRow}>
        {[
          { ic: <ChipIcon kind="diploma" />, k: 'Lic. en Turismo', v: 'Credencial formal' },
          { ic: <ChipIcon kind="boot" />,    k: '15 años en ruta', v: 'Cada provincia recorrida' },
          { ic: <ChipIcon kind="radio" />,   k: 'Radios + GPS',    v: 'Seguridad en cada tour' },
          { ic: <ChipIcon kind="group" />,   k: 'A tu ritmo',      v: 'Familias, adultos, jóvenes' },
        ].map((c, i) => (
          <div key={i} style={s.chip}>
            <div style={s.chipIc}>{c.ic}</div>
            <div>
              <div style={s.chipK}>{c.k}</div>
              <div style={s.chipV}>{c.v}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Featured tours ────────────────────────────── */}
      <section style={s.tours}>
        <div style={s.sectionHead}>
          <span style={s.sectNum}>◆ &nbsp; LO QUE VIENE &nbsp; ◆</span>
          <h2 style={s.h2}>Tours abiertos</h2>
          <p style={s.h2Sub}>
            Salidas grupales con cupo. ¿Querés algo a medida? Te lo armo.
          </p>
        </div>

        <div style={s.tourGrid}>
          <TourCardC img="img/chirripo-summit.jpg" title="Cerro Chirripó" loc="Pérez Zeledón" tag="AVENTURA" date="13 — 15 jun" cupo="6 / 10" price="$340" />
          <TourCardC img="img/waterfall.jpg" title="Bajos del Toro" loc="Alajuela" tag="DÍA" date="14 jun · sáb" cupo="4 / 12" price="$85" />
          <TourCardC img="img/boat-tour.jpg" title="Tortuguero" loc="Limón" tag="2 DÍAS" date="21 — 22 jun" cupo="2 / 14" price="$220" />
          <TourCardC img="img/cave.jpg" title="Cavernas de Venado" loc="San Carlos" tag="DÍA" date="28 jun · sáb" cupo="8 / 12" price="$95" />
          <TourCardC img="img/whale.jpg" title="Ballenas en Uvita" loc="Pacífico Sur" tag="TEMPORADA" date="12 jul · sáb" cupo="10 / 16" price="$110" />
          <TourCardC img="img/chirripo-sign.jpg" title="A tu medida" loc="Donde quieras" tag="A MEDIDA" date="Coordiná fecha" cupo="—" price="Consultá" custom />
        </div>
      </section>

      {/* ── Nancy intro — handwritten note style ──────── */}
      <section style={s.nancy}>
        <div style={s.nancyDecor}>
          <svg viewBox="0 0 200 200" width="200" height="200">
            <use href="#leaf-bird-paradise" x="20" y="20" />
          </svg>
        </div>
        <div style={s.nancyCard}>
          <div style={s.nancyEye}>HOLA, SOY ↓</div>
          <h2 style={s.nancyH2}>Nancy.</h2>
          <p style={s.nancyP}>
            Nací en Heredia y crecí caminando los senderos del Volcán Barva con
            mi familia. Estudié turismo en la universidad — soy <em>Licenciada</em>
            con todas las letras — y hace quince años decidí dedicarme a llevar
            grupos a conocer el país que tanto amo.
          </p>
          <p style={s.nancyP}>
            He estado en cada provincia, en lugares que ni Google Maps
            encuentra. Si vas conmigo, vas con radio, GPS, y con alguien que
            ya hizo el camino antes. Mi promesa es simple:
          </p>
          <p style={s.nancyQuote}>
            “Terminar el día cansados, pero felices.”
          </p>
          <div style={s.nancySig}>
            <svg width="120" height="40" viewBox="0 0 120 40">
              <path d="M 5 28 Q 15 8 25 22 Q 32 32 40 18 Q 48 6 58 24 Q 64 32 72 16 Q 84 4 100 22 Q 108 30 115 18"
                stroke="#1f3a2b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 12, color: '#6b6256', marginLeft: 8 }}>Nancy Villalobos, Lic. Turismo</span>
          </div>
        </div>
        <div style={{ ...s.nancyPhoto, backgroundImage: 'url(img/chirripo-summit.jpg)' }} />
      </section>

      {/* ── Reviews — postcard band ───────────────────── */}
      <section style={s.reviewsBand}>
        <div style={s.sectionHead}>
          <span style={s.sectNum}>◆ &nbsp; LO QUE DICEN &nbsp; ◆</span>
          <h2 style={{ ...s.h2, color: '#faf5e7' }}>Cuatro punto nueve estrellas, &nbsp;478 seguidores, y contando.</h2>
        </div>
        <div style={s.reviewsRow}>
          <Postcard name="María Solís" loc="San José · Chirripó" quote="Fuimos 12 personas entre 30 y 72 años. Nancy nos llevó al Chirripó como si fuéramos su familia." />
          <Postcard name="Carlos Vargas" loc="Heredia · Tortuguero" quote="Excelente organización, mi mamá tiene 70 y disfrutó cada minuto. Volvemos sin duda." />
          <Postcard name="Ana Cordero" loc="Cartago · Bajos del Toro" quote="Las fotos quedaron de revista. Nancy sabe cada vista buena del camino." />
        </div>
      </section>

      {/* ── Final CTA — letter style ──────────────────── */}
      <section style={s.letter}>
        <svg style={s.letterLeavesL} viewBox="0 0 200 400">
          <use href="#leaf-mono" x="0" y="80" />
          <use href="#flower-1" x="40" y="280" />
        </svg>
        <svg style={s.letterLeavesR} viewBox="0 0 200 400">
          <use href="#leaf-fern" x="40" y="20" transform="scale(-1,1) translate(-280 0)" />
          <use href="#leaf-bird-paradise" x="0" y="200" />
        </svg>

        <div style={s.letterInner}>
          <div style={s.sectNum}>◆ &nbsp; ESCRIBÍME &nbsp; ◆</div>
          <h2 style={s.letterH2}>¿Salimos al monte?</h2>
          <p style={s.letterP}>
            Mandame mensaje por WhatsApp con la fecha, cuántos van, y qué
            tienen ganas de hacer. Te respondo el mismo día.
          </p>
          <div style={s.letterCtas}>
            <a className="nt-btn nt-btn-wa" style={{ borderRadius: 999, padding: '18px 28px', fontSize: 15 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', color: '#25D366', fontSize: 11, fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>w</span>
              WhatsApp · +506 8949-4655
            </a>
            <a style={s.letterMail}>hola@nancytourscr.com →</a>
          </div>
          <div style={s.payments}>
            Apartá tu cupo con&nbsp;<strong>SINPE móvil</strong>&nbsp;o&nbsp;<strong>depósito bancario</strong>&nbsp;(BN / BAC)
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer style={s.footer}>
        <div style={s.footTop}>
          <div>
            <svg viewBox="0 0 64 64" width="56" height="56">
              <circle cx="32" cy="32" r="30" fill="none" stroke="#faf5e7" strokeWidth="1.5" />
              <path d="M10 36 Q 22 22 32 32 Q 42 42 54 32" stroke="#b5532e" strokeWidth="1.5" fill="none"/>
              <text x="32" y="29" textAnchor="middle" fontFamily="DM Serif Display, serif" fontSize="11" fontStyle="italic" fill="#faf5e7">Nancy</text>
              <text x="32" y="40" textAnchor="middle" fontFamily="Work Sans, sans-serif" fontSize="5" letterSpacing="0.3em" fontWeight="700" fill="#faf5e7">TOURS · CR</text>
            </svg>
            <p style={{ fontSize: 13, color: 'rgba(250,245,231,0.6)', maxWidth: 280, marginTop: 16, lineHeight: 1.6 }}>
              Tours guiados por toda Costa Rica.<br/>Heredia, Mercedes Norte. ICT en trámite.
            </p>
          </div>
          <div style={s.footCols}>
            <div style={s.footCol}><h4>Tours</h4><a>Aventura</a><a>Cultural</a><a>Tercera edad</a><a>A medida</a></div>
            <div style={s.footCol}><h4>Nancy</h4><a>Historia</a><a>Credenciales</a><a>Reseñas</a></div>
            <div style={s.footCol}><h4>Contacto</h4><a>WhatsApp</a><a>Email</a><a>Instagram</a><a>Facebook</a></div>
          </div>
        </div>
        <div style={s.footBot}>
          <span>© 2026 Nancy Tours Costa Rica</span>
          <span style={{ fontStyle: 'italic', fontFamily: 'DM Serif Display, serif', fontSize: 15 }}>Pura vida.</span>
          <span>nancytourscr.com</span>
        </div>
      </footer>

      <a className="nt-wa-float" style={{ position: 'absolute', right: 28, bottom: 28 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.1-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1.1 2.8.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.9 3.3 1.4 5.2 1.4 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.4-.5-4.8-1.4l-.3-.2-2.9.9.9-2.8-.2-.3C3.6 14.7 3 13.4 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9z"/></svg>
      </a>
    </div>
  );
}

function TourCardC({ img, title, loc, tag, date, cupo, price, custom }) {
  return (
    <div style={{
      background: '#faf5e7', borderRadius: 4, overflow: 'hidden',
      border: '1px solid rgba(31,58,43,0.08)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div className="nt-photo" style={{
        height: 200, backgroundImage: `url(${img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative',
        ...(custom ? { filter: 'grayscale(0.4) sepia(0.2)' } : {}),
      }}>
        <span style={{
          position: 'absolute', top: 14, left: 14,
          padding: '6px 10px',
          background: custom ? '#1f3a2b' : '#b5532e', color: '#faf5e7',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
          borderRadius: 2,
        }}>{tag}</span>
      </div>
      <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div>
          <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: '#1f3a2b', margin: 0, lineHeight: 1.1 }}>{title}</h3>
          <div style={{ fontSize: 12, color: '#6b6256', marginTop: 4, letterSpacing: '0.04em' }}>{loc}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#1a160e' }}>
          <span><strong style={{ display: 'block', fontSize: 10, letterSpacing: '0.16em', color: '#6b6256', fontWeight: 700 }}>FECHA</strong>{date}</span>
          <span><strong style={{ display: 'block', fontSize: 10, letterSpacing: '0.16em', color: '#6b6256', fontWeight: 700 }}>CUPO</strong>{cupo}</span>
        </div>
        <div style={{ paddingTop: 14, borderTop: '1px dashed rgba(31,58,43,0.18)', display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#6b6256' }}>desde</span>
          <strong style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, color: '#b5532e', fontStyle: 'italic' }}>{price}</strong>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#1f3a2b', fontWeight: 700 }}>Reservar →</span>
        </div>
      </div>
    </div>
  );
}

function Postcard({ name, loc, quote }) {
  return (
    <div style={{
      background: '#faf5e7', color: '#1a160e',
      padding: 28, borderRadius: 2,
      transform: 'rotate(-0.4deg)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: '#b5532e', lineHeight: 1 }}>“</div>
      <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>{quote}</p>
      <div style={{ paddingTop: 14, borderTop: '1px dashed rgba(31,58,43,0.2)' }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>{name}</div>
        <div style={{ fontSize: 11, color: '#6b6256', marginTop: 2 }}>{loc}</div>
      </div>
    </div>
  );
}

function ChipIcon({ kind }) {
  const c = '#b5532e';
  switch (kind) {
    case 'diploma':
      return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.6"><rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 17v4l4-2 4 2v-4"/><circle cx="12" cy="10" r="2.2"/></svg>;
    case 'boot':
      return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.6"><path d="M6 4v11h4l3 4h7v-4l-4-3v-2H10V4z"/><path d="M6 9h4"/></svg>;
    case 'radio':
      return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.6"><rect x="6" y="6" width="6" height="14" rx="1"/><circle cx="9" cy="15" r="1.4"/><path d="M14 8l3-3M14 13l5-2M14 18l4 2"/></svg>;
    case 'group':
      return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.6"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="11" r="2.4"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M14 19c0-2.4 2-4 4-4s3 1 3 3"/></svg>;
    default:
      return null;
  }
}

function BotanicalDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* fern frond — feathery */}
        <g id="leaf-fern">
          <path d="M 50 0 Q 55 100 50 200" stroke="#1f3a2b" strokeWidth="1.5" fill="none" />
          {[...Array(16)].map((_, i) => {
            const y = 12 + i * 11;
            const len = Math.max(6, 40 - Math.abs(i - 6) * 3);
            return (
              <g key={i}>
                <path d={`M 50 ${y} Q ${50 - len/2} ${y - 4} ${50 - len} ${y}`} stroke="#2d4a35" strokeWidth="1" fill="none" />
                <path d={`M 50 ${y} Q ${50 + len/2} ${y - 4} ${50 + len} ${y}`} stroke="#2d4a35" strokeWidth="1" fill="none" />
              </g>
            );
          })}
        </g>
        {/* monstera-like leaf */}
        <g id="leaf-mono">
          <path d="M 60 10 Q 110 30 100 90 Q 90 130 60 130 Q 30 130 20 90 Q 10 30 60 10 Z" fill="#2d4a35" />
          <path d="M 60 16 L 60 124" stroke="#1f3a2b" strokeWidth="1" />
          {[28, 50, 70, 90].map(y => (
            <g key={y}>
              <path d={`M 60 ${y} L 36 ${y - 4}`} stroke="#1f3a2b" strokeWidth="1" />
              <circle cx="36" cy={y - 4} r="3" fill="#faf5e7" />
              <path d={`M 60 ${y} L 84 ${y - 4}`} stroke="#1f3a2b" strokeWidth="1" />
              <circle cx="84" cy={y - 4} r="3" fill="#faf5e7" />
            </g>
          ))}
        </g>
        {/* bird-of-paradise inspired leaf — long blade */}
        <g id="leaf-bird-paradise">
          <path d="M 40 0 Q 60 40 50 100 Q 40 160 30 200 Q 35 100 40 0 Z" fill="#1f3a2b" />
          <path d="M 40 4 Q 42 100 35 196" stroke="#2d4a35" strokeWidth="0.8" fill="none" />
        </g>
        {/* flower with terracotta petals */}
        <g id="flower-1">
          {[0, 60, 120, 180, 240, 300].map(a => (
            <ellipse key={a} cx="40" cy="20" rx="6" ry="14" fill="#b5532e" transform={`rotate(${a} 40 40)`} />
          ))}
          <circle cx="40" cy="40" r="6" fill="#c99a3f" />
          <circle cx="40" cy="40" r="2" fill="#1f3a2b" />
        </g>
      </defs>
    </svg>
  );
}

function stylesC(d) {
  const pad = 96 * d;
  return {
    root: { position: 'relative', background: '#faf0db', color: '#1a160e' },
    ribbon: {
      background: '#1f3a2b', color: '#faf5e7',
      padding: '10px 32px', fontSize: 12, textAlign: 'center',
      letterSpacing: '0.04em',
    },
    ribbonDot: { color: '#b5532e', marginRight: 10 },
    nav: {
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center', padding: '24px 48px',
      position: 'relative', zIndex: 2,
    },
    logo: {},
    navLinks: {
      display: 'flex', gap: 36, fontSize: 14,
      fontFamily: 'Work Sans, sans-serif', fontWeight: 500,
      color: '#1a160e',
    },
    navRight: { display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'flex-end' },
    lang: { fontSize: 12, letterSpacing: '0.1em', fontWeight: 600, color: '#1a160e' },

    hero: { position: 'relative', padding: `40px 48px ${pad}px`, overflow: 'hidden' },
    heroLeaves: { position: 'absolute', left: -40, top: 80, width: 320, height: 600, opacity: 0.55, pointerEvents: 'none' },
    heroLeavesR: { position: 'absolute', right: -60, top: 60, width: 380, height: 600, opacity: 0.55, pointerEvents: 'none' },
    heroInner: { position: 'relative', textAlign: 'center', maxWidth: 980, margin: '0 auto' },
    heroEye: {
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
      fontSize: 11, letterSpacing: '0.32em', fontWeight: 700, color: '#1f3a2b',
      marginBottom: 28,
    },
    heroEyeLine: { width: 60, height: 1, background: '#1f3a2b' },
    heroH1: {
      fontFamily: 'DM Serif Display, Georgia, serif',
      fontSize: 128, lineHeight: 0.95, color: '#1f3a2b',
      margin: 0, fontWeight: 400, letterSpacing: '-0.02em',
    },
    heroEm: { color: '#b5532e', fontStyle: 'italic' },
    heroLead: {
      fontSize: 18, lineHeight: 1.6, maxWidth: 600, margin: '32px auto 0',
      color: '#3a3328',
    },
    heroCtas: {
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28,
      marginTop: 36,
    },
    heroLink: {
      fontSize: 14, fontWeight: 600, color: '#1f3a2b',
      display: 'inline-flex', alignItems: 'center', gap: 10,
      borderBottom: '1.5px solid #1f3a2b', padding: '4px 0',
    },
    heroLinkDot: {
      width: 24, height: 24, borderRadius: '50%', background: '#1f3a2b', color: '#faf5e7',
      fontSize: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 2,
    },
    heroPhotos: {
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
      marginTop: 64,
    },
    heroPhoto: {
      height: 260, borderRadius: 4, position: 'relative',
      backgroundSize: 'cover', backgroundPosition: 'center',
    },
    heroPhotoA: { transform: 'rotate(-1deg)' },
    heroPhotoB: { transform: 'translateY(20px) rotate(0.5deg)' },
    heroPhotoC: { transform: 'rotate(-0.5deg)' },
    heroPhotoTag: {
      position: 'absolute', bottom: 14, left: 14,
      background: '#faf5e7', color: '#1f3a2b',
      padding: '6px 12px', fontSize: 11, fontWeight: 700,
      fontFamily: 'Work Sans, sans-serif', letterSpacing: '0.04em',
    },

    chipsRow: {
      background: '#1f3a2b', color: '#faf5e7',
      padding: '32px 48px',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
    },
    chip: { display: 'flex', alignItems: 'center', gap: 14 },
    chipIc: {
      width: 48, height: 48, borderRadius: '50%',
      background: 'rgba(250,245,231,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    chipK: { fontSize: 14, fontWeight: 700, fontFamily: 'Work Sans, sans-serif' },
    chipV: { fontSize: 12, color: 'rgba(250,245,231,0.65)', marginTop: 2 },

    tours: { padding: `${pad}px 48px` },
    sectionHead: { textAlign: 'center', marginBottom: 56 },
    sectNum: {
      fontSize: 11, letterSpacing: '0.32em', fontWeight: 700, color: '#b5532e',
      display: 'block', marginBottom: 18,
    },
    h2: {
      fontFamily: 'DM Serif Display, serif',
      fontSize: 64, lineHeight: 1.05, color: '#1f3a2b',
      margin: 0, fontWeight: 400, letterSpacing: '-0.01em',
    },
    h2Sub: { fontSize: 16, color: '#6b6256', marginTop: 14 },
    tourGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
    },

    nancy: {
      display: 'grid', gridTemplateColumns: '6fr 5fr', gap: 56,
      padding: `${pad}px 48px`,
      background: '#1f3a2b',
      position: 'relative', overflow: 'hidden',
    },
    nancyDecor: { position: 'absolute', right: -40, top: -40, opacity: 0.18 },
    nancyCard: { color: '#faf5e7', position: 'relative', zIndex: 2 },
    nancyEye: { fontSize: 11, letterSpacing: '0.28em', color: '#b5532e', fontWeight: 700, marginBottom: 14 },
    nancyH2: {
      fontFamily: 'DM Serif Display, serif', fontSize: 96, color: '#faf5e7',
      margin: '0 0 24px', lineHeight: 1, fontWeight: 400,
    },
    nancyP: { fontSize: 16, lineHeight: 1.7, color: 'rgba(250,245,231,0.85)', marginBottom: 16 },
    nancyQuote: {
      fontFamily: 'DM Serif Display, serif', fontStyle: 'italic',
      fontSize: 26, color: '#b5532e', lineHeight: 1.4,
      borderLeft: '2px solid #b5532e', paddingLeft: 22, margin: '24px 0',
    },
    nancySig: { display: 'flex', alignItems: 'center', marginTop: 20 },
    nancyPhoto: {
      backgroundSize: 'cover', backgroundPosition: 'center',
      borderRadius: 4, minHeight: 540,
      transform: 'rotate(1deg)',
    },

    reviewsBand: {
      background: '#b5532e', color: '#faf5e7',
      padding: `${pad}px 48px`,
    },
    reviewsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginTop: 8 },

    letter: { position: 'relative', overflow: 'hidden', padding: `${pad}px 48px`, background: '#faf0db' },
    letterLeavesL: { position: 'absolute', left: -20, top: 40, width: 200, height: 400, opacity: 0.5, pointerEvents: 'none' },
    letterLeavesR: { position: 'absolute', right: -20, top: 40, width: 200, height: 400, opacity: 0.5, pointerEvents: 'none' },
    letterInner: { textAlign: 'center', position: 'relative', maxWidth: 760, margin: '0 auto' },
    letterH2: {
      fontFamily: 'DM Serif Display, serif', fontSize: 88, lineHeight: 1, color: '#1f3a2b',
      margin: '12px 0 20px', fontWeight: 400,
    },
    letterP: { fontSize: 17, lineHeight: 1.6, color: '#3a3328', maxWidth: 540, margin: '0 auto' },
    letterCtas: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, marginTop: 36 },
    letterMail: { fontSize: 15, color: '#1f3a2b', fontWeight: 600, borderBottom: '1.5px solid #1f3a2b', padding: '4px 0' },
    payments: { marginTop: 32, fontSize: 13, color: '#6b6256' },

    footer: {
      background: '#1a160e', color: '#faf5e7',
      padding: '56px 48px 32px',
    },
    footTop: { display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 56 },
    footCols: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
    footCol: { display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'rgba(250,245,231,0.65)' },
    footBot: {
      marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(250,245,231,0.1)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 11, color: 'rgba(250,245,231,0.45)', letterSpacing: '0.06em',
    },
  };
}

window.HomeDirectionC = HomeDirectionC;
