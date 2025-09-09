const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
    const { usuario, edad, contrasena } = req.body;
    if (usuario === "Brayan" && contrasena === "1234") {
        const year = edad ? new Date(edad).getFullYear() : null;
        const edadCalculada = year ? 2025 - year : "desconocida";
        res.json({
            success: true,
            mensaje: `¡Login correcto, ${usuario}! Tu edad es de: ${edadCalculada} años.`
        });

    } else {
        res.json({ success: false, mensaje: "Credenciales incorrectas" });
    }
});

app.listen(3000, () => console.log("Servidor iniciado en puerto 3000"));


// Iniciar SERVIDOR

// node src/api/login/server.cjs