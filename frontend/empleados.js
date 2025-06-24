/* ------------- AL ENVIAR EL FORMULARIO (CREATE) ------------- */
$('#userForm').submit(function (event) {
  event.preventDefault();

  const empleado = {
    nombre   : $('#nombre').val(),
    apellidos: $('#apellidos').val(),
    telefono : $('#telefono').val(),
    cargo    : $('#cargo').val(),
    area     : $('#area').val(),
    correo   : $('#correo').val(),
    empresa  : $('#empresa').val(),
    activo   : $('#activo').val()
  };

  fetch('http://localhost:3000/api/empleados', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(empleado)
  })
  .then(r => r.json())
  .then(data => {
    alert(data.message);

    /* ⬇️  Fila con data-id y clases correctas ⬇️ */
    $('#userTable').prepend(`
      <tr data-id="${data.empleadoId}">
        <td>${data.empleadoId}</td>
        <td>${empleado.nombre}</td>
        <td>${empleado.apellidos}</td>
        <td>${empleado.telefono}</td>
        <td>${empleado.cargo}</td>
        <td>${empleado.area}</td>
        <td>${empleado.correo}</td>
        <td>${empleado.empresa}</td>
        <td>${empleado.activo}</td>
        <td>
          <button class="btn btn-warning btn-sm btn-editar">Editar</button>
          <button class="btn btn-danger  btn-sm btn-eliminar">Eliminar</button>
          
        </td>
      </tr>
    `);

    $('#userForm')[0].reset();
  })
  .catch(err => {
    console.error('Error al registrar empleado:', err);
    alert('Error al agregar empleado.');
  });
});


/* ------------- ELIMINAR (DELETE) ------------- */
$(document).on('click', '.btn-eliminar', function () {
  const row = $(this).closest('tr');
  const id  = row.data('id');                 // ← ahora existe

  if (confirm('¿Estás seguro de eliminar este empleado?')) {
    fetch(`http://localhost:3000/api/empleados/${id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(data => {
        alert(data.message);
        row.remove();
      })
      .catch(err => {
        console.error('Error al eliminar:', err);
        alert('No se pudo eliminar el empleado.');
      });
  }
});


/* ------------- EDITAR (UPDATE) ------------- */
$(document).on('click', '.btn-editar', function () {
  const row = $(this).closest('tr');
  const id  = row.data('id');                 // ← ahora existe

  const nombre    = prompt('Nuevo nombre:'   , row.children().eq(1).text());
  const apellidos = prompt('Nuevo apellido:' , row.children().eq(2).text());
  const telefono  = prompt('Nuevo teléfono:' , row.children().eq(3).text());
  const cargo     = prompt('Nuevo cargo:'    , row.children().eq(4).text());
  const area      = prompt('Nueva área:'     , row.children().eq(5).text());
  const correo    = prompt('Nuevo correo:'   , row.children().eq(6).text());
  const empresa   = prompt('Nueva empresa:'  , row.children().eq(7).text());
  const activo    = prompt('¿Activo? (Si/No):', row.children().eq(8).text());

  const empleadoActualizado = {
    nombre, apellidos, telefono,
    cargo, area, correo, empresa, activo
  };

  fetch(`http://localhost:3000/api/empleados/${id}`, {
    method : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(empleadoActualizado)
  })
  .then(r => r.json())
  .then(data => {
    alert(data.message);

    // Actualiza la fila en la tabla
    row.children().eq(1).text(nombre);
    row.children().eq(2).text(apellidos);
    row.children().eq(3).text(telefono);
    row.children().eq(4).text(cargo);
    row.children().eq(5).text(area);
    row.children().eq(6).text(correo);
    row.children().eq(7).text(empresa);
    row.children().eq(8).text(activo);
  })
  .catch(err => {
    console.error('Error al editar:', err);
    alert('No se pudo editar el empleado.');
  });
});
//Mostrar tablas
$(document).ready(function () {
  fetch('http://localhost:3000/api/empleados')
    .then(res => res.json())
    .then(data => {
      data.forEach(emp => {
        $('#userTable').append(`
          <tr data-id="${emp.EmpleadoID}">
            <td>${emp.EmpleadoID}</td>
            <td>${emp.Nombre}</td>
            <td>${emp.Apellido}</td>
            <td>${emp.Telefono}</td>
            <td>${emp.Cargo}</td>
            <td>${emp.Area}</td>
            <td>${emp.Correo}</td>
            <td>${emp.Empresa}</td>
            <td>${emp.Activo}</td>
            <td>
              <button class="btn btn-warning btn-sm btn-editar">Editar</button>
              <button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
              
            </td>
          </tr>
        `);
      });
    });
});
