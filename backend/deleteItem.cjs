const fs = require('fs').promises;
const path = require('path');

async function deleteItem(req, res) {
    try {
        const { type, id } = req.body;

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

        // Encontrar y eliminar el elemento
        let deletedItem;
        if (type === 'salas') {
            deletedItem = jsonData.salas.find(item => item.id === id);
            jsonData.salas = jsonData.salas.filter(item => item.id !== id);
        } else if (type === 'funciones') {
            deletedItem = jsonData.dias.find(item => item.id === id);
            jsonData.dias = jsonData.dias.filter(item => item.id !== id);
        } else if (type === 'actividades') {
            deletedItem = jsonData.actividades.find(item => item.id === id);
            jsonData.actividades = jsonData.actividades.filter(item => item.id !== id);
        }

        // Eliminar la imagen asociada si existe
        if (deletedItem?.img) {
            const imagePath = path.join(process.cwd(), 'public/external-site/Pagina-Web', deletedItem.img);
            try {
                await fs.unlink(imagePath);
            } catch (error) {
                console.error('Error al eliminar la imagen:', error);
                // Continuamos incluso si no se puede eliminar la imagen
            }
        }

        // Guardar los cambios en el archivo JSON
        await fs.writeFile(jsonPath, JSON.stringify(jsonData, null, 2));

        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = deleteItem;