const express = require('express');
const router  = express.Router();
const db      = require('../database');


// GET lista empleados
router.get('/empleados', (req, res) => {
  db.query(
    'SELECT EmpleadoID, Nombre, Apellido FROM empleados',
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error al obtener empleados' });
      res.json(rows);
    }
  );
});

// GET lista equipos
router.get('/equipos', (req, res) => {
  db.query(
    'SELECT EquipoID, NumeroSerie FROM equipos',
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error al obtener equipos' });
      res.json(rows);
    }
  );
});

/* POST: registrar cronograma */
router.post('/', (req, res) => {
  const { EmpleadoID, EquipoID, Fecha, Tipo, Observacion, Estado } = req.body;
  if (!EmpleadoID||!EquipoID||!Fecha||!Tipo||!Estado)
    return res.status(400).json({ message: 'Faltan campos requeridos' });

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
      res.status(201).json({ message: 'Mantenimiento registrado correctamente' });
    }
  );
});

/* GET: listar cronogramas */
router.get('/', (req, res) => {
  const sql = `
    SELECT
      c.ID, c.Fecha, c.Tipo, c.Observacion, c.Estado,
      CONCAT(e.Nombre,' ',e.Apellido) AS Empleado,
      eq.NumeroSerie     AS Equipo
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

// PUT actualizar cronograma (cualquier campo)
router.put('/:id', (req, res) => {
  const campos = req.body;
  const parts = [];
  const vals  = [];
  for (let k in campos) {
    parts.push(`${k} = ?`);
    vals.push(campos[k]);
  }
  vals.push(req.params.id);
  const sql = `UPDATE cronogramas SET ${parts.join(', ')} WHERE ID = ?`;
  db.query(sql, vals, err => {
    if (err) {
      console.error('Error al actualizar cronograma:', err);
      return res.status(500).json({ message: 'Error al actualizar cronograma' });
    }
    res.json({ message: 'Mantenimiento actualizado correctamente' });
  });
});

// routes/cronogramas.js
router.put('/:id', (req, res) => {
  const { Estado } = req.body;
  if (!Estado) return res.status(400).json({ message: 'Estado requerido' });

  const sql = 'UPDATE cronogramas SET Estado = ? WHERE ID = ?';
  db.query(sql, [Estado, req.params.id], err => {
    if (err) {
      console.error('Error al actualizar estado:', err);
      return res.status(500).json({ message: 'Error al actualizar estado' });
    }
    res.json({ message: 'Estado actualizado correctamente' });
  });
});

// GET /api/cronogramas/:id — devuelve un solo cronograma con datos de equipo
router.get('/:id', (req, res) => {
  const sql = `
    SELECT
      c.ID,
      c.Fecha,
      c.Tipo,
      c.Observacion,
      c.Estado,
      eq.NumeroSerie,
      eq.TipoEquipo,
      eq.Modelo,
      eq.Marca
    FROM cronogramas c
    JOIN equipos   eq ON c.EquipoID = eq.EquipoID
    WHERE c.ID = ?
  `;
  db.query(sql, [req.params.id], (err, rows) => {
    if (err || rows.length === 0) {
      console.error('Error al obtener cronograma:', err);
      return res.status(500).json({ message: 'No encontrado' });
    }
    res.json(rows[0]);
  });
});

module.exports = router;
