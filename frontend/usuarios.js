$(document).ready(function () {
  // Cargar todos los usuarios al iniciar
  fetch('http://localhost:3000/api/usuarios')
    .then(res => res.json())
    .then(usuarios => {
      usuarios.forEach(usuario => insertarFila(usuario));
    })
    .catch(err => {
      console.error('Error al cargar usuarios:', err);
      alert('No se pudo cargar la lista de usuarios');
    });

  // Enviar nuevo usuario
  $('#userForm').submit(function (e) {
    e.preventDefault();

    const usuario = {
      nombreUsuario: $('#nombreUsuario').val(),
      contrasena: $('#contraseña').val(),
      tipoUsuario: $('#tipoUsuario').val()
    };

    fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        insertarFila({
          UserID: data.userId,
          NombreUsuario: usuario.nombreUsuario,
          Contrasena: usuario.contrasena,
          TipoUsuario: usuario.tipoUsuario
        });
        $('#userForm')[0].reset();
      })
      .catch(err => {
        console.error('Error al registrar usuario:', err);
        alert('Error al agregar usuario.');
      });
  });

  // Insertar fila en la tabla
  function insertarFila(u) {
    $('#userTableBody').append(`
      <tr data-id="${u.UserID}">
        <td>${u.UserID}</td>
        <td>${u.NombreUsuario}</td>
        <td>${u.Contrasena}</td>
        <td>${u.TipoUsuario}</td>
        <td>
          <button class="btn btn-warning btn-sm btn-editar">Editar</button>
          <button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
        </td>
      </tr>
    `);
  }

  // Eliminar usuario
  $(document).on('click', '.btn-eliminar', function () {
    const row = $(this).closest('tr');
    const id = row.data('id');

    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          row.remove();
        })
        .catch(err => {
          console.error('Error al eliminar usuario:', err);
          alert('Error al eliminar usuario.');
        });
    }
  });

  // Editar usuario
  $(document).on('click', '.btn-editar', function () {
    const row = $(this).closest('tr');
    const id = row.data('id');

    const nombreUsuario = prompt('Nuevo nombre de usuario:', row.children().eq(1).text());
    const contrasena = prompt('Nueva contraseña:', row.children().eq(2).text());
    const tipoUsuario = prompt('Nuevo tipo de usuario (Administrador, Técnico, Invitado):', row.children().eq(3).text());

    fetch(`http://localhost:3000/api/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreUsuario, contrasena, tipoUsuario })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        row.children().eq(1).text(nombreUsuario);
        row.children().eq(2).text(contrasena);
        row.children().eq(3).text(tipoUsuario);
      })
      .catch(err => {
        console.error('Error al actualizar usuario:', err);
        alert('Error al actualizar usuario.');
      });
  });
});


