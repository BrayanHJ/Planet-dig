
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { useTareasStore } from "../../../Store/TareasStore";

export const SearchBar = () => {

    const { setStateModal, setAccion } = useTareasStore();
    
        const AsignarAccion = (Accion) => {
            setAccion(Accion);
            setStateModal(true);
        };

    return (
        <div className="h-full flex flex-col md:flex-row justify-between mb-12 gap-4 mt-3 bg-gray-300 dark:bg-neutral-950 ">
            <section className="w-full md:w-8/12 justify-center items-center flex gap-4">
                <Icon icon="line-md:search-twotone" width="44" height="44" />    
                <input
                    type="search"
                    className="bg-Primary text-white text-center rounded-4xl w-full max-w-lg text-2xl px-4 py-2 cursor-text transition-all"
                    placeholder="Buscar Tarea"
                />
            </section>

            <section className="w-full md:w-4/12 justify-center flex flex-col md:flex-row gap-4">
                <button className="bg-blue-400 rounded-3xl text-2xl px-6 py-2 cursor-pointer m-2"
                onClick={() => AsignarAccion("agregar") }
                >
                    Nueva Tarea
                </button>
                <button className="bg-blue-400 rounded-3xl text-2xl px-6 py-2 cursor-pointer m-2">
                    Tabla / barra 
                </button>
            </section>

        </div>
    );
}