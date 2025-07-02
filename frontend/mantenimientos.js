// Función para alternar la visibilidad del menú lateral
function toggleMenu() {
    const slideMenu = document.getElementById('slideMenu');
    const mainContent = document.querySelector('.main-content');
    if (window.innerWidth < 768) { // Lógica para pantallas pequeñas (menú oculto por defecto)
        if (slideMenu.style.width === '250px') {
            slideMenu.style.width = '0';
        } else {
            slideMenu.style.width = '250px';
        }
    } else { // Lógica para pantallas grandes (menú fijo)
        // En desktop, el menú siempre debería estar visible
        slideMenu.style.width = '250px';
        mainContent.style.marginLeft = '250px';
    }
}

// Función para alternar la visibilidad de los submenús
function toggleSubmenu(submenuId) {
    const submenu = document.getElementById(submenuId);
    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
}

// Función para mostrar la sección correcta y ocultar las demás
function showSection(sectionId) {
    const sections = document.querySelectorAll('.app-section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
    // Asegurarse de ocultar el modal si está abierto al cambiar de sección
    $('#detailModal').modal('hide');
}

// Función para mostrar el modal de detalles
function showDetailModal() {
    // Aquí iría la lógica para cargar los datos de la cita en el modal
    $('#detailModal').modal('show');
}

// Función de ejemplo para aplicar filtros (requiere lógica de filtrado de datos real)
function applyFilters() {
    const searchText = document.getElementById('searchAppointments').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    const filterDate = document.getElementById('filterDate').value;
    const tableBody = document.getElementById('maintenanceTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let cells = row.getElementsByTagName('td');
        let rowText = row.innerText.toLowerCase();
        let rowStatus = cells[5].innerText.trim();
        let rowDate = cells[0].innerText.trim();

        let matchesSearch = rowText.includes(searchText);
        let matchesStatus = (filterStatus === '' || rowStatus === filterStatus);
        let matchesDate = (filterDate === '' || rowDate === filterDate);

        if (matchesSearch && matchesStatus && matchesDate) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

// Función de ejemplo para cerrar sesión
function logout() {
    // Redirigir a la página de login
    // window.location.href = 'Login.html';
}

// Mostrar el dashboard por defecto al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('dashboard');

    // Asegurarse de que el menú lateral se muestre en desktop por defecto
    if (window.innerWidth >= 768) {
        document.getElementById('slideMenu').style.width = '250px';
        document.querySelector('.main-content').style.marginLeft = '250px';
    }
});

// Asegurarse de que el menú se ajuste en móvil/desktop si se cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    const slideMenu = document.getElementById('slideMenu');
    const mainContent = document.querySelector('.main-content');
    if (window.innerWidth < 768) {
        slideMenu.style.width = '0';
        mainContent.style.marginLeft = '0';
    } else {
        slideMenu.style.width = '250px';
        mainContent.style.marginLeft = '250px';
    }
});