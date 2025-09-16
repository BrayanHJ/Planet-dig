require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
app.use(cors());
app.use(express.json());



// CONEXION a BASE DE DATOS
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error("Error de conexión a MySQL:", err);
    } else {
        console.log("Conectado a MySQL");
    }
});


//API´s

app.post("/api/login", (req, res) => {
    const { usuario, contrasena } = req.body;
    connection.query(
        "SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?",
        [usuario, contrasena],
        (err, results) => {
            if (err) {
                res.json({ success: false, mensaje: "Error en el servidor" });
            } else if (results.length > 0) {
                res.json({ success: true, mensaje: `¡Login correcto, ${usuario}!` });
            } else {
                res.json({ success: false, mensaje: "Credenciales incorrectas" });
            }
        }
    );
});

app.get("/api/usuarios", (req, res) => {
    connection.query("SELECT * FROM usuarios", (err, results) => {
        if (err) {
            res.json({ success: false, mensaje: "Error en el servidor" });
        } else {
            res.json({ success: true, usuarios: results });
        }
    });
});

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});