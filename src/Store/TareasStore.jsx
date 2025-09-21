import { create } from 'zustand';

const Tabla = "Todolist";



export const useTareasStore = create((set, get) => ({
    tareas: [],
    usuarios: [],
    loading: false,
    error: null,

    accion: "",
    setAccion: (accion) => set({ accion }),

    stateModal: false,
    setStateModal: (state) => set({ stateModal: state }),

    EstadoTarea: false,
    setEstadoTarea: (estado) => set({ EstadoTarea: estado }),

    itemSelect: null,
    setItemSelect: (item) => set({ itemSelect: item }),

    buscador: "",
    setBuscador: (buscador) => set({ buscador }),


    // Cargar todas las tareas desde el backend
    cargarTareas: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("http://localhost:3000/api/tareas");
            const data = await res.json();
            if (!data.success) throw new Error(data.mensaje || "Error al cargar tareas");
            set({ tareas: data.Tareas, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // Cargar todos los usuarios desde el backend
    cargarUsuarios: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("http://localhost:3000/api/usuarios");
            const data = await res.json();
            if (!data.success) throw new Error(data.mensaje || "Error al cargar usuarios");
            set({ usuarios: data.usuarios, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },


    // Buscar tareas por nombre (ajusta el endpoint según tu backend)
    buscarTareas: async (buscador) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`http://localhost:3000/api/tareas?nombre=${encodeURIComponent(buscador)}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.mensaje || "Error al buscar tareas");
            set({ tareas: data.tareas, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },


    // Insertar una nueva tarea
    insertarTarea: async (tarea) => {
        const res = await fetch("http://localhost:3000/api/tareas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tarea)
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al insertar tarea");
        await get().cargarTareas();
    },


    // Editar una tarea existente
    editarTareas: async (p) => {
        const res = await fetch(`http://localhost:3000/api/tareas/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p)
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al editar tarea");
        await get().cargarTareas();
    },


    // Eliminar una tarea
    eliminarTarea: async (id) => {
        const res = await fetch(`http://localhost:3000/api/tareas/${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al eliminar tarea");
        await get().cargarTareas();
    },
}));
