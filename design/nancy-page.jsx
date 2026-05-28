// Sobre Nancy — long-form story page
// ───────────────────────────────────────────────────────────
// Portrait hero · story chapters · credentials · equipment ·
// gallery · testimonials. Editorial pace, not a CV dump.

function NancyPage() {
  return (
    <div className="nt-frame nt-dir-b" style={{ position: 'relative', background: '#faf5e7' }}>
      <NTNav active="nancy" />

      {/* ── Hero portrait ─────────────────────────────── */}
      <section style={npStyles.hero}>
        <div className="nt-photo" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(img/chirripo-summit.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 25%',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,13,10,0.4) 0%, rgba(13,13,10,0.92) 100%)' }} />
        <div style={npStyles.heroInner}>
          <div style={npStyles.heroEye}><span style={npStyles.dot} />TU GUÍA · DESDE HEREDIA</div>
          <h1 style={npStyles.heroH1}>Nancy.</h1>
          <p style={npStyles.heroSub}>
            Licenciada en Turismo · 15 años caminando<br/>
            cada provincia de Costa Rica.
          </p>
          <div style={npStyles.heroStats}>
            <div style={npStyles.statCell}><strong>200+</strong><span>tours guiados</span></div>
            <div style={npStyles.statCell}><strong>47</strong><span>destinos cubiertos</span></div>
            <div style={npStyles.statCell}><strong>3.820 m</strong><span>punto más alto</span></div>
            <div style={npStyles.statCell}><strong>4.9 ★</strong><span>reseña promedio</span></div>
          </div>
        </div>
      </section>

      {/* ── Story chapters — magazine pace ────────────── */}
      <section style={npStyles.story}>
        <div style={npStyles.chapter}>
          <div style={npStyles.chapNum}>01</div>
          <div>
            <h2 style={npStyles.chapH}>Empecé caminando con mi familia.</h2>
            <p style={npStyles.chapP}>
              Nací en Heredia, en Mercedes Norte. De chica los fines de semana mi papá nos
              llevaba al Volcán Barva en la tina del Land Cruiser. Llegábamos en piyama,
              desayunábamos gallo pinto arriba del cerro, bajábamos antes del mediodía.
              Esa rutina me marcó: para mí caminar es algo que se hace en familia, despacio,
              con tiempo de mirar.
            </p>
          </div>
        </div>

        <div style={npStyles.chapter}>
          <div style={npStyles.chapNum}>02</div>
          <div>
            <h2 style={npStyles.chapH}>Estudié turismo en serio.</h2>
            <p style={npStyles.chapP}>
              En 2005 entré a la Universidad de Costa Rica a estudiar Turismo Ecológico.
              Cuatro años de carrera, tesis sobre rutas comunitarias en la Zona de los
              Santos. Salí con el título de Licenciada — no es un guía improvisado de fin
              de semana, es una profesión con métodos, ética y responsabilidad.
            </p>
          </div>
        </div>

        <div style={npStyles.chapter}>
          <div style={npStyles.chapNum}>03</div>
          <div>
            <h2 style={npStyles.chapH}>Quince años y contando.</h2>
            <p style={npStyles.chapP}>
              Desde 2010 he guiado más de 200 tours. Grupos chicos de 3 personas, grupos
              grandes de 30. Adolescentes en su primer Chirripó, abuelas en su primera
              ballena. He estado en cada provincia: caminé Talamanca, navegué Tortuguero,
              acampé en Corcovado. Cada salida tiene su historia.
            </p>
          </div>
        </div>

        <div style={npStyles.chapter}>
          <div style={npStyles.chapNum}>04</div>
          <div>
            <h2 style={npStyles.chapH}>La promesa.</h2>
            <p style={{ ...npStyles.chapP, fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, lineHeight: 1.5, fontStyle: 'italic', color: '#1f3a2b' }}>
              “Terminar el día cansados, pero felices. Eso es lo que prometo. Lo demás
              — las fotos, los recuerdos, los amigos nuevos — viene solo.”
            </p>
          </div>
        </div>
      </section>

      {/* ── Credentials ───────────────────────────────── */}
      <section style={npStyles.credentials}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={npStyles.credentialsEye}>★ &nbsp;CREDENCIALES &amp; FORMACIÓN</div>
          <div style={npStyles.credGrid}>
            {[
              { yr: '2009', t: 'Licenciatura en Turismo Ecológico', d: 'Universidad de Costa Rica · UCR' },
              { yr: '2011', t: 'Curso de primeros auxilios en zonas remotas', d: 'Cruz Roja Costarricense' },
              { yr: '2014', t: 'Certificación de guía local SINAC', d: 'Sistema Nacional de Áreas de Conservación' },
              { yr: '2018', t: 'Operación de radios VHF', d: 'CONATEL · radio comunicación profesional' },
              { yr: '2021', t: 'Capacitación rescate vertical básico', d: 'Bomberos de Costa Rica' },
              { yr: '2024', t: 'Trámite ICT en curso', d: 'Instituto Costarricense de Turismo · esperando sello' },
            ].map((c, i) => (
              <div key={i} style={npStyles.credCard}>
                <div style={npStyles.credYr}>{c.yr}</div>
                <div style={npStyles.credT}>{c.t}</div>
                <div style={npStyles.credD}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipment ─────────────────────────────────── */}
      <section style={npStyles.equipment}>
        <div style={npStyles.eqLeft}>
          <div style={{ ...npStyles.credentialsEye, color: '#b5532e' }}>★ &nbsp;EQUIPO QUE LLEVO</div>
          <h2 style={npStyles.eqH2}>Cada tour sale con esto.</h2>
          <p style={npStyles.eqP}>
            Nada de improvisación. Mi equipo de comunicación y orientación es lo que
            me permite trabajar con tranquilidad en zonas sin señal celular.
          </p>
        </div>
        <div style={npStyles.eqList}>
          {[
            { i: '◴', t: 'Radios VHF (x4)', d: 'Comunicación a 5-10 km entre el grupo, incluso en bosque cerrado.' },
            { i: '◉', t: 'GPS Garmin eTrex', d: 'Tracking de rutas + waypoints prearmados de los lugares conocidos.' },
            { i: '✛', t: 'Botiquín de zona remota', d: 'Renovado cada 6 meses. Vendas, suero, epinefrina, repelente serpiente.' },
            { i: '☂', t: 'Equipo de lluvia para todos', d: 'Capas plásticas extra siempre — el clima de CR es lo único impredecible.' },
            { i: '🜂', t: 'Linternas + baterías', d: 'Para los amaneceres en Chirripó y emergencias de retraso al bajar.' },
            { i: '✉', t: 'Plan de contacto', d: 'Antes de cada salida le mando ubicación al grupo de WhatsApp familiar.' },
          ].map((e, i) => (
            <div key={i} style={npStyles.eqItem}>
              <div style={npStyles.eqIcon}>{e.i}</div>
              <div>
                <div style={npStyles.eqItemT}>{e.t}</div>
                <div style={npStyles.eqItemD}>{e.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gallery ────────────────────────────────────── */}
      <section style={npStyles.gallery}>
        <div style={npStyles.galleryHead}>
          <div>
            <div style={{ ...npStyles.credentialsEye }}>★ &nbsp;GALERÍA</div>
            <h2 style={{ ...npStyles.eqH2, color: '#1a160e' }}>Postales de los tours.</h2>
          </div>
          <a href="tours.html" style={{ fontSize: 13, fontWeight: 700, color: '#b5532e', cursor: 'pointer', textDecoration: 'none' }}>Ver todas las fotos →</a>
        </div>
        <div style={npStyles.galleryGrid}>
          {[
            { img: 'img/chirripo-lakes.jpg', t: 'Lagunas del Chirripó', loc: 'Talamanca · 3.500 m' },
            { img: 'img/foggy-bridge.jpg', t: 'Puente colgante', loc: 'Monteverde · niebla' },
            { img: 'img/waterfall.jpg', t: 'Bajos del Toro', loc: 'Alajuela · cañón' },
            { img: 'img/cave.jpg', t: 'Cavernas de Venado', loc: 'San Carlos · subterráneo' },
            { img: 'img/boat-tour.jpg', t: 'Canales de Tortuguero', loc: 'Limón · lancha' },
            { img: 'img/whale.jpg', t: 'Ballena jorobada', loc: 'Uvita · Pacífico Sur' },
            { img: 'img/hiking-trail.jpg', t: 'Camino al Chirripó', loc: 'Subida día 1' },
            { img: 'img/tortuguero-group.jpg', t: 'Grupo en Tortuguero', loc: 'Posando al llegar' },
            { img: 'img/chirripo-sign.jpg', t: 'Chirripó · entrada', loc: 'Bandera + pancarta' },
          ].map((g, i) => (
            <div key={i} className="nt-photo" style={{
              ...npStyles.galleryCell,
              backgroundImage: `url(${g.img})`,
            }}>
              <div style={npStyles.galleryOverlay}>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 16 }}>{g.t}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>{g.loc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonial — single big block ────────────── */}
      <section style={npStyles.testi}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.18, overflow: 'hidden' }}>
          <img src="img/logo-nancy-light.png" alt="" style={{ position: 'absolute', right: -100, top: -40, width: 600, height: 'auto' }} />
        </div>
        <div style={{ position: 'relative', maxWidth: 900 }}>
          <div style={{ ...npStyles.credentialsEye, color: '#b5532e' }}>★ &nbsp;LO QUE DICEN</div>
          <blockquote style={npStyles.testiQ}>
            “Fuimos doce personas entre 30 y 72 años. Nancy nos llevó al Chirripó como
            si fuéramos su familia. Tres días impecables, comida casera, paradas en los
            mejores miradores. Mi mamá pudo subir hasta donde se animó y luego nos esperó
            con la cocinera. Vuelvo con ella el año que viene, sin dudar.”
          </blockquote>
          <div style={npStyles.testiAttr}>
            <strong>María Solís</strong> · San José<br/>
            <span style={{ opacity: 0.7 }}>Tour Chirripó, marzo 2025</span>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section style={npStyles.ctaBlock}>
        <h2 style={npStyles.ctaH2}>¿Salimos al monte juntos?</h2>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 28 }}>
          <a href="tours.html" className="nt-btn nt-btn-primary" style={{ padding: '16px 26px' }}>Ver próximos tours →</a>
          <a href="https://wa.me/50689494655" target="_blank" rel="noopener" className="nt-btn nt-btn-wa" style={{ padding: '16px 26px' }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', color: '#25D366', fontSize: 11, fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>w</span>
            WhatsApp directo
          </a>
        </div>
      </section>

      <NTFooter />

      <a href="https://wa.me/50689494655" target="_blank" rel="noopener" aria-label="WhatsApp Nancy" className="nt-wa-float" style={{ position: 'absolute', right: 28, bottom: 28 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.1-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1.1 2.8.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.9 3.3 1.4 5.2 1.4 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
      </a>
    </div>
  );
}

const npStyles = {
  hero: { position: 'relative', minHeight: '100vh', overflow: 'hidden' },
  heroInner: { position: 'absolute', bottom: 88, left: 48, color: '#faf5e7', maxWidth: 760 },
  heroEye: {
    fontSize: 11, letterSpacing: '0.22em', fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '8px 14px', border: '1px solid rgba(250,245,231,0.3)', borderRadius: 999,
    marginBottom: 20,
  },
  dot: { width: 7, height: 7, borderRadius: '50%', background: '#b5532e' },
  heroH1: {
    fontFamily: 'Bricolage Grotesque, sans-serif',
    fontSize: 168, lineHeight: 0.85, fontWeight: 800, letterSpacing: '-0.04em',
    margin: 0, color: '#faf5e7',
  },
  heroSub: {
    fontSize: 20, lineHeight: 1.4, marginTop: 24, fontWeight: 400,
    color: 'rgba(250,245,231,0.85)',
  },
  heroStats: {
    display: 'grid', gridTemplateColumns: 'repeat(4, max-content)', gap: 36,
    marginTop: 36,
  },
  statCell: {
    display: 'flex', flexDirection: 'column', paddingLeft: 16,
    borderLeft: '2px solid #b5532e',
  },

  story: { padding: '96px 48px', background: '#faf5e7', maxWidth: 1180, margin: '0 auto' },
  chapter: {
    display: 'grid', gridTemplateColumns: '120px 1fr', gap: 56,
    paddingBottom: 56, marginBottom: 56,
    borderBottom: '1px solid rgba(31,58,43,0.1)',
    alignItems: 'flex-start',
  },
  chapNum: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 56, fontWeight: 800,
    color: '#b5532e', letterSpacing: '-0.04em', lineHeight: 1,
  },
  chapH: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 40, fontWeight: 800,
    letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 18px', color: '#1a160e',
    textWrap: 'pretty',
  },
  chapP: { fontSize: 17, lineHeight: 1.7, color: '#3a3328', maxWidth: 720, margin: 0, textWrap: 'pretty' },

  credentials: { background: '#1a160e', color: '#faf5e7', padding: '96px 48px' },
  credentialsEye: { fontSize: 11, letterSpacing: '0.22em', fontWeight: 700, color: '#b5532e', marginBottom: 24 },
  credGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 },
  credCard: {
    background: 'rgba(250,245,231,0.04)', border: '1px solid rgba(250,245,231,0.12)',
    padding: 28,
  },
  credYr: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 22, fontWeight: 800,
    color: '#b5532e', letterSpacing: '-0.01em', marginBottom: 14,
  },
  credT: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 },
  credD: { fontSize: 12, color: 'rgba(250,245,231,0.6)', lineHeight: 1.6 },

  equipment: {
    background: '#faf5e7', padding: '96px 48px',
    display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 56,
  },
  eqLeft: {},
  eqH2: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 56, fontWeight: 800,
    letterSpacing: '-0.03em', lineHeight: 1, color: '#1a160e', margin: '8px 0 20px',
  },
  eqP: { fontSize: 16, lineHeight: 1.6, color: '#3a3328', maxWidth: 380 },
  eqList: { display: 'flex', flexDirection: 'column', gap: 20 },
  eqItem: {
    display: 'grid', gridTemplateColumns: '60px 1fr', gap: 20,
    paddingBottom: 20, borderBottom: '1px solid rgba(31,58,43,0.1)',
  },
  eqIcon: {
    fontSize: 32, color: '#b5532e', textAlign: 'center', lineHeight: 1,
  },
  eqItemT: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 4 },
  eqItemD: { fontSize: 13, lineHeight: 1.55, color: '#6b6256' },

  gallery: { background: '#faf5e7', padding: '40px 48px 96px' },
  galleryHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 },
  galleryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  galleryCell: {
    aspectRatio: '4/3', position: 'relative',
    backgroundSize: 'cover', backgroundPosition: 'center',
    overflow: 'hidden',
  },
  galleryOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(180deg, transparent, rgba(13,13,10,0.85))',
    color: '#faf5e7', padding: '40px 18px 16px',
  },

  testi: {
    background: '#1f3a2b', color: '#faf5e7',
    padding: '96px 48px', position: 'relative', overflow: 'hidden',
  },
  testiQ: {
    fontFamily: 'Bricolage Grotesque, sans-serif',
    fontSize: 32, lineHeight: 1.4, color: '#faf5e7',
    margin: '20px 0 32px', fontStyle: 'italic', fontWeight: 400,
    textWrap: 'pretty',
  },
  testiAttr: { fontSize: 14, color: 'rgba(250,245,231,0.85)' },

  ctaBlock: { background: '#b5532e', color: '#faf5e7', padding: '80px 48px', textAlign: 'center' },
  ctaH2: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 64, fontWeight: 800,
    letterSpacing: '-0.03em', lineHeight: 1, margin: 0, color: '#faf5e7',
  },
};

window.NancyPage = NancyPage;
