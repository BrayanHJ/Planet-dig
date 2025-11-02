import { useEffect } from "react";
import { useTareasStore } from "../../../Store/TareasStore.jsx";
import { Icon } from "@iconify-icon/react/dist/iconify.js";

import {Modal} from "../../ui/utils/Modal.jsx";
import { ModalEstadoTarea } from "../../ui/utils/EstadoTarea.jsx";

import { AnimatePresence , motion } from "framer-motion";

export const CardTarea = () => {
    const { tareas, cargarTareas, loading, error } = useTareasStore();
    useEffect(() => {
        cargarTareas();
    }, [cargarTareas]);
    

    const { stateModal, setStateModal , setAccion, setItemSelect , setEstadoTarea , EstadoTarea  } = useTareasStore();

    const AsignarAccion = (Accion, tarea) => {
        setAccion(Accion);
        setItemSelect(tarea);
        setStateModal(true);
    };

    const AsignarEstado = (tarea) => {
        setAccion("editar");
        setItemSelect(tarea);
        setEstadoTarea(true);
    };


    if (loading) return <div>Cargando tareas...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full h-full flex flex-wrap gap-2 justify-center bg-gray-300 dark:bg-neutral-950 ">
            {tareas.map(t => (
                <main key={t.id_Tarea} className="bg-white/90 text-black w-90 rounded-4xl m-1 mb-4 sm:w-[32%]">
                    <div className="bg-blue-400 flex flex-row justify-between text-white rounded-t-4xl">
                        <button className="ml-5 cursor-pointer" onClick={() => AsignarAccion("eliminar", t) }>
                            <Icon icon="line-md:close-circle-filled" width="44" height="44"/>
                        </button>
                        <h1 className="text-3xl cursor-default flex text-center m-auto">{t.Tarea}</h1>
                        <button className="mr-5 cursor-pointer" onClick={() => AsignarAccion("editar", t) }>
                            <Icon icon="line-md:edit-full-twotone" width="44" height="44" />
                        </button>
                    </div>
                    <div>
                        <article className="m-2 rounded-xl bg-gray-400 text-white flex flex-col cursor-default text-center">
                            <span><b>Descripción: <br /> </b> {t.Descripcion}</span>
                        </article>
                        <section className="flex justify-between h-full">
                            <button className="bg-blue-400/75  text-white rounded-3xl text-xs px-6 py-2 cursor-pointer ml-5">
                                <span><b>Periodo:</b> {t.Periodo}</span>
                            </button>
                            <button className="bg-blue-400/75  text-white rounded-3xl text-xs px-6 py-2 cursor-pointer mr-5">
                                <span><b>Limite:</b> {t.Limite}</span>
                            </button>
                        </section>
                        <section className="flex justify-center">
                            <button className={`text-black rounded-2xl text-2xl px-6 py-2 cursor-pointer m-3 mt-7 w-full ${t.Estado === "Completada" ? 'bg-green-600/75 hover:bg-green-800' : t.Estado === "En Progreso" ? 'bg-yellow-400/75 hover:bg-yellow-600' : 'bg-red-500/75 hover:bg-red-700'}`}
                                onClick={() => AsignarEstado(t) }
                            >
                                <span><b>Estado:</b> {t.Estado}</span>
                            </button>
                        </section>
                    </div>
                </main>
            ))}
            <AnimatePresence>
            {stateModal && <Modal />}
            {EstadoTarea && <ModalEstadoTarea />}
            </AnimatePresence>
        </div>
    );
}