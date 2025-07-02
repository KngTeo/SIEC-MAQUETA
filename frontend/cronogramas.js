// cronogramas.js
document.addEventListener('DOMContentLoaded', () => {
  cargarEmpleados();
  cargarEquipos();
  cargarCronogramas();

  // Crear nuevo cronograma
  document
    .getElementById('cronogramaForm')
    .addEventListener('submit', e => {
      e.preventDefault();
      crearCronograma();
    });

  // Guardar edición desde modal
  document
    .getElementById('saveEdit')
    .addEventListener('click', e => {
      e.preventDefault();
      actualizarCronograma();
    });
});

// 1) Carga el <select> de empleados
function cargarEmpleados() {
  fetch('http://localhost:3000/api/cronogramas/empleados')
    .then(res => res.json())
    .then(data => {
      const sel = document.getElementById('empleadoSelect');
      sel.innerHTML = '<option value="">Seleccione un empleado</option>';
      data.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.EmpleadoID;
        opt.textContent = `${emp.Nombre} ${emp.Apellido}`;
        sel.append(opt);
      });
    })
    .catch(() => alert('No se pudieron cargar los empleados.'));
}

// 2) Carga el <select> de equipos
function cargarEquipos() {
  fetch('http://localhost:3000/api/cronogramas/equipos')
    .then(res => res.json())
    .then(data => {
      const sel = document.getElementById('equipoSelect');
      sel.innerHTML = '<option value="">Seleccione un equipo</option>';
      data.forEach(eq => {
        const opt = document.createElement('option');
        opt.value = eq.EquipoID;
        opt.textContent = eq.NumeroSerie;
        sel.append(opt);
      });
    })
    .catch(() => alert('No se pudieron cargar los equipos.'));
}

// 3) Crea un nuevo cronograma
function crearCronograma() {
  const body = {
    EmpleadoID : document.getElementById('empleadoSelect').value,
    EquipoID   : document.getElementById('equipoSelect').value,
    Fecha      : document.getElementById('fechaMantenimiento').value,
    Tipo       : document.getElementById('tipoMantenimiento').value,
    Observacion: document.getElementById('observaciones').value,
    Estado     : 'Pendiente'
  };

  fetch('http://localhost:3000/api/cronogramas', {
    method: 'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify(body)
  })
  .then(r => r.json())
  .then(({ message }) => {
    alert(message);
    document.getElementById('cronogramaForm').reset();
    cargarCronogramas();
  })
  .catch(() => alert('Error al registrar cronograma.'));
}

// 4) Listado y eventos de cronogramas
function cargarCronogramas() {
  fetch('http://localhost:3000/api/cronogramas')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('cronogramaTableBody');
      tbody.innerHTML = '';

      data.forEach(row => {
        // URL de acta según tipo
        const actaURL = row.Tipo === 'Correctivo'
          ? `MantenimientoCorrectivo.html?id=${row.ID}`
          : `MantenimientoPreventivo.html?id=${row.ID}`;

        // Solo si ya está 'Realizado' mostramos botón
        const btnActa = row.Estado === 'Realizado'
          ? `<a href="${actaURL}" class="btn btn-success btn-sm">
               <i class="bi bi-file-earmark-text"></i> Acta
             </a>`
          : '';

        // Fila completa
        const tr = document.createElement('tr');
        tr.dataset.id = row.ID;
        tr.innerHTML = `
          <td>${row.ID}</td>
          <td>${row.Empleado}</td>
          <td>${row.Equipo}</td>
          <td>${new Date(row.Fecha).toLocaleDateString()}</td>
          <td>${row.Tipo}</td>
          <td>${row.Observacion || ''}</td>
          <td>
            <select class="form-control form-control-sm estadoSelect">
              <option value="Pendiente" ${row.Estado==='Pendiente'?'selected':''}>
                Pendiente
              </option>
              <option value="Realizado" ${row.Estado==='Realizado'?'selected':''}>
                Realizado
              </option>
            </select>
          </td>
          <td>
            <button class="btn btn-primary btn-sm btn-edit">
              <i class="bi bi-pencil"></i> Editar
            </button>
            ${btnActa}
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Evento: cambio de estado
      document.querySelectorAll('.estadoSelect')
        .forEach(sel => {
          sel.onchange = () => {
            const tr = sel.closest('tr');
            const id = tr.dataset.id;
            const nuevo = sel.value;
            actualizarEstado(id, nuevo);
          };
        });

      // Evento: abrir modal de edición
      document.querySelectorAll('.btn-edit')
        .forEach(btn => {
          btn.onclick = () => {
            const tr = btn.closest('tr');
            const id = tr.dataset.id;
            abrirModalEdicion(tr, id);
          };
        });
    })
    .catch(() => alert('Error al listar cronogramas.'));
}

// 5) Actualiza solo el campo Estado
function actualizarEstado(id, Estado) {
  fetch(`http://localhost:3000/api/cronogramas/${id}`, {
    method:'PUT',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ Estado })
  })
  .then(r=>r.json())
  .then(({ message }) => {
    alert(message);
    cargarCronogramas();
  })
  .catch(() => alert('Error al actualizar estado.'));
}

// 6) Abre modal y precarga valores para editar
function abrirModalEdicion(tr, id) {
  // Asume que tienes un modal con campos #editId, #editFecha, etc.
  document.getElementById('editId').value = id;
  document.getElementById('editFecha').value =
    tr.children[3].textContent.split('/').reverse().join('-'); // ajusta si tu locale difiere
  document.getElementById('editTipo').value       = tr.children[4].textContent;
  document.getElementById('editObservacion').value= tr.children[5].textContent;
  document.getElementById('editEstado').value     = tr.children[6]
                                                   .querySelector('select').value;
  $('#editModal').modal('show');
}

// 7) Guarda la edición completa
function actualizarCronograma() {
  const id  = document.getElementById('editId').value;
  const body= {
    Fecha      : document.getElementById('editFecha').value,
    Tipo       : document.getElementById('editTipo').value,
    Observacion: document.getElementById('editObservacion').value,
    Estado     : document.getElementById('editEstado').value
  };
  fetch(`http://localhost:3000/api/cronogramas/${id}`, {
    method:'PUT',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify(body)
  })
  .then(r=>r.json())
  .then(({ message }) => {
    alert(message);
    $('#editModal').modal('hide');
    cargarCronogramas();
  })
  .catch(() => alert('Error al actualizar cronograma.'));
}
