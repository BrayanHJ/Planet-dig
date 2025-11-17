require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Modular DB y Auth
const db = require("./backend/db.cjs");
const { autenticarUsuario } = require("./backend/auth.cjs");

// Modular routers
const usuariosRouter = require('./backend/Usuarios.cjs');
const tablasRouter = require('./backend/Tablas.cjs');
const ventaRouter = require('./backend/Venta_Boletos.cjs');
const inicioRouter = require('./backend/Inicio.cjs');
const carruselRouter = require('./backend/Carrusel.cjs');
const fileUpload = require('express-fileupload');
const updateItem = require('./backend/updateItem.cjs');
const deleteItem = require('./backend/deleteItem.cjs');
const Viws = require('./backend/Viws.cjs');
const activityLog = require('./backend/Activity_Log.cjs');

// Configurar middleware para manejar archivos
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
}));

// routers

// Funciones de tablas para Usuarios
app.use('/api/usuarios', usuariosRouter);

// Funciones de tablas Tablas
app.use('/api', tablasRouter);

// Funciones de tablas para Inicios de Secion
app.use('/api', inicioRouter);

// ventas (placeholder)
app.use('/api/Boletos', ventaRouter);

// Carrusel público
app.use('/api/carrusel', carruselRouter);

// Rutas para gestionar elementos (salas, funciones, actividades)
app.post('/api/updateItem', updateItem);
app.delete('/api/deleteItem', deleteItem);

// Funciones de tablas Tablas
app.use('/api/Viws', Viws);
// Activity log endpoints
app.use('/api/Activity_Log', activityLog);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
