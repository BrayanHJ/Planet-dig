require('dotenv').config();
const db = require('../db.cjs');

async function addUser() {
    const [,, usuarioArg, contrasenaArg , nombreArg] = process.argv;
    const usuario = usuarioArg || 'test';
    const contrasena = contrasenaArg || 'test';
    const nombre = nombreArg || 'Test User';

    try {
        const [result] = await db.execute(
            'INSERT INTO usuarios (usuario, password , nombre) VALUES (?, ? , ?)',
            [usuario, contrasena , nombre]
        );
        console.log('Usuario insertado:', { id: result.insertId, usuario });
        process.exit(0);
    } catch (err) {
        console.error('Error insertando usuario:', err.message);
        process.exit(1);
    }
}

addUser();
