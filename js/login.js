// Refs
const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const pass  = document.getElementById('password');
const emailError = document.getElementById('emailError');
const pwdError   = document.getElementById('pwdError');
const toast = document.getElementById('toast');
const btn   = document.getElementById('submitBtn');
const toggle = document.getElementById('togglePwd');

// Mostrar/ocultar contraseña
if (toggle) {
  toggle.addEventListener('click', () => {
    const t = pass.type === 'password' ? 'text' : 'password';
    pass.type = t;
    toggle.textContent = t === 'password' ? '👁' : '🙈';
    pass.focus();
  });
}

function showToast(kind, msg){
  if (!toast) return;
  toast.style.display = 'block';
  toast.style.color = kind === 'ok' ? '#0f6d28' : '#9f1c1c';
  toast.textContent = msg;
}

// Submit
if (form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validaciones mínimas
    let ok = true;
    if (!email.value || !email.checkValidity()){ emailError.style.display='block'; ok=false; }
    else emailError.style.display='none';

    if (!pass.value || pass.value.length < 6){ pwdError.style.display='block'; ok=false; }
    else pwdError.style.display='none';

    if (!ok){ showToast('err','Revisa los campos.'); return; }

    btn.disabled = true; btn.textContent = 'Validando…';

    try {
      // Asegura usuarios sembrados desde JSON
      if (typeof ensureSeededUsers === 'function') await ensureSeededUsers();

      // Busca por email y compara password (demo académica)
      const u = (typeof findUserByEmail === 'function') ? findUserByEmail(email.value) : null;
      if (!u || u.password !== pass.value) {
        showToast('err','Credenciales inválidas.');
        return;
      }

      // Sesión simulada
      sessionStorage.setItem('role', u.rol || 'admin');
      sessionStorage.setItem('userEmail', u.email);
      sessionStorage.setItem('userName', u.nombre);

      showToast('ok','¡Bienvenida! Redirigiendo…');
      setTimeout(()=> location.href = 'admin.html', 600);
    } catch (err) {
      showToast('err', err.message || 'Error al iniciar sesión.');
    } finally {
      btn.disabled = false; btn.textContent = 'INICIAR SESIÓN';
    }
  });
}

