import { create } from 'zustand';

export const useInicioStore = create((set, get) => ({
    usuarios: [],
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

    // método de login centralizado en el store
    login: async (usuario, contrasena) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, contrasena })
            });
            const data = await response.json();
            set({ loading: false });
            return data;
        } catch (err) {
            set({ error: err.message, loading: false });
            return { success: false, mensaje: 'Error de conexión' };
        }
    },
}));
