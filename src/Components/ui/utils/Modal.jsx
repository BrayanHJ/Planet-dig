import { motion , AnimatePresence } from "framer-motion";
import { useTareasStore } from "../../../Store/TareasStore.jsx";

export const Modal = () => {
    const { accion , itemSelect } = useTareasStore();
    const tareaActual = itemSelect || { Tarea: "", Descripcion: "", Limite: "", Estado: "Pendiente" };
    let titulo = "Gestión de Tareas";
    if (accion === "editar") titulo = "Editar Tarea";
    else if (accion === "eliminar") titulo = "Eliminar Tarea";
    else if (accion === "agregar") titulo = "Agregar Nueva Tarea";

    return (
        <AnimatePresence>
        <motion.main className="bg-black/50 fixed top-0 left-0 right-0 bg-opacity-50 w-full h-full flex justify-center items-center backdrop-blur-lg"
            initial={{ opacity: 0, y:-1000 }}
            animate={{ opacity: 1 , y:0 }}
            exit={{ opacity: 0 , y:-1000 }}
            transition={{ duration: 2.0 , ease: "easeInOut" }}
        >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-3xl mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">{titulo}</h2>
                <section>
                    <form action="" className="*:text-center flex items-center flex-col">
                        {/* ...existing code... */}
                        <label htmlFor="nueva-tarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nombre
                        </label>
                        <input type="text" id="nueva-tarea" className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full mb-4" 
                        value={tareaActual.Tarea}
                        />
                        <br />
                        <label htmlFor="nueva-tarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Descripcion
                        </label>
                        <input type="text" id="nueva-tarea" className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full mb-4" 
                        value={tareaActual.Descripcion}
                        />
                        <br />
                        <label htmlFor="nueva-tarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Limite
                        </label>
                        <input type="date" id="nueva-tarea" className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full mb-4" 
                        value={tareaActual.Limite}
                        />

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