import { create } from 'zustand';

export const useTablesStore = create((set, get) => ({
    usuarios: [],
    registrosUser: [], // Añadimos el estado para registros
    loading: false,
    error: null,

    // valores de formulario (si quieres mantenerlos en el store)
    usuarioForm: '',
    contrasenaForm: '',
    setUsuarioform: (usuario) => set({ usuarioForm: usuario }),
    setContrasenaform: (contrasena) => set({ contrasenaForm: contrasena }),

    accion: "",
    setAccion: (accion) => set({ accion }),

    stateModal: false,
    setStateModal: (state) => set({ stateModal: state }),

    // método para cargar usuarios (endpoint correcto)
    cargarUsuarios: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/usuarios");
            const data = await res.json();
            console.log('cargarUsuarios: response', res.status, data);
            if (!data.success) {
                const msg = data.mensaje || "Error al cargar usuarios";
                set({ error: msg, loading: false });
                throw new Error(msg);
            }
            set({ usuarios: data.usuarios, loading: false });
        } catch (err) {
            console.error('cargarUsuarios error:', err);
            set({ error: err.message || String(err), loading: false });
        }
    },


    cargarRegistrosUser: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/RegistrosUser");
            const data = await res.json();
            console.log('cargarRegistrosUser: response', res.status, data);
            if (!data.success) {
                const msg = data.mensaje || "Error al cargar registros de usuario";
                set({ error: msg, loading: false });
                throw new Error(msg);
            }
            set({ registrosUser: data.registros, loading: false });
        } catch (err) {
            console.error('cargarRegistrosUser error:', err);
            set({ error: err.message || String(err), loading: false });
        }
    },
    
}));
