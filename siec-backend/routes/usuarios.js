const express = require('express');
const router = express.Router();
const db = require('../database'); // Asegúrate de que la conexión a MySQL esté bien configurada




// Crear usuario
router.post('/', (req, res) => {
  const { nombreUsuario, contrasena, tipoUsuario } = req.body;
  const sql = `
    INSERT INTO usuarios (NombreUsuario, Contrasena, TipoUsuario)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [nombreUsuario, contrasena, tipoUsuario], (err, result) => {
    if (err) {
      console.error('Error al insertar usuario:', err);
      return res.status(500).json({ message: 'Error al insertar usuario' });
    }
    res.status(201).json({
      message: 'Usuario creado correctamente',
      userId: result.insertId // 👈 importante que coincida con el frontend
    });
  });
});

// Eliminar usuario
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM usuarios WHERE UserID = ?', [req.params.id], (err) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      return res.status(500).json({ message: 'Error al eliminar usuario' });
    }
    res.json({ message: 'Usuario eliminado con éxito' });
  });
});

// Actualizar usuario
router.put('/:id', (req, res) => {
  const { nombreUsuario, contrasena, tipoUsuario } = req.body;
  const sql = `
    UPDATE usuarios
    SET NombreUsuario = ?, Contrasena = ?, TipoUsuario = ?
    WHERE UserID = ?
  `;
  db.query(sql, [nombreUsuario, contrasena, tipoUsuario, req.params.id], (err) => {
    if (err) {
      console.error('Error al actualizar usuario:', err);
      return res.status(500).json({ message: 'Error al actualizar usuario' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  });
});

// Listar usuarios
router.get('/', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, rows) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ message: 'Error al listar usuarios' });
    }
    res.json(rows);
  });
});

module.exports = router;


//login

router.post('/login', (req, res) => {
  const { nombreUsuario, contrasena } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE NombreUsuario = ? AND Contrasena = ?';
  db.query(sql, [nombreUsuario, contrasena], (err, results) => {
    if (err) {
      console.error('Error en la consulta de login:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const usuario = results[0];
    res.json({
      message: 'Inicio de sesión exitoso',
      tipoUsuario: usuario.TipoUsuario
    });
  });
});
