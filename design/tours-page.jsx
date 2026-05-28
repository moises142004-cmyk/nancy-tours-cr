// Tours page — full listing with filters
// ───────────────────────────────────────────────────────────
// Hero strip + sticky filter bar + grid of all tours organized
// by category. Mirrors the home's "B Cinematic" voice.

function ToursPage() {
  return (
    <div className="nt-frame nt-dir-b" style={{ position: 'relative', background: '#faf5e7' }}>
      <NTNav active="tours" />

      {/* ── Hero strip ────────────────────────────────── */}
      <section style={tpStyles.hero}>
        <div className="nt-photo" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(img/chirripo-lakes.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 35%',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,13,10,0.5) 0%, rgba(13,13,10,0.85) 100%)' }} />
        <div style={tpStyles.heroInner}>
          <div style={tpStyles.heroEye}><span style={tpStyles.dot} />CATÁLOGO COMPLETO</div>
          <h1 style={tpStyles.heroH1}>
            Trece tours.<br/>
            <span style={{ color: '#b5532e' }}>Un solo país.</span>
          </h1>
          <p style={tpStyles.heroLead}>
            Desde subir el techo de Costa Rica hasta navegar los canales del Caribe.
            Filtrá por lo que tenés ganas de hacer — yo me encargo del resto.
          </p>
        </div>
      </section>

      {/* ── Filter bar ────────────────────────────────── */}
      <section style={tpStyles.filterBar}>
        <FilterGroup label="Categoría" active="Todos" options={['Todos', 'Aventura', 'Día completo', 'Cultural', 'Tercera edad', 'Temporada', 'A medida']} />
        <FilterGroup label="Nivel" active="Todos" options={['Todos', 'Baja', 'Media', 'Alta']} />
        <FilterGroup label="Duración" active="Todas" options={['Todas', '1 día', '2 días', '3+ días']} />
        <div style={tpStyles.resultCount}><strong>13</strong> tours disponibles</div>
      </section>

      {/* ── Featured / next departure ─────────────────── */}
      <section style={tpStyles.featured}>
        <div style={tpStyles.featuredEye}>★ &nbsp;PRÓXIMA SALIDA · 14 JUN</div>
        <div style={tpStyles.featuredCard}>
          <div className="nt-photo" style={{
            ...tpStyles.featuredPhoto,
            backgroundImage: 'url(img/waterfall.jpg)',
          }} />
          <div style={tpStyles.featuredBody}>
            <span style={tpStyles.featuredTag}>DÍA COMPLETO · 4 CUPOS LIBRES</span>
            <h2 style={tpStyles.featuredH2}>Bajos del Toro</h2>
            <p style={tpStyles.featuredP}>
              Una de las cataratas más fotogénicas del país, escondida en un cañón verde.
              Caminata de 1.5 km descendente con cuerdas en los tramos finales. Almuerzo
              típico incluido en restaurante familiar de la zona.
            </p>
            <div style={tpStyles.featuredMeta}>
              <div><span style={ntMetaK}>FECHA</span><span style={ntMetaV}>Sábado 14 jun · 6 AM</span></div>
              <div><span style={ntMetaK}>SALIDA</span><span style={ntMetaV}>Heredia centro</span></div>
              <div><span style={ntMetaK}>INCLUYE</span><span style={ntMetaV}>Transporte + guía + almuerzo</span></div>
              <div><span style={ntMetaK}>QUÉ LLEVAR</span><span style={ntMetaV}>Bota cerrada, agua, repelente</span></div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginTop: 24 }}>
              <span style={{ ...ntMetaK, fontSize: 11 }}>POR PERSONA</span>
              <strong style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 40, fontWeight: 800, color: '#b5532e' }}>$85</strong>
              <a style={{
                marginLeft: 'auto',
                background: '#b5532e', color: '#fff', padding: '14px 22px',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}>Apartar cupo &nbsp;→</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── All tours grid grouped by category ────────── */}
      <section style={tpStyles.gridSection}>
        <h2 style={tpStyles.categoryH}>Aventura</h2>
        <div style={tpStyles.grid}>
          <NTTourCard num="01" img="img/chirripo-summit.jpg" tag="AVENTURA" title="Cerro Chirripó" slug="chirripo" loc="Pérez Zeledón · 3.820 m" date="13 — 15 JUN" duration="3 días · 2 noches" diff="Alta" cupo="6 / 10" price="$340" />
          <NTTourCard num="02" img="img/foggy-bridge.jpg" tag="AVENTURA" title="Volcán Barva" slug="volcan-barva" loc="Heredia · bosque nuboso" date="05 JUL · dom" duration="1 día" diff="Media" cupo="8 / 12" price="$75" />
          <NTTourCard num="03" img="img/hiking-trail.jpg" tag="AVENTURA" title="Cerro Chompipe" slug="cerro-chompipe" loc="San Rafael · ruta intermedia" date="22 JUN · dom" duration="1 día" diff="Media" cupo="10 / 12" price="$60" />
        </div>

        <h2 style={tpStyles.categoryH}>Día completo</h2>
        <div style={tpStyles.grid}>
          <NTTourCard num="04" img="img/waterfall.jpg" tag="DÍA" title="Bajos del Toro" slug="bajos-toro" loc="Alajuela · catarata oculta" date="14 JUN · sáb" duration="1 día" diff="Media" cupo="4 / 12" price="$85" />
          <NTTourCard num="05" img="img/cave.jpg" tag="DÍA" title="Cavernas de Venado" slug="cavernas-venado" loc="San Carlos · estalactitas" date="28 JUN · sáb" duration="1 día" diff="Media" cupo="8 / 12" price="$95" />
          <NTTourCard num="06" img="img/chirripo-sign.jpg" tag="DÍA" title="Volcán Poás" slug="volcan-poas" loc="Alajuela · cráter activo" date="20 JUL · dom" duration="1 día" diff="Baja" cupo="14 / 16" price="$70" />
        </div>

        <h2 style={tpStyles.categoryH}>Multi-día y temporada</h2>
        <div style={tpStyles.grid}>
          <NTTourCard num="07" img="img/boat-tour.jpg" tag="2 DÍAS" title="Tortuguero" slug="tortuguero" loc="Limón · canales caribeños" date="21 — 22 JUN" duration="2 días · 1 noche" diff="Baja" cupo="2 / 14" price="$220" />
          <NTTourCard num="08" img="img/whale.jpg" tag="TEMPORADA" title="Ballenas en Uvita" slug="ballenas-uvita" loc="Pacífico Sur · jul-oct" date="12 JUL · sáb" duration="1 día" diff="Baja" cupo="10 / 16" price="$110" />
          <NTTourCard num="09" img="img/tortuguero-group.jpg" tag="CULTURAL" title="Corcovado" slug="corcovado" loc="Osa · selva primaria" date="09 — 11 AGO" duration="3 días · 2 noches" diff="Alta" cupo="4 / 10" price="$480" />
        </div>

        <h2 style={tpStyles.categoryH}>Para tercera edad y familias</h2>
        <div style={tpStyles.grid}>
          <NTTourCard num="10" img="img/foggy-bridge.jpg" tag="TERCERA EDAD" title="Puentes colgantes" slug="puentes-colgantes" loc="Monteverde · ritmo suave" date="06 JUL · dom" duration="1 día" diff="Baja" cupo="12 / 16" price="$95" />
          <NTTourCard num="11" img="img/chirripo-sign.jpg" tag="CULTURAL" title="Sarchí + Grecia" slug="sarchi-grecia" loc="Pueblos tradicionales" date="13 JUL · dom" duration="1 día" diff="Baja" cupo="10 / 16" price="$65" />
          <NTTourCard num="12" img="img/boat-tour.jpg" tag="CULTURAL" title="Mercados de San José" slug="mercados-sj" loc="Capital · gastronomía local" date="27 JUL · sáb" duration="1 día" diff="Baja" cupo="14 / 16" price="$55" />
        </div>

        <h2 style={tpStyles.categoryH}>A medida</h2>
        <div style={tpStyles.grid}>
          <NTTourCard num="13" img="img/chirripo-lakes.jpg" tag="A MEDIDA" title="Tu propio tour" slug="a-medida" loc="A donde vos quieras ir" date="Coordiná fecha" duration="A elección" diff="—" cupo="—" price="Consultá" custom />
        </div>
      </section>

      {/* ── Custom tour CTA ───────────────────────────── */}
      <section style={tpStyles.ctaBlock}>
        <div style={{ maxWidth: 720 }}>
          <div style={tpStyles.featuredEye}>★ &nbsp;TOURS A MEDIDA</div>
          <h2 style={tpStyles.ctaH2}>¿No encontraste lo que buscabas?</h2>
          <p style={tpStyles.ctaP}>
            Armo tours privados para grupos de 2 a 20 personas. Empresariales,
            cumpleaños, escuelas, despedidas. Decime qué tenés ganas de hacer
            y dónde, y te armo un plan en menos de 48 horas.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <a href="https://wa.me/50689494655" target="_blank" rel="noopener" className="nt-btn nt-btn-wa" style={{ padding: '16px 24px' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', color: '#25D366', fontSize: 11, fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>w</span>
              Hablemos por WhatsApp
            </a>
            <a href="contacto.html" className="nt-btn nt-btn-ghost" style={{ color: '#faf5e7', borderColor: '#faf5e7', padding: '15px 24px' }}>Formulario de cotización →</a>
          </div>
        </div>
      </section>

      <NTFooter />

      <a href="https://wa.me/50689494655" target="_blank" rel="noopener" aria-label="WhatsApp Nancy" className="nt-wa-float" style={{ position: 'absolute', right: 28, bottom: 28 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.1-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1.1 2.8.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.9 3.3 1.4 5.2 1.4 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
      </a>
    </div>
  );
}

function FilterGroup({ label, active, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 10, letterSpacing: '0.18em', fontWeight: 700, color: '#6b6256', fontFamily: 'Bricolage Grotesque, sans-serif' }}>{label}</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map(o => (
          <span key={o} style={{
            padding: '6px 12px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            background: o === active ? '#1f3a2b' : '#fff',
            color: o === active ? '#faf5e7' : '#1a160e',
            border: o === active ? '1px solid #1f3a2b' : '1px solid rgba(31,58,43,0.15)',
            fontFamily: 'Inter, sans-serif',
          }}>{o}</span>
        ))}
      </div>
    </div>
  );
}

const tpStyles = {
  hero: { position: 'relative', minHeight: '80vh', overflow: 'hidden' },
  heroInner: { position: 'absolute', bottom: 64, left: 48, color: '#faf5e7', maxWidth: 760 },
  heroEye: {
    fontSize: 11, letterSpacing: '0.22em', fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '8px 14px', border: '1px solid rgba(250,245,231,0.3)', borderRadius: 999,
    marginBottom: 20,
  },
  dot: { width: 7, height: 7, borderRadius: '50%', background: '#b5532e' },
  heroH1: {
    fontFamily: 'Bricolage Grotesque, sans-serif',
    fontSize: 88, lineHeight: 0.95, fontWeight: 800, letterSpacing: '-0.04em',
    margin: 0, color: '#faf5e7',
  },
  heroLead: { fontSize: 16, lineHeight: 1.6, maxWidth: 540, marginTop: 18, color: 'rgba(250,245,231,0.85)' },
  filterBar: {
    background: '#faf5e7', padding: '32px 48px',
    borderBottom: '1px solid rgba(31,58,43,0.1)',
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 28, alignItems: 'flex-end',
  },
  resultCount: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 14, color: '#1a160e',
    textAlign: 'right',
  },
  featured: { padding: '64px 48px', background: '#faf5e7' },
  featuredEye: { fontSize: 11, letterSpacing: '0.22em', fontWeight: 700, color: '#b5532e', marginBottom: 18 },
  featuredCard: {
    display: 'grid', gridTemplateColumns: '5fr 6fr',
    background: '#fff', border: '1px solid rgba(31,58,43,0.1)',
    overflow: 'hidden',
  },
  featuredPhoto: { minHeight: 460, backgroundSize: 'cover', backgroundPosition: 'center' },
  featuredBody: { padding: 48, display: 'flex', flexDirection: 'column' },
  featuredTag: {
    fontSize: 10, letterSpacing: '0.18em', fontWeight: 800, color: '#b5532e',
    fontFamily: 'Bricolage Grotesque, sans-serif',
  },
  featuredH2: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 56, fontWeight: 800,
    letterSpacing: '-0.03em', lineHeight: 1, margin: '12px 0 16px',
  },
  featuredP: { fontSize: 15, lineHeight: 1.6, color: '#3a3328', maxWidth: 540 },
  featuredMeta: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px',
    padding: '24px 0', borderTop: '1px solid rgba(31,58,43,0.1)', borderBottom: '1px solid rgba(31,58,43,0.1)',
    marginTop: 24,
  },
  gridSection: { padding: '32px 48px 96px', background: '#faf5e7' },
  categoryH: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 32, fontWeight: 800,
    letterSpacing: '-0.02em', color: '#1a160e', margin: '48px 0 24px',
    paddingBottom: 14, borderBottom: '1px solid rgba(31,58,43,0.15)',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
  ctaBlock: {
    background: '#1f3a2b', color: '#faf5e7',
    padding: '96px 48px',
  },
  ctaH2: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 64, fontWeight: 800,
    letterSpacing: '-0.03em', lineHeight: 1, margin: '12px 0 18px', color: '#faf5e7',
  },
  ctaP: { fontSize: 17, lineHeight: 1.6, color: 'rgba(250,245,231,0.85)', maxWidth: 620 },
};

window.ToursPage = ToursPage;
