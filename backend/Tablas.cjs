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

// Eliminar un registro de usuario por ID
router.delete('/RegistrosUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Intentando eliminar registro con id: ${id}`);
    
    // Intentar eliminar con id_registro
    const [result] = await db.execute('DELETE FROM registro_usuarios WHERE id_registro = ?', [id]);
    
    if (result.affectedRows > 0) {
      console.log(`Registro eliminado exitosamente. affectedRows: ${result.affectedRows}`);
      res.json({ success: true, mensaje: 'Registro eliminado correctamente' });
    } else {
      console.log(`No se encontró registro con id: ${id}`);
      res.status(404).json({ success: false, mensaje: 'No se encontró el registro' });
    }
  } catch (err) {
    console.error('Tablas.deleteRegistro error:', err);
    res.status(500).json({ success: false, mensaje: 'Error al eliminar registro' });
  }
});

module.exports = router;
