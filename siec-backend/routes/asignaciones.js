const express = require('express');
const router  = express.Router();
const db      = require('../database');

/* ---- LISTAS para los <select> ---- */
router.get('/empleados/lista', (_req, res) => {
  const q = 'SELECT EmpleadoID, CONCAT(Nombre, " ", Apellido) AS Nombre FROM empleados';
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error al obtener empleados' });
    res.json(rows);
  });
});

router.get('/equipos/lista', (_req, res) => {
  const q = 'SELECT EquipoID, NumeroSerie FROM equipos WHERE Estado = "Activo"';
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error al obtener equipos' });
    res.json(rows);
  });
});

/* ---- CREAR asignación / desasignación ---- */
router.post('/', (req, res) => {
  const { empleadoId, equipoId, accion, observacion } = req.body;
  if (!empleadoId || !equipoId) return res.status(400).json({ message: 'Datos incompletos' });

  if (accion === 'Asignar') {
    const sql = 'INSERT INTO asignaciones (EmpleadoID, EquipoID, Observacion, Accion) VALUES (?,?,?,?)';
    db.query(sql, [empleadoId, equipoId, observacion, 'Asignar'], err => {
      if (err) return res.status(500).json({ message: 'Error al asignar' });
      db.query('UPDATE equipos SET Estado = "Asignado" WHERE EquipoID = ?', [equipoId]);
      res.json({ message: 'Equipo asignado correctamente' });
    });
  } else { // Desasignar
    const sql = 'DELETE FROM asignaciones WHERE EmpleadoID = ? AND EquipoID = ?';
    db.query(sql, [empleadoId, equipoId], err => {
      if (err) return res.status(500).json({ message: 'Error al desasignar' });
      db.query('UPDATE equipos SET Estado = "Disponible" WHERE EquipoID = ?', [equipoId]);
      res.json({ message: 'Equipo desasignado correctamente' });
    });
  }
});

/* ---- HISTORIAL completo ---- */
router.get('/', (_req, res) => {
  const sql = `
    SELECT a.ID,
           CONCAT(e.Nombre,' ',e.Apellido)              AS Empleado,
           CONCAT(eq.Marca,' - ',eq.NumeroSerie)        AS Equipo,
           a.Observacion, a.Accion, a.Fecha
    FROM asignaciones a
    JOIN empleados e ON e.EmpleadoID = a.EmpleadoID
    JOIN equipos   eq ON eq.EquipoID = a.EquipoID
    ORDER BY a.Fecha DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error al obtener historial' });
    res.json(rows);
  });
});

module.exports = router;
