// js/permissions.js

// 1. Mapa de páginas a roles permitidos
export const permissions = {
  'Masterpage.html':      ['Administrador', 'Técnico'],
  'Empleados.html':       ['Administrador', 'Técnico'],
  'Equipos.html':         ['Administrador', 'Técnico'],
  'Usuarios.html':        ['Administrador'],
  'Informes.html':        ['Administrador','Técnico','Invitado'],
  'Cronogramas.html':     ['Administrador', 'Técnico'],
  // ...añade aquí las futuras páginas
};

// 2. Mapa para generar menú dinámico
export const menuItems = [
  { label: 'Inicio',           href: 'Masterpage.html',   roles: ['Administrador','Técnico','Invitado'] },
  { label: 'Empleados',        href: 'Empleados.html',    roles: ['Administrador','Técnico'] },
  { label: 'Equipos',          href: 'Equipos.html',      roles: ['Administrador','Técnico'] },
  { label: 'Usuarios',         href: 'Usuarios.html',     roles: ['Administrador'] },
  { label: 'Informes',         href: 'Informes.html',     roles: ['Administrador','Técnico','Invitado'] },
  { label: 'Cronograma',       href: 'Cronogramas.html',  roles: ['Administrador','Técnico'] },
  // …
];


/**
 * Comprueba acceso a la página actual y, si no está permitido, redirige.
 */
export function guardPage() {
  const u = sessionStorage.getItem('usuario');
  if (!u) {
    alert('Debes iniciar sesión primero.');
    return location.href = 'Login.html';
  }
  const { tipoUsuario } = JSON.parse(u);
  const page = location.pathname.split('/').pop();
  const allowed = permissions[page] || [];
  if (!allowed.includes(tipoUsuario)) {
    alert('No tienes permiso para ver esta página.');
    return location.href = tipoUsuario === 'Invitado'
      ? 'Informes.html'
      : 'Masterpage.html';
  }
}

/**
 * Genera el menú lateral según el rol actual.
 * Debes llamar a esta función _antes_ de inyectar manualmente
 * los <a> del slide-menu.
 */
export function buildMenu(containerId = 'slideMenu') {
  const u = sessionStorage.getItem('usuario');
  if (!u) return;
  const { tipoUsuario } = JSON.parse(u);
  const nav = document.getElementById(containerId);
  nav.innerHTML = ''; // limpia
  menuItems.forEach(item => {
    if (item.roles.includes(tipoUsuario)) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      nav.appendChild(a);
    }
  });
  // + botón Salir
  const salir = document.createElement('a');
  salir.href = '#';
  salir.textContent = 'Salir';
  salir.onclick = () => {
    sessionStorage.removeItem('usuario');
    location.href = 'Login.html';
  };
  nav.appendChild(salir);
}
