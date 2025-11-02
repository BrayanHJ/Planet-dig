const express = require('express');
const router = express.Router();
const db = require('./db.cjs');
const { autenticarUsuario } = require('./auth.cjs');

// API Login usando función modular
// This route will be mounted under /api in server.cjs, so the full path is /api/login

router.post('/login', async (req, res) => {
    const { usuario, contrasena } = req.body;
    try {
        const result = await autenticarUsuario(usuario, contrasena);
        if (result.success) {
            // Intentamos registrar el acceso en la tabla mediante el procedimiento almacenado
            try {
                const userId = result.usuario.id_usuarios || result.usuario.id || null;
                if (userId) {
                    await db.execute('CALL registrar_acceso_usuario(?)', [userId]);
                }
            } catch (procErr) {
                console.error('Error al invocar registrar_acceso_usuario:', procErr);
                // no abortamos el login por este error, solo lo reportamos
            }

            // Devolvemos datos útiles para el frontend (usuario y rol si existen)
            res.json({
                success: true,
                mensaje: `¡Login correcto, ${usuario}!`,
                usuario: result.usuario.usuario,
                id: result.usuario.id_usuarios || result.usuario.id || null,
                Rol: result.usuario.Rol || result.usuario.rol || 'usuario'
            });
        } else {
            res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas' });
        }
    } catch (err) {
        console.error('Error /api/login:', err);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
    }
});

module.exports = router;