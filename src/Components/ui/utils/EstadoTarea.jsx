import { motion , AnimatePresence } from "framer-motion";
import { useTareasStore } from "../../../Store/TareasStore.jsx";

export const ModalEstadoTarea = () => {
    const { accion, itemSelect, setItemSelect, editarTareas, setEstadoTarea } = useTareasStore();
    let titulo = "Gestión de Tareas";
    if (accion === "editar") titulo = "Editar Tarea";
    else if (accion === "eliminar") titulo = "Eliminar Tarea";
    else if (accion === "agregar") titulo = "Agregar Nueva Tarea";

    // Para editar el estado de la tarea
    const handleEstadoChange = (e) => {
        setItemSelect({ ...itemSelect, Estado: e.target.value });
    };

    // Guardar cambios (solo ejemplo, puedes mejorar la lógica)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (accion === "editar") {
            // Asegurarse de enviar el id correcto
            editarTareas({
                ...itemSelect,
                id: itemSelect.id_Tarea
            });
            setEstadoTarea(false);
        }
        
    };

    return (
        <AnimatePresence>
            <motion.main className="bg-black/50 fixed top-0 left-0 right-0 bg-opacity-50 w-full h-full flex justify-center items-center backdrop-blur-lg"
                initial={{ opacity: 0, x:+1000 }}
                animate={{ opacity: 1 , x:0 }}
                exit={{ opacity: 0 , x:+1000 }}
                transition={{ duration: 2.0 , ease: "easeInOut" }}
            >
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-3xl mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">{titulo}</h2>
                    <section>
                        <form onSubmit={handleSubmit} className="*:text-center flex items-center flex-col">
                            {itemSelect && (
                                <>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nombre
                                    </label>
                                    <input type="text" value={itemSelect.Tarea || ""} readOnly className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full mb-4" />
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Descripcion
                                    </label>
                                    <input type="text" value={itemSelect.Descripcion || ""} readOnly className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full mb-4" />
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Limite
                                    </label>
                                    <input type="date" value={itemSelect.Limite || ""} readOnly className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full mb-4" />
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Estado
                                    </label>
                                    <select value={itemSelect.Estado || "Pendiente"} onChange={handleEstadoChange} className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full mb-4">
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="En Progreso">En Progreso</option>
                                        <option value="Completada">Completada</option>
                                    </select>
                                </>
                            )}
                            <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">
                                {accion === "agregar" ? "Agregar Tarea" : accion === "editar" ? "Guardar Cambios" : accion === "eliminar" ? "Eliminar" : "Acción"}
                            </button>
                        </form>
                    </section>
                </div>
            </motion.main>
        </AnimatePresence>
    );
}