window.ADM_REGISTER_VIEW('leads', async (app, param) => {
  app.innerHTML = `<p class="adm-loading">[leads coming in Task 19] · param: ${param || '—'}</p>`;
});
