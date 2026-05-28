// Direction B · "Cinematic Wild"
// ───────────────────────────────────────────────────────────
// Dark moody. Full-bleed video hero. White text on jungle.
// Bold modern sans (Bricolage Grotesque). Premium / adventure
// magazine feel — National Geographic / outside-mag vibe.

function HomeDirectionB({ density = 1 }) {
  const s = stylesB(density);
  return (
    <div className="nt-frame nt-dir-b" style={s.root}>

      {/* ── Nav (shared chrome) ───────────────────────── */}
      <NTNav active="home" />

      {/* ── Full-bleed cinematic hero ─────────────────── */}
      <section style={s.hero}>
        <HeroVideo />
        <div style={s.heroScrim} />

        {/* video controls treatment to read as cinema, not website */}
        <JungleChip />

        <div className="nt-hero-text" style={s.heroText}>
          <div style={s.heroEyebrow}>
            <span style={s.dotPulse} />
            EXPERIENCIAS QUE CONECTAN · DESDE 2010
          </div>
          <h1 className="nt-hero-h1" style={s.heroH1}>
            Los mejores<br/>
            tours de<br/>
            <span style={s.heroAccent}>Costa Rica.</span>
          </h1>
          <p style={s.heroLead}>
            Tours guiados por Nancy — Licenciada en Turismo, 15 años caminando cada
            volcán, río y catarata de Costa Rica. Equipo de radios, GPS y la calma
            de saber a dónde vamos.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
            <a href="tours.html" className="nt-btn nt-btn-primary" style={{ padding: '16px 26px' }}>Próximos tours →</a>
            <a href="https://wa.me/50689494655" className="nt-btn" style={s.heroGhost}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5C18.3 1.3 15.3 0 12 0 5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.5 5.9L0 24l6.2-1.6c1.7 1 3.7 1.5 5.8 1.5h.1c6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.6-8.4zM12 22h-.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4 1 1.1-3.9-.3-.4C1.8 15.4 1.2 13.7 1.2 12c0-6 4.9-10.9 10.9-10.9 2.9 0 5.6 1.1 7.7 3.2 2.1 2.1 3.2 4.8 3.2 7.7-.1 6-5 10.9-11 10.9z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* corner stats */}
        <div className="nt-hero-corner" style={s.heroCorner}>
          <div style={s.cornerStat}><strong>15</strong><span>años en ruta</span></div>
          <div style={s.cornerStat}><strong>47</strong><span>destinos cubiertos</span></div>
          <div style={s.cornerStat}><strong>4.9</strong><span>★ reseñas</span></div>
        </div>

      </section>

      {/* ── Marquee strip with destinations ───────────── */}
      <section style={s.marquee}>
        <div style={s.marqueeTrack}>
          {(() => {
            const items = ['CHIRRIPÓ', '◆', 'TORTUGUERO', '◆', 'BAJOS DEL TORO', '◆', 'POÁS', '◆', 'UVITA · BALLENAS', '◆', 'CAVERNAS DE VENADO', '◆', 'CORCOVADO', '◆', 'MONTEVERDE', '◆', 'BARVA', '◆'];
            // duplicate for seamless loop (track scrolls -50%)
            return [...items, ...items].map((t, i) => (
              <span key={i}>{t}</span>
            ));
          })()}
        </div>
      </section>

      {/* ── Tours — postcard card grid ────────────────── */}
      <section style={s.toursSection}>
        <div style={s.toursHeader}>
          <div>
            <div style={s.eyebrowDark}>01 / TOURS ABIERTOS</div>
            <h2 style={s.h2}>Cada salida, una historia distinta.</h2>
          </div>
          <a href="tours.html" style={s.viewAllDark}>Calendario completo →</a>
        </div>

        <div style={s.tourCardGrid}>
          <TourCardB
            img="img/chirripo-summit.jpg"
            slug="chirripo"
            tag="AVENTURA"
            num="01"
            title="Cerro Chirripó"
            loc="Pérez Zeledón · 3.820 m"
            date="13 — 15 JUN"
            duration="3 días · 2 noches"
            diff="Alta"
            cupo="6 / 10"
            price="$340"
          />
          <TourCardB
            img="img/waterfall.jpg"
            slug="bajos-toro"
            tag="DÍA"
            num="02"
            title="Bajos del Toro"
            loc="Alajuela · catarata oculta"
            date="14 JUN · sáb"
            duration="1 día"
            diff="Media"
            cupo="4 / 12"
            price="$85"
          />
          <TourCardB
            img="img/boat-tour.jpg"
            slug="tortuguero"
            tag="2 DÍAS"
            num="03"
            title="Tortuguero"
            loc="Limón · canales caribeños"
            date="21 — 22 JUN"
            duration="2 días · 1 noche"
            diff="Baja"
            cupo="2 / 14"
            price="$220"
          />
          <TourCardB
            img="img/cave.jpg"
            slug="cavernas-venado"
            tag="DÍA"
            num="04"
            title="Cavernas de Venado"
            loc="San Carlos · estalactitas"
            date="28 JUN · sáb"
            duration="1 día"
            diff="Media"
            cupo="8 / 12"
            price="$95"
          />
          <TourCardB
            img="img/whale.jpg"
            slug="ballenas-uvita"
            tag="TEMPORADA"
            num="05"
            title="Ballenas en Uvita"
            loc="Pacífico Sur · jul-oct"
            date="12 JUL · sáb"
            duration="1 día"
            diff="Baja"
            cupo="10 / 16"
            price="$110"
          />
          <TourCardB
            img="img/chirripo-sign.jpg"
            slug="a-medida"
            tag="A MEDIDA"
            num="06"
            title="Tu propio tour"
            loc="A donde quieras ir"
            date="Coordiná fecha"
            duration="—"
            diff="—"
            cupo="—"
            price="Consultá"
            custom
          />
        </div>
      </section>

      {/* ── Differentiators — over photo band ─────────── */}
      <section style={s.diffBand}>
        <div className="nt-photo" style={{ ...s.diffBg, backgroundImage: 'url(img/chirripo-lakes.jpg)' }} />
        <div style={s.diffOverlay} />
        <div style={s.diffInner}>
          <div style={s.eyebrowLight}>02 / POR QUÉ NANCY</div>
          <h2 style={{ ...s.h2, color: '#faf5e7', marginTop: 14, maxWidth: 720 }}>
            No es solo conocer Costa Rica. Es conocerla bien.
          </h2>
          <div style={s.diffGrid}>
            {[
              {
                seq: '01',
                tag: 'CREDENCIAL',
                title: 'Lic. en Turismo',
                desc: 'Credencial formal del ICT. Sé de qué hablo en cada parque nacional.',
                proof: 'Cédula profesional vigente',
                iconImg: 'img/icon-certificate.png',
                iconAlt: 'Certificado profesional',
              },
              {
                seq: '02',
                tag: 'TRAYECTORIA',
                title: 'Quince años',
                desc: 'Recorrí cada provincia con grupos chicos y grandes desde 2010.',
                proof: '2010 → 2026 · activa',
                bigText: '15',
                featured: true,
              },
              {
                seq: '03',
                tag: 'SEGURIDAD',
                title: 'Radios + GPS',
                desc: 'Equipo de comunicación en cada tour. Seguridad real, no improvisada.',
                proof: 'VHF + GPS en cada salida',
                iconImg: 'img/icon-radio.png',
                iconAlt: 'Radio de comunicación',
              },
              {
                seq: '04',
                tag: 'METODOLOGÍA',
                title: 'A tu ritmo',
                desc: 'Familias, tercera edad, jóvenes. Leo el grupo y ajusto el paso.',
                proof: 'Grupos máximo 12 personas',
                iconImg: 'img/icon-signal.png',
                iconAlt: 'Señal de pulso',
              },
            ].map((d, i) => (
              <ValueCard key={i} {...d} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Nancy intro split ─────────────────────────── */}
      <section style={s.about}>
        <div style={s.aboutText}>
          <div style={s.eyebrowDark}>03 / TU GUÍA</div>
          <h2 style={s.h2}>Nancy.</h2>
          <p style={s.aboutLead}>
            “Empecé caminando los senderos de Heredia con mi familia. Hoy soy
            Licenciada en Turismo y llevo grupos por todo Costa Rica desde hace
            quince años. Si vas conmigo, vas tranquilo: sé los caminos, conozco
            el clima, leo el grupo. Mi promesa es simple — terminar el día
            cansados, pero felices.”
          </p>
          <div style={s.signature}>— Nancy Villalobos, Lic. Turismo</div>
          <a href="sobre-nancy.html" className="nt-btn nt-btn-primary" style={{ marginTop: 24 }}>Conocé mi historia →</a>
        </div>
        <div style={s.aboutMedia}>
          <div className="nt-photo" style={{ ...s.aboutPhotoBig, backgroundImage: 'url(img/chirripo-sign.jpg)' }} />
          <div style={s.aboutPhotoRow}>
            <div className="nt-photo" style={{ ...s.aboutPhotoSm, backgroundImage: 'url(img/hiking-trail.jpg)' }} />
            <div style={{
              ...s.aboutPhotoSm,
              background: '#faf0db',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 8,
            }}>
              <img src="img/logo-nancy-transparent.png" alt="Nancy Tours Costa Rica"
                   style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section style={s.bookBlock}>
        <div style={s.eyebrowLight}>04 / RESERVÁ</div>
        <h2 style={{ ...s.h2, color: '#faf5e7', fontSize: 80, marginTop: 12 }}>
          Decime <em style={{ color: '#b5532e', fontStyle: 'normal' }}>cuándo</em><br/>y armamos el resto.
        </h2>
        <div style={s.bookOpts}>
          <BookOpt label="WhatsApp" sub="Respuesta en el día" prim href="https://wa.me/50689494655" />
          <BookOpt label="SINPE móvil" sub="Para apartar tu cupo" href="contacto.html#pago" />
          <BookOpt label="Depósito bancario" sub="BN / BAC" href="contacto.html#pago" />
          <BookOpt label="Correo" sub="hola@nancytourscr.com" href="mailto:hola@nancytourscr.com" />
        </div>
      </section>

      <NTFooter />

      <a href="https://wa.me/50689494655" className="nt-wa-float" target="_blank" rel="noopener" aria-label="WhatsApp Nancy" style={{ position: 'absolute', right: 28, bottom: 28 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.1-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1.1 2.8.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.9 3.3 1.4 5.2 1.4 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.4-.5-4.8-1.4l-.3-.2-2.9.9.9-2.8-.2-.3C3.6 14.7 3 13.4 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9z"/></svg>
      </a>
    </div>
  );
}

function TourCardB({ num, img, tag, title, loc, date, duration, diff, cupo, price, custom, slug }) {
  const accent = custom ? '#1f3a2b' : '#b5532e';
  const href = slug ? `tour-detail.html?id=${slug}` : 'tours.html';
  return (
    <a href={href} style={tcbStyles.card}>
      <div className="nt-photo" style={{
        ...tcbStyles.photo,
        backgroundImage: `url(${img})`,
        ...(custom ? { filter: 'grayscale(0.7) sepia(0.15)' } : {}),
      }}>
        <span style={{ ...tcbStyles.tag, background: accent }}>{tag}</span>
        <span style={tcbStyles.num}>{num}</span>
      </div>
      <div style={tcbStyles.body}>
        <div>
          <h3 style={tcbStyles.title}>{title}</h3>
          <div style={tcbStyles.loc}>{loc}</div>
        </div>
        <div style={tcbStyles.metaGrid}>
          <div><span style={tcbStyles.metaK}>FECHA</span><span style={tcbStyles.metaV}>{date}</span></div>
          <div><span style={tcbStyles.metaK}>DURACIÓN</span><span style={tcbStyles.metaV}>{duration}</span></div>
          <div><span style={tcbStyles.metaK}>NIVEL</span><span style={tcbStyles.metaV}>{diff}</span></div>
          <div><span style={tcbStyles.metaK}>CUPO</span><span style={tcbStyles.metaV}>{cupo}</span></div>
        </div>
        <div style={tcbStyles.foot}>
          <div>
            <span style={tcbStyles.priceK}>DESDE</span>
            <strong style={{ ...tcbStyles.priceV, color: accent }}>{price}</strong>
          </div>
          <span style={{ ...tcbStyles.reserve, color: accent }}>Reservar →</span>
        </div>
      </div>
    </a>
  );
}

const tcbStyles = {
  card: {
    background: '#fff',
    border: '1px solid rgba(31,58,43,0.1)',
    color: '#1a160e',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'transform .15s, box-shadow .15s',
  },
  photo: {
    height: 220, position: 'relative',
    backgroundSize: 'cover', backgroundPosition: 'center',
  },
  tag: {
    position: 'absolute', top: 16, left: 16,
    color: '#faf5e7', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
    padding: '6px 10px', fontFamily: 'Bricolage Grotesque, sans-serif',
  },
  num: {
    position: 'absolute', top: 16, right: 16,
    color: 'rgba(250,245,231,0.85)',
    fontFamily: 'Bricolage Grotesque, sans-serif',
    fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em',
    textShadow: '0 1px 6px rgba(0,0,0,0.4)',
  },
  body: {
    padding: 24,
    display: 'flex', flexDirection: 'column',
    gap: 22, flex: 1,
  },
  title: {
    fontFamily: 'Bricolage Grotesque, sans-serif',
    fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em',
    color: '#1a160e', margin: 0, lineHeight: 1.05,
  },
  loc: { fontSize: 13, color: '#6b6256', marginTop: 6 },
  metaGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 18px',
  },
  metaK: {
    display: 'block', fontSize: 9, letterSpacing: '0.18em', fontWeight: 700,
    color: '#6b6256', fontFamily: 'Bricolage Grotesque, sans-serif', marginBottom: 3,
  },
  metaV: {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#1a160e',
    fontFamily: 'Inter, sans-serif',
  },
  foot: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingTop: 18, marginTop: 'auto', borderTop: '1px solid rgba(31,58,43,0.1)',
  },
  priceK: {
    display: 'block', fontSize: 9, letterSpacing: '0.18em', fontWeight: 700,
    color: '#6b6256', fontFamily: 'Bricolage Grotesque, sans-serif', marginBottom: 4,
  },
  priceV: {
    fontFamily: 'Bricolage Grotesque, sans-serif',
    fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em',
  },
  reserve: {
    fontSize: 13, fontWeight: 700, letterSpacing: '0.04em',
    fontFamily: 'Inter, sans-serif',
  },
};
// Couple of CSS bits for meta sub/sup
(function injectB() {
  if (document.getElementById('dir-b-css')) return;
  const css = document.createElement('style');
  css.id = 'dir-b-css';
  css.textContent = `
    .nt-dir-b small { display:block; font-size:10px; letter-spacing:0.16em; color:#6b6256; font-weight:600; margin-bottom:3px; }
    .nt-dir-b ${'a'} { text-decoration:none; color:inherit; }
    .nt-dir-b strong { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size:18px; letter-spacing:-0.01em; }
    @keyframes nt-marquee-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `;
  document.head.appendChild(css);
})();

function ValueCard({ seq, tag, title, desc, icon, iconImg, iconAlt, bigText, proof, featured }) {
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(false);
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (y - 0.5) * -10,
      ry: (x - 0.5) * 10,
      mx: x * 100,
      my: y * 100,
    });
  };
  const onLeave = () => {
    setActive(false);
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
  };

  const accent = '#b5532e';
  const ink = '#1a160e';

  // Platinum pearl base for standard cards · warm copper foil for the featured "15" card
  const baseBg = featured
    ? 'linear-gradient(140deg, #9a4424 0%, #d77544 38%, #b5532e 58%, #8a3a1f 100%)'
    : 'linear-gradient(140deg, #d8d1be 0%, #f4eedd 28%, #c5beaa 55%, #ece6d3 80%, #d2cbb8 100%)';

  const textCol = featured ? '#faf5e7' : ink;
  const subCol = featured ? 'rgba(250,245,231,0.85)' : 'rgba(26,22,14,0.62)';

  return (
    <article
      ref={ref}
      onMouseEnter={() => setActive(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        perspective: '900px',
        minHeight: 340,
      }}
    >
      <div style={{
        position: 'relative',
        minHeight: 340,
        height: '100%',
        borderRadius: 14,
        background: baseBg,
        boxShadow: active
          ? '0 30px 60px -18px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.15)'
          : '0 14px 28px -12px rgba(0,0,0,0.42), 0 0 0 1px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.45)',
        overflow: 'hidden',
        padding: '24px 22px 22px',
        display: 'flex', flexDirection: 'column',
        transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: active
          ? 'box-shadow .2s, transform .12s ease-out'
          : 'transform .45s cubic-bezier(.2,.7,.2,1), box-shadow .3s',
      }}>
        {/* Iridescent rainbow bands — mix-blend overlay so they ride the base color */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          mixBlendMode: featured ? 'soft-light' : 'overlay',
          pointerEvents: 'none',
          opacity: featured ? 1 : 0.95,
        }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className={`nt-irid-band nt-irid-band-${i}`}
              style={{
                position: 'absolute', inset: '-55%',
                background: NT_IRID_GRADS[i],
                filter: 'blur(20px)',
                willChange: 'transform',
              }}
            />
          ))}
        </div>

        {/* Specular highlight — follows mouse, gives the "wet foil" glint */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(60% 50% at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)`,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          opacity: active ? 1 : 0.4,
          transition: active ? 'opacity .12s' : 'opacity .3s',
        }} />

        {/* Sticker double-stroke (inner outline) */}
        <div aria-hidden style={{
          position: 'absolute', inset: 6,
          border: `1px solid ${featured ? 'rgba(255,255,255,0.42)' : 'rgba(26,22,14,0.22)'}`,
          borderRadius: 9,
          pointerEvents: 'none',
        }} />

        {/* Content sits above all overlays */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <header style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 28,
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 11, letterSpacing: '0.12em', fontWeight: 600,
              color: subCol,
            }}>{seq} / 04</span>
            <span style={{
              fontSize: 9.5, letterSpacing: '0.2em', fontWeight: 700,
              padding: '4px 8px',
              color: featured ? '#faf5e7' : accent,
              border: `1px solid ${featured ? 'rgba(255,255,255,0.45)' : 'rgba(181,83,46,0.5)'}`,
              borderRadius: 999,
              background: featured ? 'rgba(255,255,255,0.06)' : 'rgba(250,245,231,0.25)',
              backdropFilter: 'blur(2px)',
            }}>{tag}</span>
          </header>

          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', color: textCol }}>
            {bigText ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 0.85 }}>
                <span style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontSize: 132, fontWeight: 800, letterSpacing: '-0.06em',
                  textShadow: featured ? '0 2px 0 rgba(0,0,0,0.18)' : 'none',
                }}>{bigText}</span>
                <span style={{
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em',
                  marginTop: 14,
                }}>años</span>
              </div>
            ) : iconImg ? (
              <img
                src={iconImg}
                alt={iconAlt || ''}
                style={{
                  width: 92, height: 92,
                  objectFit: 'contain',
                  display: 'block',
                  marginTop: -6, marginLeft: -8,
                  filter: active
                    ? 'drop-shadow(0 10px 14px rgba(0,0,0,0.32))'
                    : 'drop-shadow(0 6px 10px rgba(0,0,0,0.22))',
                  transform: active ? 'rotate(-5deg) translateY(-2px)' : 'rotate(0) translateY(0)',
                  transition: 'transform .4s cubic-bezier(.2,.7,.2,1), filter .3s',
                }}
              />
            ) : icon ? (
              <div style={{
                width: 56, height: 56, display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${accent}`,
                color: accent,
                background: 'rgba(255,255,255,0.4)',
                transition: 'transform .4s cubic-bezier(.2,.7,.2,1)',
                transform: active ? 'rotate(-4deg)' : 'rotate(0)',
              }}>
                {React.cloneElement(icon, { width: 30, height: 30, strokeWidth: 1.6 })}
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 22 }}>
            <h3 style={{
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em',
              margin: 0, color: textCol, lineHeight: 1.05,
            }}>{title}</h3>
            <p style={{
              fontSize: 13.5, lineHeight: 1.5, margin: '10px 0 0',
              color: subCol,
            }}>{desc}</p>
          </div>

          <footer style={{
            marginTop: 20, paddingTop: 14,
            borderTop: `1px dashed ${featured ? 'rgba(255,255,255,0.35)' : 'rgba(26,22,14,0.22)'}`,
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 11, letterSpacing: '0.02em',
            color: featured ? 'rgba(250,245,231,0.9)' : 'rgba(26,22,14,0.7)',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={featured ? '#faf5e7' : accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6.5L4.5 9 10 3.5" />
            </svg>
            <span>{proof}</span>
          </footer>
        </div>
      </div>
    </article>
  );
}

const NT_IRID_GRADS = [
  // On-brand palette: terracotta · amber · cream · sage · jungle · dusk · clay · honey
  'linear-gradient(180deg, transparent 0%, hsla(16, 65%, 52%, 0.55) 50%, transparent 100%)',   // terracotta
  'linear-gradient(180deg, transparent 0%, hsla(34, 78%, 58%, 0.55) 50%, transparent 100%)',   // amber
  'linear-gradient(180deg, transparent 0%, hsla(48, 60%, 78%, 0.55) 50%, transparent 100%)',   // cream highlight
  'linear-gradient(180deg, transparent 0%, hsla(82, 35%, 48%, 0.50) 50%, transparent 100%)',   // sage
  'linear-gradient(180deg, transparent 0%, hsla(150, 32%, 30%, 0.55) 50%, transparent 100%)',  // deep jungle green
  'linear-gradient(180deg, transparent 0%, hsla(28, 45%, 30%, 0.55) 50%, transparent 100%)',   // dusk earth
  'linear-gradient(180deg, transparent 0%, hsla(20, 55%, 42%, 0.50) 50%, transparent 100%)',   // clay
  'linear-gradient(180deg, transparent 0%, hsla(40, 70%, 65%, 0.50) 50%, transparent 100%)',   // honey
];

(function injectIridescentCss() {
  if (typeof document === 'undefined' || document.getElementById('nt-irid-css')) return;
  const css = document.createElement('style');
  css.id = 'nt-irid-css';
  // Each band rotates around a base offset (i * 22deg) and wobbles ±12deg
  // out of phase so the iridescence shimmers continuously.
  let frames = '';
  for (let i = 0; i < 8; i++) {
    const base = i * 22;
    frames += `
      @keyframes nt-irid-${i} {
        0%   { transform: rotate(${base}deg); }
        50%  { transform: rotate(${base + 14}deg); }
        100% { transform: rotate(${base}deg); }
      }
      .nt-irid-band-${i} {
        animation: nt-irid-${i} ${6 + i * 0.4}s ease-in-out infinite;
        animation-delay: ${-i * 0.5}s;
      }
    `;
  }
  css.textContent = frames;
  document.head.appendChild(css);
})();

function BookOpt({ label, sub, prim, href }) {
  const Tag = href ? 'a' : 'div';
  return (
    <Tag href={href} style={{
      padding: 24, borderRadius: 4,
      background: prim ? '#b5532e' : 'rgba(250,245,231,0.08)',
      border: prim ? 'none' : '1px solid rgba(250,245,231,0.18)',
      color: '#faf5e7',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: 130,
      textDecoration: 'none', cursor: href ? 'pointer' : 'default',
    }}>
      <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>{label}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontSize: 12, opacity: 0.7 }}>{sub}</span>
        <span style={{ fontSize: 20 }}>→</span>
      </div>
    </Tag>
  );
}

function stylesB(d) {
  const pad = 128 * d;
  return {
    root: { position: 'relative', background: '#0d0d0a', color: '#faf5e7' },
    nav: {
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 48px',
      background: 'linear-gradient(180deg, rgba(13,13,10,0.85), transparent)',
    },
    logo: { display: 'flex', alignItems: 'center', gap: 10, color: '#faf5e7' },
    navLinks: { display: 'flex', gap: 28, fontSize: 13, alignItems: 'center', color: '#faf5e7' },
    langPill: { fontSize: 11, letterSpacing: '0.16em', fontWeight: 700, padding: '5px 10px', border: '1px solid rgba(250,245,231,0.3)', borderRadius: 999 },
    navCta: { background: '#faf5e7', color: '#1a160e', padding: '11px 18px', fontSize: 13 },
    navDot: { width: 8, height: 8, borderRadius: '50%', background: '#b5532e' },
    hero: { position: 'relative', minHeight: '88vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' },
    heroBg: { position: 'absolute', inset: 0 },
    heroScrim: {
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, rgba(13,13,10,0.35) 0%, rgba(13,13,10,0.3) 50%, rgba(13,13,10,0.85) 100%)',
    },
    videoFrame: {
      position: 'absolute', top: 110, right: 48,
      background: 'rgba(13,13,10,0.55)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(250,245,231,0.18)',
      padding: '14px 16px', borderRadius: 4,
      display: 'flex', flexDirection: 'column', gap: 10, minWidth: 240,
    },
    timecode: { fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.12em', color: '#faf5e7' },
    scrubBar: { height: 3, background: 'rgba(250,245,231,0.2)', borderRadius: 2, overflow: 'hidden' },
    scrubFill: { width: '36%', height: '100%', background: '#b5532e' },
    playRow: { display: 'flex', alignItems: 'center', gap: 10 },
    playBtn: { width: 28, height: 28, borderRadius: '50%', background: '#b5532e', color: '#fff', fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 2 },
    heroText: {
      position: 'relative', zIndex: 2,
      padding: '108px 48px 56px',
      maxWidth: 760,
    },
    heroEyebrow: {
      fontSize: 11, letterSpacing: '0.22em', fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '7px 13px', border: '1px solid rgba(250,245,231,0.3)', borderRadius: 999,
      marginBottom: 18,
    },
    dotPulse: { width: 7, height: 7, borderRadius: '50%', background: '#b5532e' },
    heroH1: {
      fontFamily: 'Bricolage Grotesque, sans-serif',
      fontSize: 'clamp(40px, min(6.5vw, 12vh), 104px)',
      lineHeight: 0.96, fontWeight: 800, letterSpacing: '-0.035em',
      margin: 0, color: '#faf5e7',
    },
    heroAccent: { color: '#b5532e' },
    heroLead: {
      fontSize: 16, lineHeight: 1.55, maxWidth: 520, marginTop: 20,
      color: 'rgba(250,245,231,0.85)',
    },
    heroGhost: { background: 'transparent', color: '#faf5e7', border: '1px solid rgba(250,245,231,0.4)', padding: '15px 24px' },
    heroCorner: { position: 'absolute', bottom: 56, right: 48, display: 'flex', gap: 20, zIndex: 2 },
    cornerStat: {
      padding: '12px 18px', borderLeft: '2px solid #b5532e',
      display: 'flex', flexDirection: 'column',
    },
    scrollHint: {
      position: 'absolute', top: '50%', right: 28, transform: 'rotate(90deg) translateX(50%)',
      transformOrigin: 'right',
      fontSize: 11, letterSpacing: '0.32em', fontWeight: 600, color: 'rgba(250,245,231,0.6)',
    },
    marquee: {
      background: '#b5532e', color: '#faf5e7',
      padding: '16px 0', overflow: 'hidden',
      borderTop: '1px solid #8e3d20', borderBottom: '1px solid #8e3d20',
      position: 'relative',
    },
    marqueeTrack: {
      display: 'flex', gap: 36, whiteSpace: 'nowrap',
      fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.18em',
      animation: 'nt-marquee-scroll 40s linear infinite',
      width: 'max-content',
    },
    toursSection: {
      background: '#faf5e7', color: '#1a160e',
      padding: `${pad}px 48px`,
    },
    toursHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 },
    eyebrowDark: { fontSize: 11, letterSpacing: '0.22em', fontWeight: 700, color: '#b5532e' },
    eyebrowLight: { fontSize: 11, letterSpacing: '0.22em', fontWeight: 700, color: '#b5532e' },
    h2: {
      fontFamily: 'Bricolage Grotesque, sans-serif',
      fontSize: 64, lineHeight: 1, fontWeight: 800, letterSpacing: '-0.03em',
      margin: '8px 0 0', color: '#1a160e', maxWidth: 760,
    },
    viewAllDark: { fontSize: 13, fontWeight: 700, color: '#b5532e', letterSpacing: '0.06em' },
    tourCardGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20,
    },
    diffBand: { position: 'relative', overflow: 'hidden', padding: `${pad}px 48px` },
    diffBg: { position: 'absolute', inset: 0 },
    diffOverlay: { position: 'absolute', inset: 0, background: 'rgba(31,58,43,0.85)' },
    diffInner: { position: 'relative' },
    diffGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 56 },
    diffCard: {
      background: 'rgba(250,245,231,0.06)', border: '1px solid rgba(250,245,231,0.14)',
      padding: 28, borderRadius: 4,
      backdropFilter: 'blur(6px)',
    },
    diffIcon: {
      fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 44, fontWeight: 800,
      color: '#b5532e', lineHeight: 1, marginBottom: 18, letterSpacing: '-0.03em',
    },
    diffT: { fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#faf5e7' },
    diffD: { fontSize: 13, lineHeight: 1.6, color: 'rgba(250,245,231,0.7)' },
    about: {
      display: 'grid', gridTemplateColumns: '6fr 5fr', gap: 64,
      padding: `${pad}px 48px`, background: '#faf5e7',
    },
    aboutText: {},
    aboutLead: {
      fontFamily: 'Bricolage Grotesque, sans-serif',
      fontSize: 22, lineHeight: 1.5, marginTop: 28, color: '#1a160e', maxWidth: 580,
      fontWeight: 400,
    },
    signature: { marginTop: 24, fontSize: 13, color: '#6b6256', fontStyle: 'italic' },
    aboutMedia: { display: 'flex', flexDirection: 'column', gap: 14 },
    aboutPhotoBig: { height: 360, borderRadius: 2 },
    aboutPhotoRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
    aboutPhotoSm: { height: 200, borderRadius: 2 },
    bookBlock: {
      background: '#1f3a2b', color: '#faf5e7',
      padding: `${pad}px 48px`,
    },
    bookOpts: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 48 },
    footer: { background: '#0d0d0a', color: '#faf5e7', padding: '64px 48px 32px' },
    footerGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 },
    footP: { fontSize: 13, color: 'rgba(250,245,231,0.55)', lineHeight: 1.6, marginTop: 14 },
    footCol: { display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'rgba(250,245,231,0.65)' },
    footBottom: { marginTop: 56, paddingTop: 24, borderTop: '1px solid rgba(250,245,231,0.08)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(250,245,231,0.4)', letterSpacing: '0.08em' },
  };
}

window.HomeDirectionB = HomeDirectionB;

// ── Hero video ──────────────────────────────────────
// Two-video crossfade: while v1 plays, v2 is queued near the start.
// As v1 approaches its end we fade v2 in (and reset v1). This hides the
// browser's native "loop seam" (the hard cut + black flash on restart).
// Dark background prevents any white flash before metadata loads.
function HeroVideo() {
  const v1 = React.useRef(null);
  const v2 = React.useRef(null);
  const [active, setActive] = React.useState(1); // which video is currently visible
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const a = v1.current, b = v2.current;
    if (!a || !b) return;
    let raf;
    const FADE = 0.6; // seconds of overlap

    const tick = () => {
      const cur = active === 1 ? a : b;
      const other = active === 1 ? b : a;
      if (cur && other && cur.duration && !isNaN(cur.duration)) {
        const remaining = cur.duration - cur.currentTime;
        if (remaining < FADE && other.paused) {
          other.currentTime = 0;
          other.play().catch(() => {});
          setActive(active === 1 ? 2 : 1);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const onCanPlay = () => setReady(true);

  const sharedStyle = {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover',
    transition: 'opacity .7s ease',
    willChange: 'opacity',
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0d0d0a', overflow: 'hidden' }}>
      <video
        ref={v1}
        src="img/hero-loop.mp4"
        autoPlay muted playsInline preload="auto"
        onCanPlay={onCanPlay}
        aria-hidden="true"
        disablePictureInPicture
        style={{ ...sharedStyle, opacity: ready && active === 1 ? 1 : (ready ? 0 : 0) }}
      />
      <video
        ref={v2}
        src="img/hero-loop.mp4"
        muted playsInline preload="auto"
        aria-hidden="true"
        disablePictureInPicture
        style={{ ...sharedStyle, opacity: ready && active === 2 ? 1 : 0 }}
      />
    </div>
  );
}

// ── Tropical ambience chip — procedural birds + wind/leaves via Web Audio
function JungleChip() {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(36);
  const ctxRef = React.useRef(null);
  const nodesRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const birdTimerRef = React.useRef(null);

  const stop = React.useCallback(() => {
    if (birdTimerRef.current) { clearTimeout(birdTimerRef.current); birdTimerRef.current = null; }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (nodesRef.current) {
      try { nodesRef.current.master.gain.linearRampToValueAtTime(0.0001, (ctxRef.current?.currentTime ?? 0) + 0.4); } catch (e) {}
    }
    setTimeout(() => {
      if (ctxRef.current) { try { ctxRef.current.close(); } catch (e) {} ctxRef.current = null; nodesRef.current = null; }
    }, 500);
  }, []);

  const start = React.useCallback(() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    ctxRef.current = ctx;

    // Master out
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.6);
    master.connect(ctx.destination);

    // ── Wind / leaves: filtered pink-ish noise with slow LFO
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    let b0=0,b1=0,b2=0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.18;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 700;
    noiseFilter.Q.value = 0.6;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.32;
    // Slow LFO modulating filter freq → gusty leaves
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 380;
    lfo.connect(lfoGain).connect(noiseFilter.frequency);
    noise.connect(noiseFilter).connect(noiseGain).connect(master);
    noise.start();
    lfo.start();

    // ── Bird chirps: random short FM-ish blips
    const birdBus = ctx.createGain();
    birdBus.gain.value = 0.85;
    const birdReverbDelay = ctx.createDelay(0.5);
    birdReverbDelay.delayTime.value = 0.18;
    const reverbFb = ctx.createGain();
    reverbFb.gain.value = 0.25;
    const reverbWet = ctx.createGain();
    reverbWet.gain.value = 0.35;
    birdBus.connect(birdReverbDelay);
    birdReverbDelay.connect(reverbFb).connect(birdReverbDelay);
    birdReverbDelay.connect(reverbWet).connect(master);
    birdBus.connect(master);

    const chirp = () => {
      if (!ctxRef.current) return;
      const t = ctx.currentTime;
      // Pick a bird "voice"
      const pattern = Math.random();
      const baseFreq = 1400 + Math.random() * 2400;
      const notes = pattern < 0.3 ? 1 : pattern < 0.75 ? 2 + Math.floor(Math.random()*3) : 5 + Math.floor(Math.random()*3);
      const noteDur = 0.05 + Math.random() * 0.09;
      const gap = 0.02 + Math.random() * 0.05;
      const pan = (Math.random() - 0.5) * 1.4;
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (panner) { panner.pan.value = pan; panner.connect(birdBus); }
      for (let n = 0; n < notes; n++) {
        const start = t + n * (noteDur + gap);
        const osc = ctx.createOscillator();
        osc.type = Math.random() < 0.5 ? 'sine' : 'triangle';
        const noteShift = (Math.random() - 0.5) * 600;
        const f0 = baseFreq + noteShift;
        osc.frequency.setValueAtTime(f0, start);
        osc.frequency.exponentialRampToValueAtTime(f0 * (1 + (Math.random()-0.3) * 0.4), start + noteDur);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(0.22, start + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, start + noteDur);
        osc.connect(g);
        g.connect(panner || birdBus);
        osc.start(start);
        osc.stop(start + noteDur + 0.02);
      }
      // Schedule next chirp
      const nextGap = 350 + Math.random() * 2600;
      birdTimerRef.current = setTimeout(chirp, nextGap);
    };
    birdTimerRef.current = setTimeout(chirp, 400);

    nodesRef.current = { master, noise, lfo };

    // Animate scrub progress while playing
    const tick = () => {
      setProgress(p => (p + 0.05) % 100);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const toggle = () => {
    if (playing) { stop(); setPlaying(false); }
    else { start(); setPlaying(true); }
  };

  React.useEffect(() => () => stop(), [stop]);

  const accent = '#b5532e';
  return (
    <div
      className="nt-video-chip"
      onClick={toggle}
      role="button"
      aria-pressed={playing}
      aria-label={playing ? 'Pausar sonido de selva' : 'Reproducir sonido de selva'}
      style={{
        position: 'absolute', top: 110, right: 48,
        background: 'rgba(13,13,10,0.55)', backdropFilter: 'blur(12px)',
        border: `1px solid ${playing ? 'rgba(181,83,46,0.55)' : 'rgba(250,245,231,0.18)'}`,
        padding: '14px 16px', borderRadius: 4,
        display: 'flex', flexDirection: 'column', gap: 10, minWidth: 280, maxWidth: 320,
        cursor: 'pointer', userSelect: 'none',
        boxShadow: playing ? '0 0 0 1px rgba(181,83,46,0.25), 0 8px 24px rgba(181,83,46,0.18)' : 'none',
        transition: 'border-color .2s, box-shadow .2s',
        zIndex: 3,
      }}
    >
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.12em', color: '#faf5e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>AUDIO · CHIRRIPÓ</span>
        {playing && <span style={{ color: accent, display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, animation: 'nt-pulse 1.2s ease-in-out infinite' }} />LIVE
        </span>}
      </div>
      <div style={{ height: 3, background: 'rgba(250,245,231,0.2)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: accent, transition: playing ? 'none' : 'width .3s' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
        <span style={{
          width: 28, height: 28, borderRadius: '50%', background: accent, color: '#fff',
          fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          paddingLeft: playing ? 0 : 2, flexShrink: 0,
        }}>{playing ? '╵╵' : '▶'}</span>
        <span style={{ fontSize: 11, letterSpacing: '0.14em', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {playing ? 'AVES · SELVA' : 'TOCÁ PARA OÍR'}
        </span>
      </div>
    </div>
  );
}

(function injectJungleCss() {
  if (document.getElementById('jungle-chip-css')) return;
  const css = document.createElement('style');
  css.id = 'jungle-chip-css';
  css.textContent = `
    @keyframes nt-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.4); }
    }
  `;
  document.head.appendChild(css);
})();
