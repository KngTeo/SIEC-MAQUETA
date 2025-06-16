const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener lista de asignaciones con nombres
router.get('/', (req, res) => {
  const sql = `
    SELECT a.ID, a.EmpleadoID, CONCAT(e.Nombre, ' ', e.Apellido) AS Empleado,
           a.EquipoID, CONCAT(eq.Marca, ' - ', eq.NumeroSerie) AS Equipo,
           a.Observaciones, a.Accion, a.Fecha
    FROM asignaciones a
    JOIN empleados e ON a.EmpleadoID = e.EmpleadoID
    JOIN equipos eq ON a.EquipoID = eq.EquipoID
    ORDER BY a.Fecha DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error al obtener asignaciones:', err);
      return res.status(500).json({ message: 'Error al obtener datos' });
    }
    res.json(rows);
  });
});

module.exports = router;
