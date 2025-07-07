// siec-backend/routes/empleados.js
const express = require('express');
const router  = express.Router();
const db      = require('../database');  // tu conexión a MySQL

/* ------------------------------------------------------------------
   CREAR empleado  (POST /api/empleados)
------------------------------------------------------------------ */
router.post('/', (req, res) => {
  const {
    cedula,
    nombre, apellidos, telefono,
    cargo, area, correo, empresa, activo
  } = req.body;

  if (!cedula || !nombre || !apellidos) {
    return res.status(400).json({ message: 'Cédula, nombre y apellidos son obligatorios' });
  }

  const sql = `
    INSERT INTO empleados
      (Cedula, Nombre, Apellido, Telefono, Cargo, Area, Correo, Empresa, Activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [cedula, nombre, apellidos, telefono, cargo, area, correo, empresa, activo],
    (err, result) => {
      if (err) {
        console.error('Error al insertar empleado:', err);
        return res.status(500).json({ message: 'Error al insertar empleado' });
      }
      res.status(201).json({
        message    : 'Empleado agregado con éxito',
        empleadoId : result.insertId
      });
    }
  );
});

/* ------------------------------------------------------------------
   LISTAR todos los empleados  (GET /api/empleados)
------------------------------------------------------------------ */
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      EmpleadoID, Cedula, Nombre, Apellido, Telefono,
      Cargo, Area, Correo, Empresa, Activo
    FROM empleados
    ORDER BY EmpleadoID DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error al obtener empleados:', err);
      return res.status(500).json({ message: 'Error al listar empleados' });
    }
    res.json(rows);
  });
});

/* ------------------------------------------------------------------
   BUSCAR por cédula  (GET /api/empleados/cedula/:cedula)
------------------------------------------------------------------ */
router.get('/cedula/:cedula', (req, res) => {
  const sql = `
    SELECT Cedula, Nombre, Apellido, Telefono, Cargo, Area, Correo, Empresa
    FROM empleados
    WHERE Cedula = ?
  `;
  db.query(sql, [req.params.cedula], (err, rows) => {
    if (err) {
      console.error('Error al buscar empleado por cédula:', err);
      return res.status(500).json({ message: 'Error al buscar empleado' });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.json(rows[0]);
  });
});

/* ------------------------------------------------------------------
   ACTUALIZAR empleado  (PUT /api/empleados/:id)
------------------------------------------------------------------ */
router.put('/:id', (req, res) => {
  const {
    cedula,
    nombre, apellidos, telefono,
    cargo, area, correo, empresa, activo
  } = req.body;

  if (!cedula || !nombre || !apellidos) {
    return res.status(400).json({ message: 'Cédula, nombre y apellidos son obligatorios' });
  }

  const sql = `
    UPDATE empleados
    SET
      Cedula   = ?,
      Nombre   = ?,
      Apellido = ?,
      Telefono = ?,
      Cargo    = ?,
      Area     = ?,
      Correo   = ?,
      Empresa  = ?,
      Activo   = ?
    WHERE EmpleadoID = ?
  `;

  db.query(sql,
    [cedula, nombre, apellidos, telefono, cargo, area, correo, empresa, activo, req.params.id],
    (err) => {
      if (err) {
        console.error('Error al actualizar empleado:', err);
        return res.status(500).json({ message: 'Error al actualizar empleado' });
      }
      res.json({ message: 'Empleado actualizado con éxito' });
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
      return res.status(500).json({ message: 'Error al eliminar empleado' });
    }
    res.json({ message: 'Empleado eliminado con éxito' });
  });
});

module.exports = router;
