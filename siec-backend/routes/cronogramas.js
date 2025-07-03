const express = require('express');
const router  = express.Router();
const db      = require('../database');

/**
 * GET lista de empleados para dropdown
 *    GET /api/cronogramas/empleados
 */
router.get('/empleados', (req, res) => {
  db.query(
    'SELECT EmpleadoID, Nombre, Apellido FROM empleados',
    (err, rows) => {
      if (err) {
        console.error('Error al obtener empleados:', err);
        return res.status(500).json({ message: 'Error al obtener empleados' });
      }
      res.json(rows);
    }
  );
});

/**
 * GET lista de equipos para dropdown
 *    GET /api/cronogramas/equipos
 */
router.get('/equipos', (req, res) => {
  db.query(
    'SELECT EquipoID, Empresa, NumeroSerie, TipoEquipo, Modelo, Marca, Usuario AS UsuarioPC FROM equipos',
    (err, rows) => {
      if (err) {
        console.error('Error al obtener equipos:', err);
        return res.status(500).json({ message: 'Error al obtener equipos' });
      }
      res.json(rows);
    }
  );
});

/**
 * POST registrar un nuevo cronograma
 *    POST /api/cronogramas
 */
router.post('/', (req, res) => {
  const { EmpleadoID, EquipoID, Fecha, Tipo, Observacion, Estado } = req.body;
  if (!EmpleadoID || !EquipoID || !Fecha || !Tipo || !Estado) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  const sql = `
    INSERT INTO cronogramas
      (EmpleadoID, EquipoID, Fecha, Tipo, Observacion, Estado)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql,
    [EmpleadoID, EquipoID, Fecha, Tipo, Observacion, Estado],
    (err, result) => {
      if (err) {
        console.error('Error al registrar cronograma:', err);
        return res.status(500).json({ message: 'Error al registrar cronograma' });
      }
      res.status(201).json({
        message: 'Mantenimiento registrado correctamente',
        id: result.insertId
      });
    }
  );
});

/**
 * GET todos los cronogramas (para listado)
 *    GET /api/cronogramas
 */
router.get('/', (req, res) => {
  const sql = `
    SELECT
      c.ID,
      c.Fecha,
      c.Tipo,
      c.Observacion,
      c.Estado,
      CONCAT(e.Nombre,' ',e.Apellido) AS Empleado,
      eq.NumeroSerie AS Equipo
    FROM cronogramas c
    JOIN empleados e ON c.EmpleadoID = e.EmpleadoID
    JOIN equipos   eq ON c.EquipoID   = eq.EquipoID
    ORDER BY c.Fecha ASC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error al obtener cronogramas:', err);
      return res.status(500).json({ message: 'Error al listar cronogramas' });
    }
    res.json(rows);
  });
});

/**
 * PUT actualizar cualquier campo de un cronograma
 *    PUT /api/cronogramas/:id
 */
router.put('/:id', (req, res) => {
  const campos = req.body;
  const keys   = Object.keys(campos);
  if (keys.length === 0) {
    return res.status(400).json({ message: 'Ningún campo para actualizar' });
  }
  const parts = keys.map(k => `${k} = ?`).join(', ');
  const vals  = keys.map(k => campos[k]);
  vals.push(req.params.id);

  const sql = `UPDATE cronogramas SET ${parts} WHERE ID = ?`;
  db.query(sql, vals, err => {
    if (err) {
      console.error('Error al actualizar cronograma:', err);
      return res.status(500).json({ message: 'Error al actualizar cronograma' });
    }
    res.json({ message: 'Mantenimiento actualizado correctamente' });
  });
});

/**
 * GET un solo cronograma por ID (para rellenar formularios Preventivo/Correctivo)
 *    GET /api/cronogramas/:id
 */
router.get('/:id', (req, res) => {
  const sql = `
    SELECT
      c.ID,
      c.Fecha,
      c.Tipo,
      c.Observacion,
      c.Estado,
      c.EmpleadoID,
      c.EquipoID,
      CONCAT(e.Nombre,' ',e.Apellido)       AS Empleado,
      eq.Empresa,
      eq.NumeroSerie,
      eq.TipoEquipo,
      eq.Modelo,
      eq.Marca,
      eq.Usuario                          AS UsuarioPC
    FROM cronogramas c
    JOIN empleados e ON c.EmpleadoID = e.EmpleadoID
    JOIN equipos   eq ON c.EquipoID   = eq.EquipoID
    WHERE c.ID = ?
  `;
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) {
      console.error('Error al obtener cronograma por ID:', err);
      return res.status(500).json({ message: 'Error al obtener cronograma' });
    }
    if (!rows.length) {
      return res.status(404).json({ message: 'Cronograma no encontrado' });
    }
    res.json(rows[0]);
  });
});

module.exports = router;
