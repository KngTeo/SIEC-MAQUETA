// frontend/asignaciones.js
$(document).ready(() => {
  console.log('👉 asignaciones.js cargado');

  const API_BASE     = 'http://localhost:3000/api/asignaciones';
  const $modal       = $('#asignarModal');
  const $empSelect   = $('#empleadoSelect');
  const $eqSelect    = $('#equipoSelect');
  const $accion      = $('#accion');
  const $observacion = $('#observacion');
  const $tbody       = $('#historialAsignaciones');

  // Abrir modal y recargar selects
  $('#openModal').on('click', () => {
    $accion.val('Asignar');
    $observacion.val('');
    cargarEmpleados();
    cargarEquipos();
    $modal.modal('show');
  });

  // POST asignación/desasignación
  $('#saveAssignment').on('click', () => {
    const body = {
      empleadoId:  $empSelect.val(),
      equipoId:    $eqSelect.val(),
      accion:      $accion.val(),
      observacion: $observacion.val().trim()
    };
    if (!body.empleadoId || !body.equipoId) {
      return alert('Por favor selecciona un empleado y un equipo.');
    }
    fetch(API_BASE, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    })
    .then(res => res.ok 
      ? res.json() 
      : res.json().then(e => Promise.reject(e.message || res.status))
    )
    .then(json => {
      alert(json.message);
      $modal.modal('hide');
      cargarHistorial();
    })
    .catch(err => {
      console.error('❌ Error guardando asignación:', err);
      alert('No se pudo procesar la asignación.');
    });
  });

  // Carga lista de empleados para el select
  function cargarEmpleados() {
    fetch(`${API_BASE}/empleados/lista`)
      .then(res => res.ok 
        ? res.json() 
        : Promise.reject(res.status)
      )
      .then(list => {
        $empSelect.empty();
        list.forEach(e => {
          $empSelect.append(
            `<option value="${e.EmpleadoID}">${e.Nombre}</option>`
          );
        });
      })
      .catch(err => {
        console.error('❌ Error cargando empleados:', err);
        alert('No se pudo cargar la lista de empleados.');
      });
  }

  // Carga lista de equipos para el select
  function cargarEquipos() {
    fetch(`${API_BASE}/equipos/lista`)
      .then(res => res.ok 
        ? res.json() 
        : Promise.reject(res.status)
      )
      .then(list => {
        $eqSelect.empty();
        list.forEach(eq => {
          $eqSelect.append(
            `<option value="${eq.EquipoID}">${eq.NumeroSerie}</option>`
          );
        });
      })
      .catch(err => {
        console.error('❌ Error cargando equipos:', err);
        alert('No se pudo cargar la lista de equipos.');
      });
  }

  // Carga el historial completo de asignaciones
  function cargarHistorial() {
    fetch(API_BASE)
      .then(res => res.ok 
        ? res.json() 
        : Promise.reject(res.status)
      )
      .then(list => {
        $tbody.empty();
        list.forEach(a => {
          $tbody.append(`
            <tr>
              <td>${a.Empleado}</td>
              <td>${a.Equipo}</td>
              <td>${a.Observacion || ''}</td>
              <td>${a.Accion}</td>
              <td>${new Date(a.Fecha).toLocaleString()}</td>
            </tr>
          `);
        });
      })
      .catch(err => {
        console.error('❌ Error cargando historial:', err);
        alert('No se pudo cargar el historial de asignaciones.');
      });
  }

  // Inicial
  cargarHistorial();
});
