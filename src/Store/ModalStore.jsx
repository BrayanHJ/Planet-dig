import { create } from 'zustand';
import { useLogStore } from './LogStore.jsx';


export const useModalStore = create((set) => ({
    tareas: [],
    usuarios: [],
    loading: false,
    error: null,

    accion: "",
    setAccion: (accion) => {
        set({ accion });
    },

    stateModal: false,
    setStateModal: (state) => {
        set({ stateModal: state });
    },

    EstadoTarea: false,
    setEstadoTarea: (estado) => {
        set({ EstadoTarea: estado });
    },

    itemSelect: null,
    setItemSelect: (item) => {
        set({ itemSelect: item });
    },

    tipoSelect: null,
    setTipoSelect: (item) => {
        set({ tipoSelect: item });
    },

    buscador: "",
    setBuscador: (buscador) => {
        set({ buscador });
    },

    // Agregar Usuario
    insertarUsuario: async (usuario) => {
        const res = await fetch("/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al insertar usuario");
        // log the action AFTER success (best-effort)
        try { 
            useLogStore.getState().addLog({ 
                Accion: 'InsertarUsuario', 
                Detalle: `usuario:${usuario.usuario}, nombre:${usuario.nombre}` 
            }); 
        } catch { /* ignore */ }
        return data;
    },

    // Editar un usuario existente
    editarUsuario: async (p) => {

        const res = await fetch(`/api/usuarios/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p)
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al editar usuario");
        try { 
            useLogStore.getState().addLog({ 
                Accion: 'EditarUsuario', 
                Detalle: `{id:${p.id}, usuario:${p.usuario}, nombre:${p.nombre}}` 
            }); 
        } catch { /* ignore */ }
        return data;
    },


    // Eliminar un usuario
    eliminarUsuario: async (id) => {
        const res = await fetch(`/api/usuarios/${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al eliminar usuario");
        
        // Log ONLY if delete was successful
        try { 
            useLogStore.getState().addLog({ 
                Accion: 'EliminarUsuario', 
                Detalle: `usuario_id:${id}` 
            }); 
        } catch { /* ignore */ }
        return data;
    },

    // Eliminar un registro de usuario (registro_usuarios)
    eliminarRegistroUsuario: async (id) => {
        const res = await fetch(`/api/RegistrosUser/${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al eliminar registro");
        try {
            useLogStore.getState().addLog({ Accion: 'EliminarRegistroUsuario', Detalle: `registro_id:${id}` });
        } catch { /* ignore */ }
        return data;
    },

     // Eliminar un registro de Venta de Boletos (registro_Venta_Boletos)
    eliminarRegistroVentaBoletos: async (id) => {
        const res = await fetch(`/api/RegistrosVentaBoletos/${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al eliminar registro");
        try {
            useLogStore.getState().addLog({ Accion: 'EliminarRegistroUsuario', Detalle: `registro_id:${id}` });
        } catch { /* ignore */ }
        return data;
    },


}));
