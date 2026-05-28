// Logo concepts for Nancy Tours Costa Rica
// Four directions sit on small artboards so the user can pick a vector.

function LogoA() {
  // Monogram NT inside a mountain triangle — echoes the original FAMILY TOUR
  // mountain-M but personal to Nancy. Works tiny (favicon) + huge (signage).
  return (
    <div style={logoStyles.card}>
      <svg viewBox="0 0 200 200" width="120" height="120">
        <polygon points="100,28 178,162 22,162" fill="none" stroke="#1f3a2b" strokeWidth="6" strokeLinejoin="round" />
        <polygon points="100,52 156,148 44,148" fill="#b5532e" />
        <text x="100" y="128" textAnchor="middle" fontFamily="Instrument Serif, Georgia, serif" fontSize="56" fill="#faf5e7" fontStyle="italic">NT</text>
      </svg>
      <div style={logoStyles.lockup}>
        <div style={{...logoStyles.name, fontFamily: 'Instrument Serif, Georgia, serif'}}>Nancy Tours</div>
        <div style={logoStyles.sub}>COSTA&nbsp;&nbsp;RICA</div>
      </div>
      <div style={logoStyles.caption}>A · Monograma cumbre</div>
    </div>
  );
}

function LogoB() {
  // Botanical wordmark — leaf flourish under "Nancy" — connects to the Volcán
  // Poás mural illustration vibe Nancy already likes (per her FB cover).
  return (
    <div style={logoStyles.card}>
      <svg viewBox="0 0 280 140" width="220" height="110">
        <text x="140" y="62" textAnchor="middle" fontFamily="Instrument Serif, Georgia, serif" fontStyle="italic" fontSize="58" fill="#1f3a2b">Nancy</text>
        <path d="M 60 84 Q 140 70 220 84" stroke="#b5532e" strokeWidth="2" fill="none" />
        <path d="M 90 84 Q 100 76 110 84 Q 100 92 90 84 Z" fill="#b5532e" />
        <path d="M 130 84 Q 140 74 150 84 Q 140 94 130 84 Z" fill="#b5532e" />
        <path d="M 170 84 Q 180 76 190 84 Q 180 92 170 84 Z" fill="#b5532e" />
        <text x="140" y="118" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="0.32em" fill="#1f3a2b" fontWeight="600">TOURS · COSTA RICA</text>
      </svg>
      <div style={logoStyles.caption}>B · Botánico Nancy</div>
    </div>
  );
}

function LogoC() {
  // Bold sans wordmark with circle/sun mark — more modern, premium feel.
  // Works well on dark/light, scales well on social.
  return (
    <div style={logoStyles.card}>
      <svg viewBox="0 0 280 140" width="220" height="110">
        <circle cx="50" cy="70" r="28" fill="#b5532e" />
        <path d="M 30 78 Q 50 56 70 78" stroke="#1f3a2b" strokeWidth="3" fill="none" />
        <circle cx="50" cy="64" r="6" fill="#1f3a2b" />
        <text x="92" y="64" fontFamily="Bricolage Grotesque, sans-serif" fontSize="26" fontWeight="800" fill="#1f3a2b" letterSpacing="-0.02em">NANCY</text>
        <text x="92" y="92" fontFamily="Bricolage Grotesque, sans-serif" fontSize="18" fontWeight="500" fill="#1f3a2b" letterSpacing="-0.01em">tours costa rica</text>
      </svg>
      <div style={logoStyles.caption}>C · Sol horizonte</div>
    </div>
  );
}

function LogoD() {
  // Stamp/badge style — circular seal with the rooster/jaguar feel of national
  // park signs Nancy already photographs at.
  return (
    <div style={logoStyles.card}>
      <svg viewBox="0 0 200 200" width="140" height="140">
        <circle cx="100" cy="100" r="92" fill="none" stroke="#1f3a2b" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#1f3a2b" strokeWidth="0.8" />
        <path d="M 30 100 Q 65 78 100 100 Q 135 122 170 100" stroke="#b5532e" strokeWidth="3" fill="none" />
        <text x="100" y="92" textAnchor="middle" fontFamily="Instrument Serif, Georgia, serif" fontSize="22" fontStyle="italic" fill="#1f3a2b">Nancy</text>
        <text x="100" y="118" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" letterSpacing="0.32em" fill="#1f3a2b">TOURS · CR</text>
        <text x="100" y="148" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8" letterSpacing="0.28em" fill="#6b6256">DESDE 2010</text>
      </svg>
      <div style={logoStyles.caption}>D · Sello expedición</div>
    </div>
  );
}

const logoStyles = {
  card: {
    width: '100%', height: '100%',
    background: '#faf5e7',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: 24, gap: 12,
    fontFamily: 'Inter, sans-serif',
  },
  lockup: { textAlign: 'center', marginTop: -8 },
  name: { fontSize: 26, color: '#1f3a2b', lineHeight: 1 },
  sub: { fontSize: 10, letterSpacing: '0.28em', color: '#1f3a2b', marginTop: 6, fontWeight: 600 },
  caption: {
    marginTop: 'auto',
    fontSize: 11,
    color: '#6b6256',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
};

window.LogoA = LogoA;
window.LogoB = LogoB;
window.LogoC = LogoC;
window.LogoD = LogoD;
