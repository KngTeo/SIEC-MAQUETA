// login.js

console.log('login.js cargado');

function validateLogin() {
  console.log('validateLogin() ejecutado');

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const btn = document.getElementById('btnSubmit');
  btn.disabled = true;

  fetch('http://localhost:3000/api/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombreUsuario: username, contrasena: password })
  })
  .then(res => {
    console.log('Respuesta status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('login response →', data);
    btn.disabled = false;

    if (data.tipoUsuario) {
      // 1) Creamos el objeto usando 'username' del input
      const usuarioObj = {
        nombreUsuario: username,
        tipoUsuario:   data.tipoUsuario
      };
      console.log('Guardando en localStorage →', usuarioObj);
      localStorage.setItem('usuario', JSON.stringify(usuarioObj));

      // 2) Redirigimos según rol
      if (data.tipoUsuario === 'Invitado') {
        window.location.href = 'Informes.html';
      } else {
        // Tanto Técnico como Administrador van a Masterpage
        window.location.href = 'Masterpage.html';
      }
    } else {
      alert(data.message || 'Credenciales inválidas');
    }
  })
  .catch(err => {
    btn.disabled = false;
    console.error('Error al iniciar sesión:', err);
    alert('Error de conexión. Intenta de nuevo.');
  });

  return false; // evita recarga del form
}
