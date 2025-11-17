const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// Helper to create a simple GET endpoint for a view
const views = [
  { path: '/PersonasPorDia', view: 'planetario.vw_personas_por_dia' },
  { path: '/TipoBoleto', view: 'planetario.vw_estadistica_por_tipo' },
  { path: '/Mensual', view: 'planetario.vw_estadistica_mensual' },
  { path: '/DiariaReal', view: 'planetario.vw_estadistica_diaria_real' },
  { path: '/DiariaDetallada', view: 'planetario.vw_estadistica_diaria_detallada' },
  { path: '/Diaria', view: 'planetario.vw_estadistica_diaria' },
  { path: '/Anual', view: 'planetario.vw_estadistica_anual' }
];

views.forEach(({ path, view }) => {
  router.get(path, async (req, res) => {
    try {
      const [results] = await db.execute(`SELECT * FROM ${view}`);
      res.json({ success: true, registros: results });
    } catch (err) {
      console.error(`Viws.${path} error:`, err);
      res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
    }
  });
});

module.exports = router;
