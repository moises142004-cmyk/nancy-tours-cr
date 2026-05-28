// Palette + type system reference card — sits at the top of the canvas
// so the design language reads at a glance before scrolling to comps.

function PaletteCard() {
  const swatches = [
    { name: 'Terracota',     hex: '#B5532E', role: 'Primario · CTAs, acentos',     fg: '#fff' },
    { name: 'Verde bosque',  hex: '#1F3A2B', role: 'Secundario · Texto, fondos',   fg: '#fff' },
    { name: 'Crema',         hex: '#F4ECD8', role: 'Base · Fondo principal',       fg: '#1a160e' },
    { name: 'Crema claro',   hex: '#FAF5E7', role: 'Cards, secciones alternas',    fg: '#1a160e' },
    { name: 'Ocre',          hex: '#C99A3F', role: 'Acento sutil · highlights',    fg: '#1a160e' },
    { name: 'Tinta',         hex: '#1A160E', role: 'Texto principal',              fg: '#fff' },
  ];

  return (
    <div style={{
      width: '100%', height: '100%',
      padding: '40px 48px',
      background: '#faf5e7',
      fontFamily: 'Inter, sans-serif',
      color: '#1a160e',
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
    }}>
      <div>
        <div style={{
          fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#6b6256', fontWeight: 600, marginBottom: 10,
        }}>Sistema base · compartido entre las 3 direcciones</div>
        <div style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontSize: 42, lineHeight: 1.1, color: '#1f3a2b',
        }}>Tierra, bosque, cielo de Chirripó.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        {swatches.map(s => (
          <div key={s.name} style={{
            background: s.hex, color: s.fg,
            borderRadius: 4, padding: '16px 14px', minHeight: 130,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
            <div>
              <div style={{ fontSize: 10, opacity: 0.75, fontFamily: 'JetBrains Mono, monospace' }}>{s.hex}</div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, lineHeight: 1.3 }}>{s.role}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, paddingTop: 8, borderTop: '1px solid rgba(31,58,43,0.15)' }}>
        <TypeSlot label="Dirección A · Editorial" display="Instrument Serif" body="Inter" />
        <TypeSlot label="Dirección B · Cinematográfica" display="Bricolage Grotesque" body="Inter" />
        <TypeSlot label="Dirección C · Mural folk" display="DM Serif Display" body="Work Sans" />
      </div>
    </div>
  );
}

function TypeSlot({ label, display, body }) {
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6256', fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: `${display}, Georgia, serif`, fontSize: 32, lineHeight: 1, color: '#1f3a2b' }}>Vamos a caminar</div>
      <div style={{ fontFamily: `${body}, sans-serif`, fontSize: 13, color: '#1a160e', marginTop: 8, lineHeight: 1.5 }}>
        Tours guiados por toda Costa Rica. 15 años de experiencia, equipo profesional y rutas únicas.
      </div>
      <div style={{ fontSize: 10, color: '#6b6256', marginTop: 10, fontFamily: 'JetBrains Mono, monospace' }}>
        {display} / {body}
      </div>
    </div>
  );
}

window.PaletteCard = PaletteCard;
