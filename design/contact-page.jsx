// Contacto — booking & contact page
// ───────────────────────────────────────────────────────────
// Hero · contact card grid · booking form · payment methods ·
// map placeholder · FAQ. Direct path from interest → reservation.

function ContactPage() {
  return (
    <div className="nt-frame nt-dir-b" style={{ position: 'relative', background: '#faf5e7' }}>
      <NTNav active="contact" />

      {/* ── Hero ──────────────────────────────────────── */}
      <section style={cpStyles.hero}>
        <div className="nt-photo" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(img/foggy-bridge.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,13,10,0.55) 0%, rgba(13,13,10,0.92) 100%)' }} />
        <div style={cpStyles.heroInner}>
          <div style={cpStyles.heroEye}><span style={cpStyles.dot} />HABLEMOS</div>
          <h1 style={cpStyles.heroH1}>
            Decime <em style={{ color: '#b5532e', fontStyle: 'normal' }}>cuándo</em><br/>
            y armamos el resto.
          </h1>
          <p style={cpStyles.heroLead}>
            Respondo el mismo día, casi siempre en menos de dos horas.
            WhatsApp, correo, o el formulario de abajo — vos elegís.
          </p>
        </div>
      </section>

      {/* ── Quick contact cards ───────────────────────── */}
      <section style={cpStyles.quickCards}>
        <ContactCard
          accent="#25D366"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.1-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1.1 2.8.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.9 3.3 1.4 5.2 1.4 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>}
          href="https://wa.me/50689494655" label="WhatsApp"
          value="+506 8949-4655"
          sub="Respuesta el mismo día"
          cta="Abrir chat"
        />
        <ContactCard
          accent="#b5532e"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>}
          href="mailto:hola@nancytourscr.com" label="Correo"
          value="hola@nancytourscr.com"
          sub="Para consultas largas"
          cta="Escribir correo"
        />
        <ContactCard
          accent="#c99a3f"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>}
          href="https://maps.google.com/?q=Heredia+Mercedes+Norte+Costa+Rica" label="Ubicación"
          value="Heredia, Mercedes Norte"
          sub="Del AMPM, 100m E y 25m S"
          cta="Abrir en Maps"
        />
        <ContactCard
          accent="#1f3a2b"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>}
          href="https://wa.me/50689494655" label="Atención"
          value="Lun — Sáb · 7AM-7PM"
          sub="Domingo solo emergencias"
          cta="Ver horario"
        />
      </section>

      {/* ── Form + Payments ───────────────────────────── */}
      <section style={cpStyles.formSection}>
        <div style={cpStyles.formCol}>
          <div style={cpStyles.formEye}>★ &nbsp;FORMULARIO DE COTIZACIÓN</div>
          <h2 style={cpStyles.formH2}>Contame qué tenés ganas de hacer.</h2>
          <p style={cpStyles.formP}>
            Llená los datos y al darle "Enviar" se abre WhatsApp con un mensaje
            ya armado para mí. Solo tenés que apretar enviar en WhatsApp.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = e.currentTarget;
              const v = (k) => (f.elements.namedItem(k)?.value || '').trim();
              const msg = [
                '¡Hola Nancy! Quiero hacer una consulta:',
                '',
                `• Nombre: ${v('nombre') || '—'}`,
                `• Email: ${v('email') || '—'}`,
                `• Grupo: ${v('grupo') || '—'}`,
                `• Fecha tentativa: ${v('fecha') || '—'}`,
                `• Tour de interés: ${v('tour') || '—'}`,
                '',
                v('mensaje') ? `Detalles:\n${v('mensaje')}` : '',
              ].filter(Boolean).join('\n');
              const url = 'https://wa.me/50689494655?text=' + encodeURIComponent(msg);
              window.open(url, '_blank', 'noopener');
            }}
            style={{ marginTop: 28 }}>
            <div style={cpStyles.formGrid}>
              <FormField label="Tu nombre" placeholder="María Solís" name="nombre" />
              <FormField label="Email" placeholder="maria@correo.com" name="email" type="email" />
              <FormField label="WhatsApp" placeholder="+506 ..." name="whatsapp" type="tel" />
              <FormField label="¿Cuántos van?" placeholder="6 personas" name="grupo" />
              <FormField label="Fecha tentativa" placeholder="14 jun · sáb" name="fecha" />
              <FormField label="Tour de interés" placeholder="Bajos del Toro" select name="tour" />
            </div>

            <FormField label="Contame más" placeholder="Tipo de grupo, edades, qué les gustaría hacer, requerimientos especiales..." textarea name="mensaje" />

            <div style={cpStyles.formFooter}>
              <label style={cpStyles.checkRow}>
                <input type="checkbox" name="consent" required style={{ marginRight: 8 }} />
                Confirmo que quiero contactar a Nancy por WhatsApp
              </label>
              <button type="submit" className="nt-btn nt-btn-wa" style={{ padding: '16px 28px', fontSize: 14, border: 'none', cursor: 'pointer' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', color: '#25D366', fontSize: 11, fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>w</span>
                Enviar por WhatsApp &nbsp;→
              </button>
            </div>
          </form>
        </div>

        <div id="pago" style={cpStyles.payCol}>
          <div style={cpStyles.formEye}>★ &nbsp;APARTÁ TU CUPO</div>
          <h2 style={cpStyles.payH2}>Métodos de pago.</h2>
          <p style={cpStyles.formP}>
            Apartá tu lugar con un 50% al confirmar. El saldo el día del tour.
          </p>

          <div style={cpStyles.payGrid}>
            <PayOption label="SINPE móvil" sub="A nombre de Nancy V." chip="8949-4655" />
            <PayOption label="Depósito BN" sub="Cuenta colones" chip="200-12345-6" />
            <PayOption label="Depósito BAC" sub="Cuenta colones" chip="987654321" />
            <PayOption label="Efectivo" sub="El día del tour" chip="₡ / $" />
          </div>

          <div style={cpStyles.policy}>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#1a160e' }}>
              Política de cancelación
            </div>
            <ul style={cpStyles.policyList}>
              <li>Cancelaciones con más de 7 días — reembolso completo.</li>
              <li>Entre 3 y 7 días — 50% reembolso o cambio de fecha.</li>
              <li>Menos de 3 días — cambio de fecha (1 vez).</li>
              <li>Si yo cancelo por clima — reembolso completo o reagendamos.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Map placeholder ───────────────────────────── */}
      <section style={cpStyles.mapSection}>
        <div className="nt-photo" style={cpStyles.mapBg}>
          {/* Stylized "map" graphic — actual map embed goes here later */}
          <svg width="100%" height="100%" viewBox="0 0 1200 380" preserveAspectRatio="xMidYMid slice">
            <rect width="1200" height="380" fill="#1f3a2b" />
            {/* fake topographic curves */}
            {Array.from({ length: 14 }).map((_, i) => (
              <path key={i}
                d={`M -50 ${40 + i * 28} Q 300 ${80 + i * 22} 600 ${30 + i * 28} T 1250 ${50 + i * 24}`}
                stroke="rgba(250,245,231,0.06)" strokeWidth="1" fill="none" />
            ))}
            {/* roads */}
            <path d="M 0 200 Q 300 180 600 220 T 1200 200" stroke="rgba(250,245,231,0.18)" strokeWidth="2" fill="none" strokeDasharray="6 6" />
            {/* pin */}
            <g transform="translate(600 200)">
              <circle r="36" fill="none" stroke="#b5532e" strokeWidth="1" opacity="0.4" />
              <circle r="22" fill="none" stroke="#b5532e" strokeWidth="1.5" opacity="0.7" />
              <circle r="10" fill="#b5532e" />
              <circle r="3" fill="#faf5e7" />
            </g>
          </svg>
        </div>
        <div style={cpStyles.mapCard}>
          <div style={cpStyles.formEye}>★ &nbsp;PUNTO DE SALIDA HABITUAL</div>
          <h2 style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', margin: '8px 0 12px', color: '#1a160e' }}>
            Heredia, Mercedes Norte.
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#3a3328' }}>
            Del AMPM, 100 metros este y 25 sur.<br/>
            <strong>Provincia:</strong> Heredia, 40102 · Costa Rica
          </p>
          <a href="https://maps.google.com/?q=Mercedes+Norte+Heredia+Costa+Rica" target="_blank" rel="noopener" style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, color: '#b5532e', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            Ver en Google Maps →
          </a>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section style={cpStyles.faq}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ ...cpStyles.formEye, color: '#b5532e' }}>★ &nbsp;PREGUNTAS FRECUENTES</div>
          <h2 style={{ ...cpStyles.formH2, color: '#faf5e7', marginBottom: 40 }}>Lo que más me preguntan.</h2>
          <FAQItem q="¿Qué hago si llueve el día del tour?" a="Si la ruta lo permite, salimos igual — Costa Rica es verde porque llueve. Si el clima es peligroso (cierre de parque, deslave, etc.) yo cancelo y te reagendo sin costo." />
          <FAQItem q="¿Aceptan grupos con adultos mayores?" a="¡Por supuesto! De hecho es una de mis especialidades. Tengo tours específicos de ritmo suave para tercera edad — sin caminatas largas ni terreno difícil." />
          <FAQItem q="¿Las reservaciones son por persona o por grupo?" a="Por persona en los tours abiertos al público (Chirripó, Tortuguero, etc.). Para tours privados se cotiza por grupo desde 2 personas." />
          <FAQItem q="¿Incluye comida y transporte?" a="Casi siempre sí. Cada tour tiene su lista de incluidos y excluidos en la página de detalle. Cuando no, lo aclaro al confirmar." />
          <FAQItem q="¿Y si soy turista extranjero?" a="Bienvenido. Hablo español e inglés. El sello ICT está en trámite — pronto van a verlo abajo en el sitio." />
        </div>
      </section>

      <NTFooter />

      <a href="https://wa.me/50689494655" target="_blank" rel="noopener" aria-label="WhatsApp Nancy" className="nt-wa-float" style={{ position: 'absolute', right: 28, bottom: 28 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.1-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1.1 2.8.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.9 3.3 1.4 5.2 1.4 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
      </a>
    </div>
  );
}

function ContactCard({ accent, icon, label, value, sub, cta, href = '#' }) {
  return (
    <a href={href} style={{
      background: '#fff', border: '1px solid rgba(31,58,43,0.1)',
      padding: 28, display: 'flex', flexDirection: 'column', gap: 18,
      cursor: 'pointer', textDecoration: 'none', color: '#1a160e',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: accent + '18', color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', fontWeight: 700, color: '#6b6256', fontFamily: 'Bricolage Grotesque, sans-serif', marginBottom: 6 }}>{label.toUpperCase()}</div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em', color: '#1a160e', wordBreak: 'break-word' }}>{value}</div>
        <div style={{ fontSize: 12, color: '#6b6256', marginTop: 4 }}>{sub}</div>
      </div>
      <span style={{ marginTop: 'auto', fontSize: 13, fontWeight: 700, color: accent }}>{cta} →</span>
    </a>
  );
}

function FormField({ label, placeholder, textarea, select, name, type = 'text' }) {
  const baseStyle = {
    background: '#fff',
    border: '1px solid rgba(31,58,43,0.15)',
    padding: '14px 16px',
    fontSize: 14, color: '#1a160e',
    fontFamily: 'Inter, sans-serif',
    width: '100%', boxSizing: 'border-box',
    outline: 'none',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{
        fontSize: 11, letterSpacing: '0.16em', fontWeight: 700,
        color: '#6b6256', fontFamily: 'Bricolage Grotesque, sans-serif',
      }}>{label.toUpperCase()}</label>
      {textarea ? (
        <textarea name={name} placeholder={placeholder} rows={5}
          style={{ ...baseStyle, minHeight: 120, resize: 'vertical', fontFamily: 'inherit' }} />
      ) : select ? (
        <select name={name} defaultValue=""
          style={{ ...baseStyle, appearance: 'none', backgroundImage: 'linear-gradient(45deg, transparent 50%, #1a160e 50%), linear-gradient(135deg, #1a160e 50%, transparent 50%)', backgroundPosition: 'calc(100% - 18px) 50%, calc(100% - 13px) 50%', backgroundSize: '5px 5px, 5px 5px', backgroundRepeat: 'no-repeat', paddingRight: 40 }}>
          <option value="" disabled>{placeholder}</option>
          <option>Cerro Chirripó</option>
          <option>Bajos del Toro</option>
          <option>Tortuguero</option>
          <option>Volcán Poás</option>
          <option>Cavernas de Venado</option>
          <option>Ballenas Uvita</option>
          <option>Otro / a medida</option>
        </select>
      ) : (
        <input type={type} name={name} placeholder={placeholder} style={baseStyle} />
      )}
    </div>
  );
}

function PayOption({ label, sub, chip }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid rgba(31,58,43,0.15)',
      padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 17, fontWeight: 700, color: '#1a160e' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#6b6256', marginTop: 4 }}>{sub}</div>
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600,
        background: '#1f3a2b', color: '#faf5e7',
        padding: '8px 12px', alignSelf: 'flex-start',
      }}>{chip}</div>
    </div>
  );
}

function FAQItem({ q, a }) {
  return (
    <div style={{
      borderTop: '1px solid rgba(250,245,231,0.12)',
      padding: '24px 0',
      display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 40,
      alignItems: 'flex-start',
    }}>
      <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 22, fontWeight: 700, color: '#faf5e7', letterSpacing: '-0.01em' }}>{q}</div>
      <div style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(250,245,231,0.75)' }}>{a}</div>
    </div>
  );
}

const cpStyles = {
  hero: { position: 'relative', minHeight: '80vh', overflow: 'hidden' },
  heroInner: { position: 'absolute', bottom: 80, left: 48, color: '#faf5e7', maxWidth: 760 },
  heroEye: {
    fontSize: 11, letterSpacing: '0.22em', fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '8px 14px', border: '1px solid rgba(250,245,231,0.3)', borderRadius: 999,
    marginBottom: 24,
  },
  dot: { width: 7, height: 7, borderRadius: '50%', background: '#b5532e' },
  heroH1: {
    fontFamily: 'Bricolage Grotesque, sans-serif',
    fontSize: 104, lineHeight: 0.95, fontWeight: 800, letterSpacing: '-0.04em',
    margin: 0, color: '#faf5e7',
  },
  heroLead: { fontSize: 17, lineHeight: 1.6, maxWidth: 540, marginTop: 24, color: 'rgba(250,245,231,0.85)' },

  quickCards: {
    padding: '64px 48px 0',
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18,
  },

  formSection: {
    padding: '64px 48px 96px',
    display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 56,
  },
  formCol: {},
  formEye: { fontSize: 11, letterSpacing: '0.22em', fontWeight: 700, color: '#b5532e', marginBottom: 18 },
  formH2: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 48, fontWeight: 800,
    letterSpacing: '-0.03em', lineHeight: 1, color: '#1a160e', margin: '0 0 16px',
    textWrap: 'pretty',
  },
  formP: { fontSize: 15, lineHeight: 1.6, color: '#3a3328', maxWidth: 540 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 28, marginBottom: 18 },
  formFooter: { marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 },
  checkRow: { fontSize: 13, color: '#3a3328', display: 'flex', alignItems: 'center', gap: 10 },
  checkbox: { width: 18, height: 18, border: '1.5px solid #1a160e', display: 'inline-block', marginRight: 4 },

  payCol: {},
  payH2: {
    fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 48, fontWeight: 800,
    letterSpacing: '-0.03em', lineHeight: 1, color: '#1a160e', margin: '0 0 16px',
  },
  payGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 24 },

  policy: {
    background: '#faf0db', border: '1px solid #c99a3f',
    padding: 22, marginTop: 28,
  },
  policyList: {
    fontSize: 13, color: '#3a3328', lineHeight: 1.7, margin: 0, paddingLeft: 18,
  },

  mapSection: { position: 'relative', height: 380 },
  mapBg: { position: 'absolute', inset: 0 },
  mapCard: {
    position: 'absolute', top: 50, left: 48, maxWidth: 380,
    background: '#fff', padding: 32, border: '1px solid rgba(31,58,43,0.1)',
  },

  faq: { background: '#1a160e', color: '#faf5e7', padding: '96px 48px' },
};

window.ContactPage = ContactPage;
