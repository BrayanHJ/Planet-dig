const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// Obtener Boletos Disponibles
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM boletos');
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
        const foliosStr = item.folios.join(',');

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

module.exports = router;
