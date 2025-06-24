$(document).ready(() => {
  // Abrir el modal
  $('#openModal').click(() => {
    $('#asignarModal').modal('show');

    // Cargar empleados
    fetch('http://localhost:3000/api/asignaciones/empleados/lista')
      .then(r => r.json())
      .then(data => {
        const sel = $('#empleadoSelect').empty();
        data.forEach(e => {
          sel.append(`<option value="${e.EmpleadoID}">${e.Nombre}</option>`);
        });
      });

    // Cargar equipos
    fetch('http://localhost:3000/api/asignaciones/equipos/lista')
      .then(r => r.json())
      .then(data => {
        const sel = $('#equipoSelect').empty();
        data.forEach(eq => {
          sel.append(`<option value="${eq.EquipoID}">${eq.NumeroSerie}</option>`);
        });
      });
  });

  // Guardar asignación o desasignación
  $('#saveAssignment').click(() => {
    const body = {
      empleadoId  : $('#empleadoSelect').val(),
      equipoId    : $('#equipoSelect').val(),
      accion      : $('#accion').val(),
      observacion : $('#observacion').val()
    };

    fetch('http://localhost:3000/api/asignaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(r => r.json())
      .then(data => {
        alert(data.message);
        $('#asignarModal').modal('hide');
        cargarHistorial();
      })
      .catch(err => {
        console.error(err);
        alert('No se pudo procesar la solicitud');
      });
  });

  // Cargar historial
  function cargarHistorial() {
    fetch('http://localhost:3000/api/asignaciones')
      .then(r => r.json())
      .then(data => {
        const tbody = $('#historialAsignaciones').empty();
        data.forEach(a => {
          tbody.append(`
            <tr>
              <td>${a.Empleado}</td>
              <td>${a.Equipo}</td>
              <td>${a.Observacion || ''}</td>
              <td>${a.Accion}</td>
              <td>${new Date(a.Fecha).toLocaleString()}</td>
            </tr>
          `);
        });
      });
  }

  // Ejecutar al cargar la página
  cargarHistorial();
});
