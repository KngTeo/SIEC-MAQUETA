// auth.js

// Validar que el usuario haya iniciado sesión
function validarSesion() {
  const user = JSON.parse(localStorage.getItem("usuario"));
  if (!user || !user.tipoUsuario) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "Login.html";
    return null;
  }
  return user;
}

// Validar que tenga uno de los roles permitidos
function validarPermisos(rolesPermitidos) {
  const user = validarSesion();
  if (!user) return;

  if (!rolesPermitidos.includes(user.tipoUsuario)) {
    alert("No tienes permiso para acceder a este módulo.");
    window.location.href = "Masterpage.html"; // O página de acceso denegado
  }
}
// Función de logout
function logout() {
  localStorage.clear();
  window.location.href = "Login.html";
}
