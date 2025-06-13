const express = require('express');
const router  = express.Router();
const db      = require('../database');

/* --------- CREAR equipo --------- */
router.post('/', (req, res) => {
  const e = req.body;  // abreviatura

  const sql = `
    INSERT INTO equipos
      (Empresa, NumeroSerie, TipoEquipo, Modelo, Marca, Procesador, RAM,
       TipoDisco, Mac, SistemaOperativo, Office, Antivirus, Estado,
       Usuario, Contrasena, Observacion)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const valores = [
    e.empresa, e.numeroSerie, e.tipoEquipo, e.modelo, e.marca, e.procesador, e.ram,
    e.tipoDisco, e.mac, e.sistemaOperativo, e.office, e.antivirus, e.estado,
    e.usuarioEquipo, e.contrasenaEquipo, e.observacion
  ];

  db.query(sql, valores, (err, result) => {
    if (err) {
      console.error('Error al insertar equipo:', err);
      return res.status(500).json({ message: 'Error al insertar' });
    }
    res.status(201).json({
      message : 'Equipo agregado con éxito',
      equipoId: result.insertId
    });
  });
});

/* --------- ELIMINAR equipo --------- */
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM equipos WHERE EquipoID = ?', [req.params.id], err => {
    if (err) {
      console.error('Error al eliminar equipo:', err);
      return res.status(500).json({ message: 'Error al eliminar' });
    }
    res.json({ message: 'Equipo eliminado con éxito' });
  });
});

/* --------- ACTUALIZAR equipo --------- */
router.put('/:id', (req, res) => {
  const e   = req.body;
  const sql = `
    UPDATE equipos SET
      Empresa=?, NumeroSerie=?, TipoEquipo=?, Modelo=?, Marca=?, Procesador=?, RAM=?,
      TipoDisco=?, Mac=?, SistemaOperativo=?, Office=?, Antivirus=?, Estado=?,
      Usuario=?, Contrasena=?, Observacion=?
    WHERE EquipoID=?`;

  const valores = [
    e.empresa, e.numeroSerie, e.tipoEquipo, e.modelo, e.marca, e.procesador, e.ram,
    e.tipoDisco, e.mac, e.sistemaOperativo, e.office, e.antivirus, e.estado,
    e.usuarioEquipo, e.contrasenaEquipo, e.observacion, req.params.id
  ];

  db.query(sql, valores, err => {
    if (err) {
      console.error('Error al actualizar equipo:', err);
      return res.status(500).json({ message: 'Error al actualizar' });
    }
    res.json({ message: 'Equipo actualizado con éxito' });
  });
});

module.exports = router;
