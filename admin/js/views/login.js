// Nancy Tours admin — login view
// =====================================================================
// Single password field. Email is hardcoded in ADM_API. On success the
// router takes over via hashchange.

window.ADM_REGISTER_VIEW('login', async (app) => {
  app.innerHTML = `
    <div class="adm-login">
      <div class="adm-login-card">
        <h1>Nancy Tours · Admin</h1>
        <p class="adm-muted">Entrá con tu password.</p>
        <form id="adm-login-form" novalidate>
          <input id="adm-pw" name="password" type="password" autocomplete="current-password" placeholder="Password" />
          <button type="submit" class="adm-btn">Entrar →</button>
          <p id="adm-login-err" class="adm-login-err" hidden></p>
        </form>
      </div>
    </div>
  `;
  const form = document.getElementById('adm-login-form');
  const pw = document.getElementById('adm-pw');
  const err = document.getElementById('adm-login-err');
  pw.focus();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true;
    const password = pw.value;
    if (!password) {
      err.textContent = 'Escribí el password.';
      err.hidden = false;
      return;
    }
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Entrando…';
    try {
      await window.ADM_API.login(password);
      location.hash = '#dashboard';
    } catch (e2) {
      console.error('[ADM.login]', e2);
      err.textContent = 'Password incorrecto.';
      err.hidden = false;
      pw.value = '';
      pw.focus();
      const card = document.querySelector('.adm-login-card');
      card.classList.add('adm-shake');
      setTimeout(() => card.classList.remove('adm-shake'), 400);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Entrar →';
    }
  });
});
