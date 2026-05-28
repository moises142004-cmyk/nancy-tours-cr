// Logo showcase — using the user's final logo design
// ───────────────────────────────────────────────────────────
// Three application contexts: on cream paper, on dark surface,
// and the mark-only version isolated for nav/social/favicon.

function LogoOnCream() {
  return (
    <div style={logoShowStyles.card}>
      <img src="img/logo-nancy-transparent.png" alt="Nancy Tours Costa Rica"
           style={{ maxWidth: '92%', maxHeight: '78%', objectFit: 'contain' }} />
      <div style={logoShowStyles.caption}>Aplicación principal · sobre papel crema</div>
    </div>
  );
}

function LogoOnDark() {
  return (
    <div style={{ ...logoShowStyles.card, background: '#1f3a2b' }}>
      <img src="img/logo-nancy-light.png" alt="Nancy Tours Costa Rica"
           style={{
             maxWidth: '88%', maxHeight: '76%', objectFit: 'contain',
           }} />
      <div style={{ ...logoShowStyles.caption, color: 'rgba(250,245,231,0.65)' }}>
        Aplicación sobre superficie oscura · versión clara
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <div style={logoShowStyles.card}>
      <img src="img/logo-nancy-mark-transparent.png" alt="Nancy Tours · marca"
           style={{ width: 160, height: 160, objectFit: 'contain' }} />
      <div style={{ marginTop: 8, fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 14, color: '#1f3a2b', letterSpacing: '0.08em' }}>
        NANCY <span style={{ fontWeight: 500, opacity: 0.7 }}>tours cr</span>
      </div>
      <div style={logoShowStyles.caption}>Marca aislada · favicon, redes, avatar</div>
    </div>
  );
}

const logoShowStyles = {
  card: {
    width: '100%', height: '100%',
    background: '#faf0db',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: 24, gap: 8,
    position: 'relative',
  },
  caption: {
    position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center',
    fontSize: 10, color: '#6b6256',
    letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
  },
};

window.LogoOnCream = LogoOnCream;
window.LogoOnDark = LogoOnDark;
window.LogoMark = LogoMark;
// noop — older shared defs no longer needed
window.SharedWoodDefs = function() { return null; };
