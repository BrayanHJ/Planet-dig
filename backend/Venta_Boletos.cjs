const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// Obtener Boletos Disponibles
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM boletos ORDER BY id_boleto ASC');
    res.json({ success: true, boletos: results });
  } catch (err) {
    console.error('Tablas.Boletos error:', err);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

// Registrar venta
router.post('/venta', async (req, res) => {
  let connection;
  try {
    const { items } = req.body || {};
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, mensaje: 'No hay items para procesar' });
    }

    // Obtener el último folio_venta para incrementar
    const [lastFolios] = await db.execute('SELECT folio_venta FROM planetario.boletos_vendidos ORDER BY id DESC LIMIT 1');
  
    const year = new Date().getFullYear();
    let sequence = 1;
    
    if (lastFolios && lastFolios[0]?.folio_venta) {
      const lastNum = parseInt(lastFolios[0].folio_venta.split('-')[2]) || 0;
      sequence = lastNum + 1;
    }

    const folio_venta = `FAC-${year}-${sequence.toString().padStart(3, '0')}`;

    connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insertar boletos vendidos
      for (const item of items) {
        // Formato: id_boleto[folio1,folio2,folio3]
        const foliosStr = `${item.id_boleto}[${item.folios.join(',')}]`;

        await connection.execute(
          `INSERT INTO planetario.boletos_vendidos 
            (folio_venta, id_boleto, cantidad, folios, fecha) 
            VALUES (?, ?, ?, ?, NOW())`,
          [folio_venta, item.id_boleto, item.cantidad, foliosStr]
        );

        // Actualizar siguiente folio disponible en la tabla boletos
        const maxFolio = Math.max(...item.folios);
        await connection.execute(
          'UPDATE planetario.boletos SET Folio = ? WHERE id_boleto = ?',
          [maxFolio + 1, item.id_boleto]
        );
      }

      // Llamar al procedimiento almacenado para calcular total e insertar en ventas
      await connection.execute('CALL planetario.RegistrarVenta(?)', [folio_venta]);

      await connection.commit();

      res.json({
        success: true,
        mensaje: 'Venta registrada correctamente',
        folio_venta
      });

    } catch (err) {
      if (connection) await connection.rollback();
      throw err;
    }

  } catch (err) {
    console.error('Error al registrar venta:', err);
    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar la venta: ' + (err.message || String(err))
    });
  } finally {
    if (connection) connection.release();
  }
});

// Obtener Venta de Boletos
router.get('/Registros', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM ventas');
    res.json({ success: true, boletos: results });
  } catch (err) {
    console.error('Tablas.Boletos error:', err);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});


// Detalles de una venta por folio_venta
router.get('/Registros/:folio', async (req, res) => {
  try {
    const folio = req.params.folio;
    if (!folio) return res.status(400).json({ success: false, mensaje: 'Folio requerido' });

    const [rows] = await db.execute(
      `SELECT 
        bv.id,
        bv.folio_venta,
        b.Boleto,           -- Nombre del boleto (en lugar de id_boleto)
        bv.cantidad,
        bv.folios,
        bv.fecha,
        b.Precio
      FROM planetario.boletos_vendidos bv
      LEFT JOIN planetario.boletos b ON bv.id_boleto = b.id_boleto
      WHERE bv.folio_venta = ?`,
      [folio]
    );

    res.json({ success: true, detalles: rows });
  } catch (err) {
    console.error('Error al obtener detalles de venta:', err);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

// Eliminar venta completa por folio_venta (elimina de ambas tablas)
router.delete('/Registros/:folio', async (req, res) => {
  let connection;
  try {
    const folio = req.params.folio;
    if (!folio) return res.status(400).json({ success: false, mensaje: 'Folio requerido' });

    connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Obtener los registros de boletos_vendidos antes de eliminar
      const [ventaRecords] = await connection.execute(
        'SELECT id_boleto, folios FROM planetario.boletos_vendidos WHERE folio_venta = ?',
        [folio]
      );

      // Eliminar de la tabla boletos_vendidos
      await connection.execute(
        'DELETE FROM planetario.boletos_vendidos WHERE folio_venta = ?',
        [folio]
      );

      // Eliminar de la tabla ventas
      await connection.execute(
        'DELETE FROM planetario.ventas WHERE folio_venta = ?',
        [folio]
      );

      // Registrar en el Activity Log usando petición HTTP al endpoint
      // Obtener usuario desde UserStore si está disponible
      let id_usuario = 0;
      let usuario = 'Sistema';
      let permiso = 'admin';
      try {
        // Si tienes acceso a UserStore en el backend, úsalo aquí
        if (req.user && req.user.id) {
          id_usuario = req.user.id;
          usuario = req.user.usuario || 'Sistema';
          permiso = req.user.permiso || 'admin';
        } else if (req.body && req.body.idUser) {
          id_usuario = req.body.idUser !== 'Null' ? req.body.idUser : 0;
          usuario = req.body.User || 'Sistema';
          permiso = req.body.Rol || 'admin';
        }
        await fetch('/api/activity_log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accion: 'Eliminar Venta',
            detalle: `Venta con folio ${folio} eliminada`,
            id_usuario,
            usuario,
            permiso
          })
        });
      } catch (logErr) {
        console.error('Error al registrar en el Activity Log:', logErr);
      }

      await connection.commit();

      res.json({
        success: true,
        mensaje: 'Venta eliminada correctamente'
      });

    } catch (err) {
      if (connection) await connection.rollback();
      throw err;
    }

  } catch (err) {
    console.error('Error al eliminar venta:', err);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar la venta: ' + (err.message || String(err))
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
