const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// Get all logs (sin detalles para no sobrecargar el server)
router.get('/', async (req, res) => {
	try {
		const [results] = await db.execute('SELECT id, accion, id_usuario, usuario, permiso, fecha FROM planetario.activity_log ORDER BY fecha DESC LIMIT 1000');
		res.json({ success: true, registros: results });
	} catch (err) {
		console.error('Activity_Log.get error:', err);
		res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
	}
});

// Get log details by ID
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const [results] = await db.execute('SELECT * FROM planetario.activity_log WHERE id = ?', [id]);
		if (results.length === 0) {
			return res.status(404).json({ success: false, mensaje: 'Log no encontrado' });
		}
		res.json({ success: true, registro: results[0] });
	} catch (err) {
		console.error('Activity_Log.get/:id error:', err);
		res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
	}
});

// Insert a log entry
router.post('/', async (req, res) => {
	try {
		const { accion, detalle, id_usuario, usuario, permiso } = req.body || {};

		// sanitize and truncate detalle to avoid DB column overflow and to remove sensitive fields
		let detalleSafe = detalle;
		try {
			if (typeof detalle === 'string') {
				// try parse JSON to redact sensitive keys
				try {
					const parsed = JSON.parse(detalle);
					// remove common sensitive keys
					['contrasena', 'password', 'pass'].forEach(k => {
						if (parsed && Object.prototype.hasOwnProperty.call(parsed, k)) delete parsed[k];
					});
					detalleSafe = JSON.stringify(parsed);
				} catch (_) {
					// not JSON, keep original string
					detalleSafe = detalle;
				}
			} else if (typeof detalle === 'object' && detalle !== null) {
				// redact object
				const copy = { ...detalle };
				['contrasena', 'password', 'pass'].forEach(k => { if (Object.prototype.hasOwnProperty.call(copy, k)) delete copy[k]; });
				detalleSafe = JSON.stringify(copy);
			} else {
				detalleSafe = String(detalle ?? '');
			}
		} catch (e) {
			detalleSafe = String(detalle ?? '');
		}
                    
		// final truncation to safe length (DB column likely small). Use 1000 chars.
		if (typeof detalleSafe === 'string' && detalleSafe.length > 1000) detalleSafe = detalleSafe.slice(0, 1000);

		console.log('Activity_Log.post body:', { accion, detalle: detalleSafe, id_usuario, usuario, permiso });

		await db.execute(
			'INSERT INTO planetario.activity_log (accion, detalle, id_usuario, usuario, permiso) VALUES (?, ?, ?, ?, ?)',
			[accion || null, detalleSafe || null, id_usuario || null, usuario || null, permiso || null]
		);
		res.json({ success: true });
	} catch (err) {
		console.error('Activity_Log.post error:', err);
		res.status(500).json({ success: false, mensaje: 'Error al insertar log' });
	}
});

// Delete a log entry by ID
router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const [results] = await db.execute('SELECT id FROM planetario.activity_log WHERE id = ?', [id]);
		if (results.length === 0) {
			return res.status(404).json({ success: false, mensaje: 'Log no encontrado' });
		}
		await db.execute('DELETE FROM planetario.activity_log WHERE id = ?', [id]);
		res.json({ success: true, mensaje: 'Log eliminado correctamente' });
	} catch (err) {
		console.error('Activity_Log.delete error:', err);
		res.status(500).json({ success: false, mensaje: 'Error al eliminar log' });
	}
});

module.exports = router;

