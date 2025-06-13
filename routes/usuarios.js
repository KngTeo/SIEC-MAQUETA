
const express = require('express');
const router = express.Router();
const db = require('../database');

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

router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM usuarios WHERE UserID = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      return res.status(500).json({ message: 'Error al eliminar' });
    }
    res.json({ message: 'Usuario eliminado con éxito' });
  });
});

router.put('/:id', (req, res) => {
  const { nombreUsuario, contrasena, tipoUsuario } = req.body;
  const sql = 'UPDATE usuarios SET NombreUsuario = ?, Contrasena = ?, TipoUsuario = ? WHERE UserID = ?';
  db.query(sql, [nombreUsuario, contrasena, tipoUsuario, req.params.id], (err) => {
    if (err) {
      console.error('Error al actualizar usuario:', err);
      return res.status(500).json({ message: 'Error al actualizar' });
    }
    res.json({ message: 'Usuario actualizado con éxito' });
  });
});

module.exports = router;
