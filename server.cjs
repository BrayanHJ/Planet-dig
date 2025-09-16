require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Modular DB y Auth
const db = require("./db.cjs");
const { autenticarUsuario } = require("./auth.cjs");

// API Login usando función modular
app.post("/api/login", async (req, res) => {
    const { usuario, contrasena } = req.body;
    try {
        const result = await autenticarUsuario(usuario, contrasena);
        if (result.success) {
            res.json({ success: true, mensaje: `¡Login correcto, ${usuario}!` });
        } else {
            res.json({ success: false, mensaje: "Credenciales incorrectas" });
        }
    } catch (err) {
        res.json({ success: false, mensaje: "Error en el servidor" });
    }
});


app.get("/api/usuarios", async (req, res) => {
    try {
        const [results] = await db.execute("SELECT * FROM usuarios");
        res.json({ success: true, usuarios: results });
    } catch (err) {
        res.json({ success: false, mensaje: "Error en el servidor" });
    }
});

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});