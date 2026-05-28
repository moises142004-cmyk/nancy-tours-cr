// Shared chrome — Nav + Footer + reusable building blocks
// ───────────────────────────────────────────────────────────
// Real <a href> links between pages. Nav collapses to hamburger
// on mobile (CSS media query in responsive.css). Footer now has
// full sitemap so every page is reachable from anywhere.

function NTNav({ active = 'home' }) {
  const [lang, setLang] = React.useState(() => {
    try { return localStorage.getItem('nt-lang') || 'es'; } catch (e) { return 'es'; }
  });
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [langNotice, setLangNotice] = React.useState(false);

  const switchLang = (next) => {
    setLang(next);
    try { localStorage.setItem('nt-lang', next); } catch (e) {}
    if (next === 'en') {
      setLangNotice(true);
      setTimeout(() => setLangNotice(false), 2600);
    }
  };

  // Close mobile menu on escape
  React.useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const linkStyle = (key) => ({
    cursor: 'pointer', textDecoration: 'none',
    color: active === key ? '#b5532e' : '#faf5e7',
    fontWeight: active === key ? 700 : 500,
    borderBottom: active === key ? '1.5px solid #b5532e' : '1.5px solid transparent',
    paddingBottom: 4,
    transition: 'color .15s',
  });
  const langBtn = (val, isActive) => ({
    background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
    color: isActive ? '#faf5e7' : 'rgba(250,245,231,0.5)',
    fontWeight: isActive ? 700 : 500,
    fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit',
  });
  return (
    <header style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 48px',
      background: 'linear-gradient(180deg, rgba(13,13,10,0.85), transparent)',
    }}>
      <a href="home.html" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#faf5e7', textDecoration: 'none' }}>
        <img src="img/logo-nancy-mark-light.png" alt="Nancy Tours Costa Rica" style={{ height: 44, width: 'auto' }} />
        <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', color: '#faf5e7', lineHeight: 1.15, display: 'inline-flex', flexDirection: 'column' }}>
          <span>NANCY</span>
          <span style={{ fontWeight: 400, opacity: 0.7, fontSize: 11, letterSpacing: '0.06em' }}>tours&nbsp;cr</span>
        </span>
      </a>
      <nav style={{ display: 'flex', gap: 28, fontSize: 13, alignItems: 'center' }}>
        <a href="home.html" style={linkStyle('home')}>Inicio</a>
        <a href="tours.html" style={linkStyle('tours')}>Tours</a>
        <a href="sobre-nancy.html" style={linkStyle('nancy')}>Sobre Nancy</a>
        <a href="contacto.html" style={linkStyle('contact')}>Contacto</a>
        <span style={{
          fontSize: 11, letterSpacing: '0.16em', fontWeight: 700,
          padding: '5px 10px', border: '1px solid rgba(250,245,231,0.3)',
          borderRadius: 999, color: '#faf5e7',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <button onClick={() => switchLang('es')} style={langBtn('es', lang === 'es')} aria-label="Español" aria-pressed={lang === 'es'}>ES</button>
          <span style={{ opacity: 0.5 }}>/</span>
          <button onClick={() => switchLang('en')} style={langBtn('en', lang === 'en')} aria-label="English" aria-pressed={lang === 'en'}>EN</button>
        </span>
      </nav>
      {/* Hamburger appears only on mobile (CSS toggles via .nt-mobile-only) */}
      <button className="nt-mobile-only" onClick={() => setMenuOpen(true)} style={{
        display: 'none', alignItems: 'center', justifyContent: 'center',
        width: 40, height: 40, background: 'transparent',
        border: '1px solid rgba(250,245,231,0.3)', color: '#faf5e7',
        cursor: 'pointer',
      }} aria-label="Abrir menú">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      <a href="contacto.html" className="nt-desktop-only" style={{
        background: '#faf5e7', color: '#1a160e', padding: '11px 18px', fontSize: 13,
        display: 'inline-flex', alignItems: 'center', gap: 10, border: 'none', cursor: 'pointer',
        textDecoration: 'none', fontWeight: 600,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#b5532e' }} />
        Reservar
      </a>

      {/* Language switch notice (transient) */}
      {langNotice && (
        <div role="status" aria-live="polite" style={{
          position: 'fixed', top: 88, left: '50%', transform: 'translateX(-50%)',
          background: '#0d0d0a', color: '#faf5e7', padding: '12px 18px',
          fontSize: 13, fontWeight: 500, letterSpacing: '0.02em',
          border: '1px solid rgba(181,83,46,0.5)', borderRadius: 4,
          boxShadow: '0 12px 32px rgba(0,0,0,0.4)', zIndex: 100,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#b5532e' }} />
          English version coming soon — WhatsApp Nancy directly, she speaks English.
        </div>
      )}

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(13,13,10,0.97)',
          zIndex: 1000, display: 'flex', flexDirection: 'column',
          padding: '20px 24px 32px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="home.html" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#faf5e7', textDecoration: 'none' }}>
              <img src="img/logo-nancy-mark-light.png" alt="" style={{ height: 38 }} />
              <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 16, color: '#faf5e7' }}>
                NANCY <span style={{ opacity: 0.7, fontWeight: 400 }}>tours cr</span>
              </span>
            </a>
            <button onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" style={{
              width: 40, height: 40, background: 'transparent', border: '1px solid rgba(250,245,231,0.3)',
              color: '#faf5e7', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l14 14M19 5L5 19"/></svg>
            </button>
          </div>
          <nav style={{
            display: 'flex', flexDirection: 'column', gap: 4, marginTop: 56,
          }}>
            {[
              ['home', 'Inicio', 'home.html'],
              ['tours', 'Tours', 'tours.html'],
              ['nancy', 'Sobre Nancy', 'sobre-nancy.html'],
              ['contact', 'Contacto', 'contacto.html'],
            ].map(([key, label, href]) => (
              <a key={key} href={href} style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em',
                padding: '14px 0', borderBottom: '1px solid rgba(250,245,231,0.08)',
                color: active === key ? '#b5532e' : '#faf5e7', textDecoration: 'none',
              }}>{label}</a>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <a href="https://wa.me/50689494655" style={{
              background: '#25D366', color: '#fff', padding: '16px 20px',
              textDecoration: 'none', fontWeight: 600, fontSize: 14,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>WhatsApp · +506 8949-4655</a>
            <a href="contacto.html" style={{
              background: '#faf5e7', color: '#1a160e', padding: '16px 20px',
              textDecoration: 'none', fontWeight: 600, fontSize: 14, textAlign: 'center',
            }}>Reservar</a>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8, fontSize: 11, letterSpacing: '0.16em', color: 'rgba(250,245,231,0.5)' }}>
              <button onClick={() => switchLang('es')} style={{ ...langBtn('es', lang === 'es'), padding: '6px 8px' }}>ES</button>
              /
              <button onClick={() => switchLang('en')} style={{ ...langBtn('en', lang === 'en'), padding: '6px 8px' }}>EN</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NTFooter() {
  return (
    <footer style={{ background: '#0d0d0a', color: '#faf5e7', padding: '64px 48px 32px' }}>
      <div className="nt-foot-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 36 }}>
        <div>
          <a href="home.html" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#faf5e7', textDecoration: 'none' }}>
            <img src="img/logo-nancy-mark-light.png" alt="" style={{ height: 38, width: 'auto' }} />
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 16, color: '#faf5e7' }}>
              NANCY <span style={{ opacity: 0.7, fontWeight: 400 }}>tours cr</span>
            </span>
          </a>
          <p style={{ fontSize: 13, color: 'rgba(250,245,231,0.55)', lineHeight: 1.6, marginTop: 14 }}>
            <em style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontStyle: 'normal', color: '#c99a3f', letterSpacing: '0.06em', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>EXPERIENCIAS QUE CONECTAN</em>
            Tours guiados por toda Costa Rica.<br/>Heredia, Mercedes Norte. ICT en trámite.
          </p>
          {/* Social */}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            {[
              { label: 'WhatsApp', href: 'https://wa.me/50689494655' },
              { label: 'Instagram', href: 'https://instagram.com/nancytourscr' },
              { label: 'Facebook', href: 'https://facebook.com/CostaRicaFamily' },
            ].map(s => (
              <a key={s.label} href={s.href} style={{
                fontSize: 11, letterSpacing: '0.16em', fontWeight: 700,
                padding: '7px 11px', border: '1px solid rgba(250,245,231,0.18)',
                color: 'rgba(250,245,231,0.65)', textDecoration: 'none',
              }}>{s.label.toUpperCase()}</a>
            ))}
          </div>
        </div>
        <div style={ftCol}>
          <h4 style={ftH}>Navegación</h4>
          <a style={ftLink} href="home.html">Inicio</a>
          <a style={ftLink} href="tours.html">Todos los tours</a>
          <a style={ftLink} href="sobre-nancy.html">Sobre Nancy</a>
          <a style={ftLink} href="contacto.html">Contacto</a>
        </div>
        <div style={ftCol}>
          <h4 style={ftH}>Tours destacados</h4>
          <a style={ftLink} href="tour-detail.html?id=chirripo">Cerro Chirripó</a>
          <a style={ftLink} href="tour-detail.html?id=bajos-toro">Bajos del Toro</a>
          <a style={ftLink} href="tour-detail.html?id=tortuguero">Tortuguero</a>
          <a style={ftLink} href="tour-detail.html?id=ballenas">Ballenas Uvita</a>
          <a style={ftLink} href="tours.html">Ver todos →</a>
        </div>
        <div style={ftCol}>
          <h4 style={ftH}>Por categoría</h4>
          <a style={ftLink} href="tours.html#aventura">Aventura</a>
          <a style={ftLink} href="tours.html#dia">Día completo</a>
          <a style={ftLink} href="tours.html#tercera-edad">Tercera edad</a>
          <a style={ftLink} href="tours.html#cultural">Cultural</a>
          <a style={ftLink} href="tours.html#a-medida">A medida</a>
        </div>
        <div style={ftCol}>
          <h4 style={ftH}>Contacto</h4>
          <a style={ftLink} href="https://wa.me/50689494655">+506 8949-4655</a>
          <a style={ftLink} href="https://wa.me/50689494655">WhatsApp</a>
          <a style={ftLink} href="mailto:hola@nancytourscr.com">hola@nancytourscr.com</a>
          <a style={ftLink} href="https://maps.google.com/?q=Mercedes+Norte+Heredia+Costa+Rica" target="_blank" rel="noopener">Heredia, Mercedes Norte</a>
        </div>
      </div>
      <div className="nt-foot-bottom" style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid rgba(250,245,231,0.08)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(250,245,231,0.4)', letterSpacing: '0.08em' }}>
        <span>© 2026 NANCY TOURS COSTA RICA · Todos los derechos reservados</span>
        <span>nancytourscr.com</span>
        <span>Diseño <a href="https://dreamos.dev" style={{ color: 'inherit', textDecoration: 'underline' }}>Dream[OS]</a></span>
      </div>
    </footer>
  );
}

const ftCol = { display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 };
const ftH = { fontSize: 13, fontWeight: 700, color: '#faf5e7', margin: '0 0 8px 0', letterSpacing: '0.04em' };
const ftLink = { color: 'rgba(250,245,231,0.65)', textDecoration: 'none', cursor: 'pointer' };

// Reusable tour card — links to detail page with ?id slug
function NTTourCard({ num, img, tag, title, loc, date, duration, diff, cupo, price, custom, slug }) {
  const accent = custom ? '#1f3a2b' : '#b5532e';
  const href = slug ? `tour-detail.html?id=${slug}` : '#';
  return (
    <a href={href} style={{
      background: '#fff', border: '1px solid rgba(31,58,43,0.1)',
      color: '#1a160e', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', cursor: 'pointer', textDecoration: 'none',
    }}>
      <div className="nt-photo" style={{
        height: 220, position: 'relative',
        backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundImage: `url(${img})`,
        ...(custom ? { filter: 'grayscale(0.7) sepia(0.15)' } : {}),
      }}>
        <span style={{
          position: 'absolute', top: 16, left: 16,
          background: accent, color: '#faf5e7',
          fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
          padding: '6px 10px', fontFamily: 'Bricolage Grotesque, sans-serif',
        }}>{tag}</span>
        <span style={{
          position: 'absolute', top: 16, right: 16,
          color: 'rgba(250,245,231,0.85)',
          fontFamily: 'Bricolage Grotesque, sans-serif',
          fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em',
          textShadow: '0 1px 6px rgba(0,0,0,0.4)',
        }}>{num}</span>
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 22, flex: 1 }}>
        <div>
          <h3 style={{
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em',
            margin: 0, lineHeight: 1.05, color: '#1a160e',
          }}>{title}</h3>
          <div style={{ fontSize: 13, color: '#6b6256', marginTop: 6 }}>{loc}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 18px' }}>
          {[['FECHA', date], ['DURACIÓN', duration], ['NIVEL', diff], ['CUPO', cupo]].map(([k, v]) => (
            <div key={k}>
              <span style={ntMetaK}>{k}</span>
              <span style={ntMetaV}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingTop: 18, marginTop: 'auto', borderTop: '1px solid rgba(31,58,43,0.1)',
        }}>
          <div>
            <span style={ntMetaK}>DESDE</span>
            <strong style={{
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: accent,
            }}>{price}</strong>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>Reservar →</span>
        </div>
      </div>
    </a>
  );
}

const ntMetaK = {
  display: 'block', fontSize: 9, letterSpacing: '0.18em', fontWeight: 700,
  color: '#6b6256', fontFamily: 'Bricolage Grotesque, sans-serif', marginBottom: 3,
};
const ntMetaV = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#1a160e',
  fontFamily: 'Inter, sans-serif',
};

window.NTNav = NTNav;
window.NTFooter = NTFooter;
window.NTTourCard = NTTourCard;
