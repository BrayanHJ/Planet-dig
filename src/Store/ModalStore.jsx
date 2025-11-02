import { create } from 'zustand';


export const useModalStore = create((set) => ({
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

    tipoSelect: null,
    setTipoSelect: (item) => set({ tipoSelect: item }),

    buscador: "",
    setBuscador: (buscador) => set({ buscador }),

    // Agregar Usuario
    insertarUsuario: async (usuario) => {
        const res = await fetch("http://localhost:3000/api/Insert_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
        });
        alert(usuario);
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al insertar usuario");
        return data;
    },

    // Editar un usuario existente
    editarUsuario: async (p) => {
        // Use the standardized endpoint /api/usuarios/:id
        const res = await fetch(`/api/usuarios/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p)
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al editar usuario");
        return data;
    },


    // Eliminar un usuario
    eliminarUsuario: async (id) => {
        // Use the standardized endpoint /api/usuarios/:id
        const res = await fetch(`/api/usuarios/${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al eliminar usuario");
        return data;
    },


}));
