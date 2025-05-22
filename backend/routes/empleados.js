const express = require('express');
const router = express.Router();
const db = require('../database');

// Ruta para insertar empleado
router.post('/', (req, res) => {
  const {
    nombre, apellidos, telefono,
    cargo, area, correo, empresa, activo
  } = req.body;

  const sql = `
    INSERT INTO empleados 
    (Nombre, Apellido, Telefono, Cargo, Area, Correo, Empresa, Activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nombre, apellidos, telefono, cargo, area, correo, empresa, activo], (err, result) => {
    if (err) {
      console.error('Error al insertar empleado:', err);
      return res.status(500).json({ message: 'Error al insertar' });
    }

    res.status(201).json({ 
      message: 'Empleado agregado correctamente', 
      empleadoId: result.insertId 
    });
  });
});

module.exports = router;
