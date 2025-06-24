function validateLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/api/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombreUsuario: username,
      contrasena: password
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.tipoUsuario) {
      alert(data.message);

      // Redirige según tipo de usuario
      if (data.tipoUsuario === 'Administrador') {
        window.location.href = 'Masterpage.html';
      } else if (data.tipoUsuario === 'Técnico') {
        window.location.href = 'Masterpage.html';
      } else if (data.tipoUsuario === 'Invitado') {
        window.location.href = 'Informes.html';
      }
    } else {
      alert(data.message || 'Credenciales inválidas');
    }
  })
  .catch(err => {
    console.error('Error al iniciar sesión:', err);
    alert('Error de conexión');
  });

  return false; // Previene recarga del formulario
}

if (data.tipoUsuario) {
  // Guardar en localStorage
  localStorage.setItem("usuario", JSON.stringify({
    nombreUsuario: data.nombreUsuario,
    tipoUsuario: data.tipoUsuario
  }));

  // Redirigir
  if (data.tipoUsuario === 'Invitado') {
    window.location.href = 'Informes.html';
  } else {
    window.location.href = 'Masterpage.html';
  }
}
