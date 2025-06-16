// routes/login.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// Ruta para validar inicio de sesión
router.post('/', (req, res) => {
  const { nombreUsuario, contrasena } = req.body;

  const sql = `SELECT * FROM usuarios WHERE NombreUsuario = ? AND Contrasena = ?`;

  db.query(sql, [nombreUsuario, contrasena], (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Éxito: devolver tipo de usuario
    const tipoUsuario = results[0].TipoUsuario;
    res.json({
      message: 'Inicio de sesión exitoso',
      tipoUsuario: tipoUsuario,
      usuarioId: results[0].UserID
    });
  });
});

module.exports = router;
