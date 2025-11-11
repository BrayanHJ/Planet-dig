const fs = require('fs').promises;
const path = require('path');

async function updateItem(req, res) {
    try {
        const { type, data } = req.body;
        const image = req.files?.image;

        // Determinar el archivo JSON a modificar
        let jsonFile;
        let imagePath;
        switch (type) {
            case 'salas':
                jsonFile = 'salas.json';
                imagePath = 'assets/Salas/';
                break;
            case 'funciones':
                jsonFile = 'funciones.json';
                imagePath = 'assets/Horario_Funciones/';
                break;
            case 'actividades':
                jsonFile = 'actividades.json';
                imagePath = 'assets/Actividades/';
                break;
            default:
                throw new Error('Tipo no válido');
        }

        // Leer el archivo JSON actual
        const jsonPath = path.join(process.cwd(), 'public/external-site', jsonFile);
        const jsonContent = await fs.readFile(jsonPath, 'utf8');
        const jsonData = JSON.parse(jsonContent);

        // Parsear los datos del body si vienen como string
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

        // Procesar la imagen si se proporcionó una nueva
        if (image) {
            const fileName = `${Date.now()}_${image.name}`;
            const fullImagePath = path.join(process.cwd(), 'public/external-site/Pagina-Web', imagePath, fileName);
            
            // Crear directorio si no existe
            await fs.mkdir(path.dirname(fullImagePath), { recursive: true });

            // Guardar la imagen
            await fs.writeFile(fullImagePath, image.data);

            // Actualizar la ruta de la imagen en los datos
            parsedData.img = path.join(imagePath, fileName).replace(/\\/g, '/');
        }

        // Función auxiliar para asegurar IDs numéricos
        const ensureNumericId = obj => ({
            ...obj,
            id: parseInt(obj.id)
        });

        // Actualizar o agregar el elemento según el tipo
        if (type === 'salas') {
            // Convertir strings en objetos si existen
            jsonData.salas = jsonData.salas
                .map(item => (typeof item === 'string' ? JSON.parse(item) : item))
                .filter(Boolean);

            if (parsedData.id) {
                const index = jsonData.salas.findIndex(item => item.id === parseInt(parsedData.id));
                if (index !== -1) {
                    jsonData.salas[index] = ensureNumericId({
                        ...jsonData.salas[index],
                        ...parsedData
                    });
                } else {
                    jsonData.salas.push(ensureNumericId(parsedData));
                }
            } else {
                const newId = Math.max(...jsonData.salas.map(s => s.id), 0) + 1;
                jsonData.salas.push({ ...parsedData, id: newId });
            }
        }

        else if (type === 'funciones') {
            jsonData.dias = jsonData.dias
                .map(item => (typeof item === 'string' ? JSON.parse(item) : item))
                .filter(Boolean);

            if (parsedData.id) {
                const index = jsonData.dias.findIndex(item => item.id === parseInt(parsedData.id));
                if (index !== -1) {
                    jsonData.dias[index] = ensureNumericId({
                        ...jsonData.dias[index],
                        ...parsedData
                    });
                } else {
                    jsonData.dias.push(ensureNumericId(parsedData));
                }
            } else {
                const newId = Math.max(...jsonData.dias.map(d => d.id), 0) + 1;
                jsonData.dias.push({ ...parsedData, id: newId });
            }
        }

        else if (type === 'actividades') {
            jsonData.actividades = jsonData.actividades
                .map(item => (typeof item === 'string' ? JSON.parse(item) : item))
                .filter(Boolean);

            if (parsedData.id) {
                const index = jsonData.actividades.findIndex(item => item.id === parseInt(parsedData.id));
                if (index !== -1) {
                    jsonData.actividades[index] = ensureNumericId({
                        ...jsonData.actividades[index],
                        ...parsedData
                    });
                } else {
                    jsonData.actividades.push(ensureNumericId(parsedData));
                }
            } else {
                const newId = Math.max(...jsonData.actividades.map(a => a.id), 0) + 1;
                jsonData.actividades.push({ ...parsedData, id: newId });
            }
        }

        // Asegurarse de que los datos sean JSON válidos
        const cleanData = JSON.parse(JSON.stringify(jsonData));

        // Guardar los cambios en formato bonito
        await fs.writeFile(jsonPath, JSON.stringify(cleanData, null, 2));

        res.json({ success: true });
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = updateItem;
