import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Modalimagenes = ({ isOpen, onClose, data, onUpdate }) => {
    const [itemData, setItemData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDelete = async () => {
        if (!data?.id || !data?.type) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/deleteItem', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: data.id,
                    type: data.type.toLowerCase(),
                }),
            });

            if (!response.ok) throw new Error('Error al eliminar');
            
            onUpdate?.(); // Notificar que hubo cambios
            onClose();
            // Aquí puedes agregar una notificación de éxito
        } catch (error) {
            console.error('Error:', error);
            // Aquí puedes agregar una notificación de error
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!data?.type) return;
        setIsLoading(true);
        
        try {
            // Validar que los datos son correctos
            const cleanData = {
                ...itemData,
                texto: itemData.texto || itemData.titulo || '',
                img: itemData.img || ''
            };
            
            // Eliminar propiedades undefined o null
            Object.keys(cleanData).forEach(key => 
                (cleanData[key] === undefined || cleanData[key] === null) && delete cleanData[key]
            );
            
            const formData = new FormData();
            formData.append('type', data.type.toLowerCase());
            formData.append('data', JSON.stringify(cleanData));
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const response = await fetch('/api/updateItem', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Error al guardar');
            
             onUpdate?.(); // Notificar que hubo cambios
            onClose();
            // Aquí puedes agregar una notificación de éxito
        } catch (error) {
            console.error('Error:', error);
            // Aquí puedes agregar una notificación de error
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // Crear URL para vista previa
            const previewUrl = URL.createObjectURL(file);
            setItemData(prev => ({
                ...prev,
                img: file.name,  // Actualizar el nombre del archivo
                previewUrl: previewUrl // Guardar la URL de vista previa
            }));
        }
    };

    // Limpiar las URLs de vista previa cuando se cierre el modal
    useEffect(() => {
        return () => {
            if (itemData?.previewUrl) {
                URL.revokeObjectURL(itemData.previewUrl);
            }
        };
    }, [itemData?.previewUrl]);

    useEffect(() => {
        const cargarDatos = async () => {
            if (!data?.type || data?.operacion === 'nuevo') return;

            try {
                let jsonPath = '';
                switch (data.type) {
                    case 'salas':
                        jsonPath = '/external-site/salas.json';
                        break;
                    case 'funciones':
                        jsonPath = '/external-site/funciones.json';
                        break;
                    case 'actividades':
                        jsonPath = '/external-site/actividades.json';
                        break;
                    default:
                        return;
                }

                const response = await fetch(jsonPath);
                if (!response.ok) throw new Error(`Error al cargar ${data.type}`);
                const jsonData = await response.json();

                // Buscar el elemento según el tipo
                let elemento;
                switch (data.type) {
                    case 'salas':
                        elemento = jsonData.salas.find(item => item.id === data.id);
                        break;
                    case 'funciones':
                        elemento = jsonData.dias.find(item => item.id === data.id);
                        break;
                    case 'actividades':
                        elemento = jsonData.actividades.find(item => item.id === data.id);
                        break;
                }

                if (elemento) {
                    setItemData(elemento);
                }
            } catch (error) {
                console.error('Error cargando datos:', error);
            }
        };

        cargarDatos();
    }, [data]);

    const TilesVariants = {
        initial: { 
            y: -500,
            opacity: 0 
        },
        animate: { 
            y: 0,
            opacity: 1,
            transition: { duration: 2.0 }
        },
        exit: { 
            y: -500,
            opacity: 0,
            transition: { duration: 2.0 }
        }
    };

    const InputsVariants = {
        initial: { 
            y: -500,
            opacity: 0 
        },
        animate: { 
            y: 0,
            opacity: 1,
            transition: { duration: 3.5 }
        },
        exit: { 
            y: -500,
            opacity: 0,
            transition: { duration: 3.5 }
        }
    };

    // Formatear los datos según el tipo
    const formatearDatos = () => {
        if (data?.operacion === 'nuevo') {
            return {
                id: null,
                texto: '',
                img: '',
                descripcion: '',
                estado: ''
            };
        }

        if (!itemData) return null;

        switch (data?.type) {
            case 'salas':
                return {
                    id: itemData.id,
                    texto: itemData.texto,
                    img: itemData.img
                };
            case 'funciones': {
                const fechaActual = new Date().toISOString().split('T')[0];
                return {
                    id: itemData.id,
                    texto: itemData.texto,
                    img: itemData.img,
                    estado: itemData.estado,
                    fecha: itemData.fecha || fechaActual
                };
            }
            case 'actividades': {
                const fechaActual = new Date().toISOString().split('T')[0];
                return {
                    id: itemData.id,
                    texto: itemData.titulo || '',
                    img: itemData.img || '',
                    descripcion: itemData.descripcion || '',
                    // Si no hay fechas definidas, usar la fecha actual
                    fechaInicio: itemData.fechaInicio || fechaActual,
                    fechaFin: itemData.fechaFin || fechaActual
                };
            }
            default:
                return null;
        }
    };

    const datosFormateados = formatearDatos() || {
        id: data?.id || null,
        texto: data?.texto || '',
        img: data?.img || ''
    };    // Renderizar campos específicos según el tipo
    const renderCamposEspecificos = () => {
        const tipo = data?.type?.toLowerCase();
        
        switch (tipo) {
            case 'salas':
                return (
                    <motion.div
                        variants={InputsVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <label className="block mb-4">
                            Nombre de la Sala:
                            <input 
                                className="w-full border rounded px-2 py-1 bg-transparent"
                                value={datosFormateados.texto || ''}
                                onChange={(e) => setItemData({...itemData, texto: e.target.value})}
                                placeholder="Nombre de la sala..."
                            />
                        </label>
                    </motion.div>
                );
            
            case 'funciones':
                return (
                    <motion.div
                        variants={InputsVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <label className="mb-4 flex flex-row justify-center items-center gap-3">
                            <motion.h2 
                                className="font-bold text-2xl"
                                variants={TilesVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                Día:
                            </motion.h2>
                            <select 
                                className="w-full border rounded px-2 py-1 bg-bg-dark text-amber-400"
                                value={datosFormateados.texto}
                                onChange={(e) => setItemData({...itemData, texto: e.target.value})}
                            >
                                <option value="" >Seleccione un día</option>
                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => (
                                    <option 
                                        key={dia} 
                                        value={dia}
                                    >
                                        {dia}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block mb-4">
                            Estado:
                            <select 
                                className="w-full border rounded px-2 py-1 bg-bg-dark  text-amber-400"
                                value={datosFormateados.estado || 'si_hay_funcion'}
                                onChange={(e) => setItemData({...itemData, estado: e.target.value})}
                            >
                                <option value="">Seleccione un estado</option>
                                <option 
                                    value="si_hay_funcion"
                                    selected={datosFormateados.estado === 'si_hay_funcion'}
                                >
                                    Hay función
                                </option>
                                <option 
                                    value="no_hay_funcion"
                                    selected={datosFormateados.estado === 'no_hay_funcion'}
                                >
                                    No hay función
                                </option>
                            </select>
                        </label>
                    </motion.div>
                );
            
            case 'actividades':
                return (
                    <motion.div
                        variants={InputsVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <label className="block mb-6">
                            <motion.h2 
                                className="font-bold text-xl mb-2"
                                variants={TilesVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                Descripción:
                            </motion.h2>
                            <textarea 
                                className="w-full border rounded px-2 py-1 bg-transparent"
                                value={datosFormateados.descripcion || ''}
                                onChange={(e) => setItemData({...itemData, descripcion: e.target.value})}
                                rows={3}
                                placeholder="Describe la actividad..."
                            />
                        </label>
                        <motion.div className="mb-4">
                            <motion.h2 
                                className="font-bold text-xl mb-2 text-center"
                                variants={TilesVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                Periodo de Actividad:
                            </motion.h2>
                            <div className="flex gap-4">
                                <label className="flex-1">
                                    <span className="block mb-1">Fecha Inicio:</span>
                                    <input 
                                        type="date"
                                        className="w-full border rounded px-2 py-1 text-white bg-blue-500 cursor-pointer"
                                        value={datosFormateados.fechaInicio || ''}
                                        onChange={(e) => setItemData({...itemData, fechaInicio: e.target.value})}
                                    />
                                </label>
                                <label className="flex-1">
                                    <span className="block mb-1">Fecha Fin:</span>
                                    <input 
                                        type="date"
                                        className="w-full border rounded px-2 py-1 text-white bg-blue-500 cursor-pointer"
                                        value={datosFormateados.fechaFin || ''}
                                        onChange={(e) => setItemData({...itemData, fechaFin: e.target.value})}
                                    />
                                </label>
                            </div>
                        </motion.div>
                    </motion.div>
                );
            
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-90 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div 
                    className="bg-bg-dark p-6 rounded-lg w-1/2"
                    variants={TilesVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <motion.h1 className="font-bold text-4xl text-center mb-5 gap-1.5"
                    initial={{  y: -500 }}
                    animate={{ y: 0 }}
                    exit={{ y: -500 }}
                    transition={{ duration: 2.0 }}
                    >
                        {data?.operacion === 'nuevo' ? 'Crear Nuevo' : 'Editar'} {data?.type}
                    </motion.h1>

                    {renderCamposEspecificos()}

                    <motion.h2 
                        className="font-bold text-2xl mb-4 text-center"
                        variants={TilesVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        Imagenes
                    </motion.h2>
                <section className='flex flex-row justify-center align-center items-center gap-6 mb-4'>
                    {/* Mostrar la imagen actual solo si no hay una nueva imagen seleccionada */}
                    {!itemData?.previewUrl && datosFormateados.img && (
                        <div className="flex flex-col items-center gap-2">
                            <h3 className="text-lg">Imagen Actual:</h3>
                            <div className="relative w-48 h-32 border rounded overflow-hidden">
                                <img 
                                    src={`/external-site/Pagina-Web/${datosFormateados.img}`}
                                    alt={datosFormateados.texto || 'Vista previa'}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Sección de nueva imagen */}
                    <div className="flex flex-col items-center gap-2">
                        <h3 className="text-lg">{itemData?.previewUrl ? 'Vista Previa:' : 'Nueva Imagen:'}</h3>
                        {itemData?.previewUrl ? (
                            <div className="relative w-48 h-32 border rounded overflow-hidden">
                                <img
                                    src={itemData.previewUrl}
                                    alt="Vista previa"
                                    className="object-cover w-full h-full"
                                />
                                <button 
                                    onClick={() => {
                                        URL.revokeObjectURL(itemData.previewUrl);
                                        setSelectedFile(null);
                                        setItemData(prev => ({ ...prev, previewUrl: null }));
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                                    title="Cancelar selección"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer">
                                <input 
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <div className="border border-amber-50 rounded-xl p-3 hover:bg-amber-50/10 transition-colors">
                                    Seleccionar Archivo
                                </div>
                            </label>
                        )}
                    </div>
                </section>

                    <div className={`flex items-center gap-2 mt-3
                        ${data?.type?.toLowerCase() === 'actividades'
                        ? 'justify-between' // si es actividad
                        : 'justify-end' // si no
                        }`}
                    >

                        <motion.section className="flex justify-between align-center items-center gap-4"
                        variants={InputsVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        >
                            <button 
                                onClick={onClose}
                                className="px-3 py-1 border rounded cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Eliminando...' : 'Eliminar'}
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </motion.section>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}