const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const router = express.Router();

// Configurar multer para subida de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/external-site/Pagina-Web/assets/Salas'));
    },
    filename: function (req, file, cb) {
        // Usar timestamp para evitar colisiones de nombres
        const uniqueSuffix = Date.now();
        // Normalizar nombre: todo minúsculas, espacios a guiones
        const safeName = file.originalname.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9._-]/g, '');
        cb(null, `${uniqueSuffix}-${safeName}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máx
    },
    fileFilter: function (req, file, cb) {
        // Solo permitir imágenes
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten imágenes'));
        }
        cb(null, true);
    }
});

// Ruta del archivo salas.json
const salasJsonPath = path.join(__dirname, '../public/external-site/salas.json');

// GET /api/carrusel
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(salasJsonPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error leyendo salas.json:', error);
        res.status(500).json({ error: 'Error leyendo datos del carrusel' });
    }
});

// POST /api/carrusel/actualizar
router.post('/actualizar', async (req, res) => {
    try {
        const { salas } = req.body;
        if (!Array.isArray(salas)) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        await fs.writeFile(salasJsonPath, JSON.stringify({ salas }, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando salas.json:', error);
        res.status(500).json({ error: 'Error actualizando el carrusel' });
    }
});

// POST /api/carrusel/imagen
router.post('/imagen', upload.single('imagen'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se envió ninguna imagen' });
        }

        // Devolver la ruta relativa para guardar en salas.json
        const rutaRelativa = path.join('assets/Salas', req.file.filename)
            .replace(/\\/g, '/'); // Convertir backslashes a forward slashes

        res.json({
            success: true,
            imagen: rutaRelativa
        });
    } catch (error) {
        console.error('Error subiendo imagen:', error);
        res.status(500).json({ error: 'Error subiendo la imagen' });
    }
});

// DELETE /api/carrusel/imagen/:nombre
router.delete('/imagen/:nombre', async (req, res) => {
    try {
        const imagePath = path.join(
            __dirname,
            '../public/external-site/Pagina-Web/assets/Salas',
            req.params.nombre
        );

        await fs.unlink(imagePath);
        res.json({ success: true });
    } catch (error) {
        console.error('Error eliminando imagen:', error);
        res.status(500).json({ error: 'Error eliminando la imagen' });
    }
});

module.exports = router;
