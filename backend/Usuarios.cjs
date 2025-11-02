const express = require('express');
const router = express.Router();
const db = require('./db.cjs');

// Listar usuarios
router.get('/', async (req, res) => {
    try {
        const [results] = await db.execute(
        'SELECT id_usuarios AS id, usuario, nombre, Rol, fecha_creacion FROM usuarios;'
        );
        res.json({ success: true, usuarios: results });
    } catch (err) {
        console.error('Usuarios.list error:', err);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
    }
});

// Obtener usuario por id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.execute(
        'SELECT id_usuarios AS id, usuario, nombre, Rol, fecha_creacion FROM usuarios WHERE id_usuarios = ?',
        [id]
        );
        if (results && results.length > 0) {
        res.json({ success: true, usuario: results[0] });
        } else {
        res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error('Usuarios.get error:', err);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
    }
});

// Obtener datos completos para edición por id
// Ruta útil para que el frontend pida todos los campos de un usuario seleccionado
router.get('/:id/edit', async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.execute('SELECT * FROM usuarios WHERE id_usuarios = ?', [id]);
        if (results && results.length > 0) {
            const u = results[0];
            // No enviamos la contraseña real por seguridad; retornamos cadena vacía para compatibilidad
            const usuarioResp = {
                id: u.id_usuarios ?? u.id,
                usuario: u.usuario,
                nombre: u.nombre,
                Rol: u.Rol,
                fecha_creacion: u.fecha_creacion,
                contrasena: ''
            };
            res.json({ success: true, usuario: usuarioResp });
        } else {
            res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error('Usuarios.getEdit error:', err);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
    }
});

// Eliminar usuario por ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM usuarios WHERE id_usuarios = ?', [id]);
        if (result.affectedRows > 0) {
        res.json({ success: true, mensaje: 'Usuario eliminado correctamente' });
        } else {
        res.status(404).json({ success: false, mensaje: 'No se encontró el usuario' });
        }
    } catch (err) {
        console.error('Usuarios.delete error:', err);
        res.status(500).json({ success: false, mensaje: 'Error al eliminar usuario' });
    }
});

// Actualizar usuario por ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, nombre, contrasena, Rol } = req.body;
        const fields = [];
        const values = [];
        if (usuario !== undefined) { fields.push('usuario = ?'); values.push(usuario); }
        if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
        if (Rol !== undefined) { fields.push('Rol = ?'); values.push(Rol); }
        if (contrasena !== undefined && contrasena !== '') { fields.push('contrasena = ?'); values.push(contrasena); }

        if (fields.length === 0) {
        return res.status(400).json({ success: false, mensaje: 'No hay campos para actualizar' });
        }

                const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id_usuarios = ?`;
                values.push(id);
                try {
                    const [result] = await db.execute(sql, values);
                    if (result.affectedRows > 0) {
                        res.json({ success: true, mensaje: 'Usuario actualizado correctamente' });
                    } else {
                        res.status(404).json({ success: false, mensaje: 'No se encontró el usuario' });
                    }
                } catch (err) {
                    // Posible que la columna de password tenga otro nombre (p.ej. `password`). Reintentamos substituyendo `contrasena` por `password`.
                    if (err && err.code === 'ER_BAD_FIELD_ERROR' && fields.some(f => f.startsWith('contrasena')) ) {
                        try {
                            const altFields = fields.map(f => f.replace('contrasena', 'password'));
                            const altSql = `UPDATE usuarios SET ${altFields.join(', ')} WHERE id_usuarios = ?`;
                            const [altResult] = await db.execute(altSql, values);
                            if (altResult.affectedRows > 0) {
                                return res.json({ success: true, mensaje: 'Usuario actualizado correctamente' });
                            }
                            return res.status(404).json({ success: false, mensaje: 'No se encontró el usuario' });
                        } catch (err2) {
                            console.error('Usuarios.update retry error:', err2);
                            return res.status(500).json({ success: false, mensaje: 'Error al actualizar usuario' });
                        }
                    }
                    console.error('Usuarios.update error:', err);
                    res.status(500).json({ success: false, mensaje: 'Error al actualizar usuario' });
                }
    } catch (err) {
        console.error('Usuarios.update error:', err);
        res.status(500).json({ success: false, mensaje: 'Error al actualizar usuario' });
    }
});

// Crear nuevo usuario
router.post('/', async (req, res) => {
    try {
        const { usuario, nombre, contrasena, Rol } = req.body;
        if (!usuario || !contrasena) {
            return res.status(400).json({ success: false, mensaje: 'Faltan campos requeridos' });
        }

        // Intentamos insertar usando la columna `contrasena`, si falla lo reintentamos con `password`
        try {
            const [result] = await db.execute(
                'INSERT INTO usuarios (usuario, contrasena, nombre, Rol) VALUES (?, ?, ?, ?)',
                [usuario, contrasena, nombre || null, Rol || 'usuario']
            );
            return res.json({ success: true, mensaje: 'Usuario creado', id: result.insertId });
        } catch (err) {
            // Retry with `password` column if schema uses that
            if (err && err.code === 'ER_BAD_FIELD_ERROR') {
                try {
                    const [result2] = await db.execute(
                        'INSERT INTO usuarios (usuario, password, nombre, Rol) VALUES (?, ?, ?, ?)',
                        [usuario, contrasena, nombre || null, Rol || 'usuario']
                    );
                    return res.json({ success: true, mensaje: 'Usuario creado', id: result2.insertId });
                } catch (err2) {
                    console.error('Usuarios.create retry error:', err2);
                    return res.status(500).json({ success: false, mensaje: 'Error al crear usuario' });
                }
            }
            console.error('Usuarios.create error:', err);
            return res.status(500).json({ success: false, mensaje: 'Error al crear usuario' });
        }
    } catch (err) {
        console.error('Usuarios.create outer error:', err);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
    }
});

module.exports = router;
