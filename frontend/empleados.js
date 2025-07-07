// frontend/empleados.js

$(document).ready(function () {
  const API = 'http://localhost:3000/api/empleados';
  const $form = $('#userForm');
  const $table = $('#userTable');

  // 1) READ: cargar tabla al iniciar
  cargarEmpleados();

  // 2) CREATE: al enviar formulario
  $form.on('submit', function (e) {
    e.preventDefault();
    const nuevo = {
      cedula:   $('#cedula').val().trim(),
      nombre:   $('#nombre').val().trim(),
      apellidos:$('#apellidos').val().trim(),
      telefono: $('#telefono').val().trim(),
      cargo:    $('#cargo').val(),
      area:     $('#area').val(),
      correo:   $('#correo').val().trim(),
      empresa:  $('#empresa').val().trim(),
      activo:   $('#activo').val()
    };

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      alert(data.message);
      $form[0].reset();
      // agregar al tope de la tabla
      $table.prepend(filaEmpleadoHTML(data.empleadoId, nuevo));
    })
    .catch(err => {
      console.error('❌ Error al agregar:', err);
      alert('No se pudo agregar el empleado.');
    });
  });

  // 3) READ helper
  function cargarEmpleados() {
    fetch(API)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(list => {
        $table.empty();
        list.forEach(emp => {
          $table.append(filaEmpleadoHTML(emp.EmpleadoID, {
            cedula: emp.Cedula,
            nombre: emp.Nombre,
            apellidos: emp.Apellido,
            telefono: emp.Telefono,
            cargo: emp.Cargo,
            area: emp.Area,
            correo: emp.Correo,
            empresa: emp.Empresa,
            activo: emp.Activo
          }));
        });
      })
      .catch(err => {
        console.error('❌ Error al cargar empleados:', err);
        alert('No se pudo cargar la lista de empleados.');
      });
  }

  // 4) UPDATE / DELETE vía delegación
  $table
    .on('click', '.btn-eliminar', function () {
      const $row = $(this).closest('tr');
      const id = $row.data('id');
      if (!confirm('¿Eliminar este empleado?')) return;
      fetch(`${API}/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          alert(data.message);
          $row.remove();
        })
        .catch(err => {
          console.error('❌ Error al eliminar:', err);
          alert('No se pudo eliminar el empleado.');
        });
    })
    .on('click', '.btn-editar', function () {
      const $row = $(this).closest('tr');
      const id = $row.data('id');
      // pedir nuevos valores
      const cedula = prompt('Cédula:', $row.find('.col-cedula').text());
      if (cedula===null) return;
      const nombre = prompt('Nombre:', $row.find('.col-nombre').text());
      if (nombre===null) return;
      const apellidos = prompt('Apellidos:', $row.find('.col-apellidos').text());
      if (apellidos===null) return;
      const actualizado = { cedula, nombre, apellidos };
      // enviar PUT
      fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado)
      })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        alert(data.message);
        // actualizar fila visualmente
        $row.find('.col-cedula').text(cedula);
        $row.find('.col-nombre').text(nombre);
        $row.find('.col-apellidos').text(apellidos);
      })
      .catch(err => {
        console.error('❌ Error al editar:', err);
        alert('No se pudo actualizar el empleado.');
      });
    });

  // Helper para renderizar una fila
  function filaEmpleadoHTML(id, e) {
    return `
      <tr data-id="${id}">
        <td>${id}</td>
        <td class="col-cedula">${e.cedula||''}</td>
        <td class="col-nombre">${e.nombre||''}</td>
        <td class="col-apellidos">${e.apellidos||''}</td>
        <td>${e.telefono||''}</td>
        <td>${e.cargo||''}</td>
        <td>${e.area||''}</td>
        <td>${e.correo||''}</td>
        <td>${e.empresa||''}</td>
        <td>${e.activo||''}</td>
        <td><button class="btn btn-warning btn-sm btn-editar">Editar</button></td>
        <td><button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button></td>
      </tr>
    `;
  }
});
