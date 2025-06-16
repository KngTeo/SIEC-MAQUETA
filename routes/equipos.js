// routes/equipos.js
const express = require('express');
const router  = express.Router();
const db      = require('../database');

/* ============================================================
   OBTENER TODOS LOS EQUIPOS (GET /api/equipos)
   ============================================================ */
router.get('/', (req, res) => {
  db.query('SELECT * FROM equipos', (err, rows) => {
    if (err) {
      console.error('Error al listar equipos:', err);
      return res.status(500).json({ message: 'Error al obtener datos' });
    }
    res.json(rows);
  });
});

/* ============================================================
   CREAR EQUIPO (POST /api/equipos)
   ============================================================ */
router.post('/', (req, res) => {
  const e = req.body; // alias para req.body

  const sql = `
    INSERT INTO equipos (
      Empresa, NumeroSerie, TipoEquipo, Modelo, Marca, Procesador, RAM,
      TipoDisco, TamanoDisco, Mac, SistemaOperativo, Office, Antivirus,
      Estado, Usuario, Contrasena, Observacion
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const valores = [
    e.empresa, e.numeroSerie, e.tipoEquipo, e.modelo, e.marca, e.procesador, e.ram,
    e.tipoDisco, e.tamanioDisco, e.mac, e.sistemaOperativo, e.office, e.antivirus,
    e.estado, e.usuarioEquipo, e.contrasenaEquipo, e.observacion
  ];

  db.query(sql, valores, (err, result) => {
    if (err) {
      console.error('Error al insertar equipo:', err);
      return res.status(500).json({ message: 'Error al insertar equipo' });
    }
    res.status(201).json({
      message : 'Equipo agregado con éxito',
      equipoId: result.insertId
    });
  });
});

/* ============================================================
   ACTUALIZAR EQUIPO (PUT /api/equipos/:id)
   ============================================================ */
router.put('/:id', (req, res) => {
  const e = req.body;

  const sql = `
    UPDATE equipos SET
      Empresa          = ?, NumeroSerie     = ?, TipoEquipo       = ?, Modelo           = ?, Marca       = ?, 
      Procesador       = ?, RAM             = ?, TipoDisco        = ?, TamanoDisco      = ?, Mac         = ?, 
      SistemaOperativo = ?, Office          = ?, Antivirus        = ?, Estado           = ?, Usuario    = ?, 
      Contrasena       = ?, Observacion     = ?
    WHERE EquipoID = ?
  `;

  const valores = [
    e.empresa, e.numeroSerie, e.tipoEquipo, e.modelo, e.marca,
    e.procesador, e.ram, e.tipoDisco, e.tamanioDisco, e.mac,
    e.sistemaOperativo, e.office, e.antivirus, e.estado,
    e.usuarioEquipo, e.contrasenaEquipo, e.observacion, req.params.id
  ];

  db.query(sql, valores, err => {
    if (err) {
      console.error('Error al actualizar equipo:', err);
      return res.status(500).json({ message: 'Error al actualizar equipo' });
    }
    res.json({ message: 'Equipo actualizado con éxito' });
  });
});

/* ============================================================
   ELIMINAR EQUIPO (DELETE /api/equipos/:id)
   ============================================================ */
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM equipos WHERE EquipoID = ?', [req.params.id], err => {
    if (err) {
      console.error('Error al eliminar equipo:', err);
      return res.status(500).json({ message: 'Error al eliminar equipo' });
    }
    res.json({ message: 'Equipo eliminado con éxito' });
  });
});

module.exports = router;
