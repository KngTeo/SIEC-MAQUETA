// frontend/js/permission.js
(function(){
  // 1) Mapas de permisos
  const permissions = {
    'Masterpage.html':      ['Administrador','Técnico','Invitado'],
    'Empleados.html':       ['Administrador','Técnico'],
    'Equipos.html':         ['Administrador','Técnico'],
    'Usuarios.html':        ['Administrador'],
    'Informes.html':        ['Administrador','Técnico','Invitado'],
    'Cronogramas.html':     ['Administrador','Técnico'],
    'MantenimientoPreventivo.html': ['Administrador','Técnico'],
    'MantenimientoCorrectivo.html': ['Administrador','Técnico'],
    // … añade aquí nuevas páginas …
  };

  // 2) Definición del menú lateral
  const menuItems = [
    { label: 'Inicio',           href: 'Masterpage.html',              roles: ['Administrador','Técnico','Invitado'] },
    { label: 'Empleados',        href: 'Empleados.html',               roles: ['Administrador','Técnico'] },
    { label: 'Equipos',          href: 'Equipos.html',                 roles: ['Administrador','Técnico'] },
    { label: 'Usuarios',         href: 'Usuarios.html',                roles: ['Administrador'] },
    { label: 'Informes',         href: 'Informes.html',                roles: ['Administrador','Técnico','Invitado'] },
    { label: 'Cronograma',       href: 'Cronogramas.html',             roles: ['Administrador','Técnico'] },
    { label: 'Preventivo',       href: 'MantenimientoPreventivo.html',  roles: ['Administrador','Técnico'] },
    { label: 'Correctivo',       href: 'MantenimientoCorrectivo.html',  roles: ['Administrador','Técnico'] },
    // … futuros módulos …
  ];

  // 3) Función que protege la página actual
  function guardPage() {
    const raw = localStorage.getItem('usuario');
    if (!raw) {
      alert('Debes iniciar sesión primero.');
      return window.location.href = 'Login.html';
    }

    let user;
    try {
      user = JSON.parse(raw);
    } catch {
      localStorage.removeItem('usuario');
      return window.location.href = 'Login.html';
    }

    const { tipoUsuario, nombreUsuario } = user;
    // Mostrar nombre en el header si existe el span
    const span = document.getElementById('usuarioLogueado');
    if (span) span.textContent = nombreUsuario;

    // Determinar página
    const page = location.pathname.split('/').pop();
    const allowed = permissions[page] || [];

    if (!allowed.includes(tipoUsuario)) {
      alert('No tienes permiso para ver esta página.');
      const destino = (tipoUsuario === 'Invitado')
        ? 'Informes.html'
        : 'Masterpage.html';
      return window.location.href = destino;
    }
  }

  // 4) Función que genera el menú lateral dinámicamente
  function buildMenu(containerId = 'slideMenu') {
    const raw = localStorage.getItem('usuario');
    if (!raw) return;
    const { tipoUsuario } = JSON.parse(raw);

    const nav = document.getElementById(containerId);
    if (!nav) return;

    // Limpiar contenido actual
    nav.innerHTML = '';

    // Inyectar cada ítem
    menuItems.forEach(item => {
      if (item.roles.includes(tipoUsuario)) {
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        nav.appendChild(a);
      }
    });

    // Botón Salir
    const aSalir = document.createElement('a');
    aSalir.href = '#';
    aSalir.textContent = 'Salir';
    aSalir.onclick = e => {
      e.preventDefault();
      localStorage.removeItem('usuario');
      window.location.href = 'Login.html';
    };
    nav.appendChild(aSalir);
  }

  // 5) Ejecutar protección y menú al cargar DOM
  document.addEventListener('DOMContentLoaded', () => {
    guardPage();
    buildMenu();
  });
})();
