// routes/empleados.js
const express = require('express');
const router  = express.Router();
const db      = require('../database');

/* ------------------------------------------------------------------
   CREAR empleado  (POST /api/empleados)
------------------------------------------------------------------ */
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

  db.query(
    sql,
    [nombre, apellidos, telefono, cargo, area, correo, empresa, activo],
    (err, result) => {
      if (err) {
        console.error('Error al insertar empleado:', err);
        return res.status(500).json({ message: 'Error al insertar' });
      }
      res.status(201).json({
        message    : 'Empleado agregado con éxito',
        empleadoId : result.insertId
      });
    }
  );
});

/* ------------------------------------------------------------------
   ELIMINAR empleado  (DELETE /api/empleados/:id)
------------------------------------------------------------------ */
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM empleados WHERE EmpleadoID = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error('Error al eliminar empleado:', err);
      return res.status(500).json({ message: 'Error al eliminar' });
    }
    res.json({ message: 'Empleado eliminado con éxito' });
  });
});

/* ------------------------------------------------------------------
   ACTUALIZAR empleado  (PUT /api/empleados/:id)
------------------------------------------------------------------ */
router.put('/:id', (req, res) => {
  const {
    nombre, apellidos, telefono,
    cargo, area, correo, empresa, activo
  } = req.body;

  const sql = `
    UPDATE empleados
    SET Nombre = ?, Apellido = ?, Telefono = ?, Cargo = ?, Area = ?,
        Correo = ?, Empresa = ?, Activo = ?
    WHERE EmpleadoID = ?
  `;

  db.query(
    sql,
    [nombre, apellidos, telefono, cargo, area, correo, empresa, activo, req.params.id],
    (err) => {
      if (err) {
        console.error('Error al actualizar empleado:', err);
        return res.status(500).json({ message: 'Error al actualizar' });
      }
      res.json({ message: 'Empleado actualizado con éxito' });
    }
  );
});

/* ------------------------------------------------------------------
   (Opcional) OBTENER todos los empleados  (GET /api/empleados)
------------------------------------------------------------------ */
router.get('/', (req, res) => {
  db.query('SELECT * FROM empleados', (err, rows) => {
    if (err) {
      console.error('Error al obtener empleados:', err);
      return res.status(500).json({ message: 'Error al listar' });
    }
    res.json(rows);
  });
});

module.exports = router;

