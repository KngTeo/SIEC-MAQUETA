// routes/informes.js
const express = require('express');
const router  = express.Router();
const db      = require('../database');

router.get('/:tipo', (req, res) => {
  const tipo  = req.params.tipo;
  const { start, end } = req.query;
  let sql = '';
  const params = [];

  switch (tipo) {
    case 'empleados':
      // Listado completo de empleados
      sql = `
        SELECT EmpleadoID, Nombre, Apellido, Cargo, Area,
               Correo, Telefono, Empresa, Activo
        FROM empleados
      `;
      break;

    case 'equipos':
      // Listado completo de equipos
      sql = `
        SELECT EquipoID, Empresa, NumeroSerie, TipoEquipo,
               Modelo, Marca, Procesador, RAM, TipoDisco,
               TamanoDisco, Mac, SistemaOperativo,
               Office, Antivirus, Estado, Usuario AS UsuarioPC,
               Contrasena, Observacion
        FROM equipos
      `;
      break;

    case 'asignaciones':
      // Listado de asignaciones (con filtro opcional por fecha)
      sql = `
        SELECT a.ID, a.Fecha, a.Accion, a.Observacion,
               CONCAT(e.Nombre,' ',e.Apellido) AS Empleado,
               eq.NumeroSerie AS Equipo
        FROM asignaciones a
        JOIN empleados e ON a.EmpleadoID = e.EmpleadoID
        JOIN equipos   eq ON a.EquipoID   = eq.EquipoID
      `;
      if (start && end) {
        sql += ' WHERE a.Fecha BETWEEN ? AND ?';
        params.push(start, end);
      } else if (start) {
        sql += ' WHERE a.Fecha >= ?';
        params.push(start);
      } else if (end) {
        sql += ' WHERE a.Fecha <= ?';
        params.push(end);
      }
      sql += ' ORDER BY a.Fecha ASC';
      break;

    default:
      return res.status(400).json({ message: 'Tipo de informe no válido.' });
  }

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('Error al generar informe:', err);
      return res.status(500).json({ message: 'Error al generar informe.' });
    }
    res.json(rows);
  });
});

module.exports = router;
