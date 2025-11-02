// auth.js
// Lógica de autenticación de usuario
const db = require('./db.cjs');

async function autenticarUsuario(usuario, password) {
    const [rows] = await db.execute(
        'SELECT * FROM usuarios WHERE usuario = ? AND password = ?',
        [usuario, password]
    );
    if (rows.length > 0) {
        return { success: true, usuario: rows[0] };
    } else {
        return { success: false };
    }
}

module.exports = { autenticarUsuario };
