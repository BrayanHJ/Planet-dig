const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// Ruta para registrar acceso/InicioSecion - mantiene endpoint /api/InicioSecion
router.get('/InicioSecion', async (req, res) => {
  try {
    const [results] = await db.execute('call registrar_acceso_usuario(01);');
    res.json({ success: true, usuarios: results });
  } catch (err) {
    console.error('Tablas.InicioSecion error:', err);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

// Obtener registros de usuarios
router.get('/RegistrosUser', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM registro_usuarios');
    res.json({ success: true, registros: results });
  } catch (err) {
    console.error('Tablas.RegistrosUser error:', err);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
