const express = require('express');
const router = express.Router();
const db = require('../database');

// Ruta para insertar un usuario
router.post('/', (req, res) => {
  const { nombreUsuario, contrasena, tipoUsuario } = req.body;
  const sql = 'INSERT INTO usuarios (NombreUsuario, Contrasena, TipoUsuario) VALUES (?, ?, ?)';
  db.query(sql, [nombreUsuario, contrasena, tipoUsuario], (err, result) => {
    if (err) {
      console.error('Error al insertar usuario:', err);
      return res.status(500).json({ message: 'Error al insertar' });
    }
    res.status(201).json({ message: 'Usuario agregado con éxito', userID: result.insertId });
  });
});

module.exports = router;

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
  tr.innerHTML = `
    <td>${id}</td>
    <td>${nombre}</td>
    <td>${contra}</td>
    <td>${tipo}</td>
    <td><button class="btn btn-danger btn-sm">Eliminar</button></td>
  `;
  tbody.appendChild(tr);
}
