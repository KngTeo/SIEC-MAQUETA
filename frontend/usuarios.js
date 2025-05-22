
document.getElementById('userForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombreUsuario = document.getElementById('nombreUsuario').value;
  const contrasena = document.getElementById('contraseña').value;
  const tipoUsuario = document.getElementById('tipoUsuario').value;

  fetch('http://localhost:3000/api/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombreUsuario,
      contrasena,
      tipoUsuario
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    agregarFilaTabla(data.userID, nombreUsuario, contrasena, tipoUsuario);
    document.getElementById('userForm').reset();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Hubo un error al agregar el usuario.');
  });
});

function agregarFilaTabla(id, nombre, contra, tipo) {
  const tbody = document.getElementById('userTableBody');
  const tr = document.createElement('tr');
  tr.setAttribute('data-id', id);
  tr.innerHTML = `
    <td>${id}</td>
    <td>${nombre}</td>
    <td>${contra}</td>
    <td>${tipo}</td>
    <td>
      <button class="btn btn-warning btn-sm" onclick="editarUsuario(${id}, this)">Editar</button>
      <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${id}, this)">Eliminar</button>
    </td>
  `;
  tbody.appendChild(tr);
}

function eliminarUsuario(id, btn) {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    fetch(`http://localhost:3000/api/usuarios/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      btn.closest('tr').remove();
    })
    .catch(error => {
      console.error('Error al eliminar:', error);
    });
  }
}

function editarUsuario(id, btn) {
  const row = btn.closest('tr');
  const nombre = prompt('Nuevo nombre:', row.children[1].textContent);
  const contra = prompt('Nueva contraseña:', row.children[2].textContent);
  const tipo = prompt('Nuevo tipo de usuario:', row.children[3].textContent);

  if (nombre && contra && tipo) {
    fetch(`http://localhost:3000/api/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreUsuario: nombre,
        contrasena: contra,
        tipoUsuario: tipo
      })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      row.children[1].textContent = nombre;
      row.children[2].textContent = contra;
      row.children[3].textContent = tipo;
    })
    .catch(error => {
      console.error('Error al editar:', error);
    });
  }
}
