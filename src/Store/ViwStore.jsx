import { create } from 'zustand';

export const useInicioStore = create((set, get) => ({
    usuarios: [],
    loading: false,
    error: null,

    cargarRegistrosVentas: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/boletos/Registros");
            const data = await res.json();
            console.log('cargarRegistrosVentas: response', res.status, data);
            if (!data.success) {
                const msg = data.mensaje || "Error al cargar registros de ventas";
                set({ error: msg, loading: false });
                throw new Error(msg);
            }
            // Accept multiple response shapes: { registros } or { boletos }
            const registros = data.registros || data.boletos || data.Boletos || [];
            set({ registrosVentas: registros, loading: false });
        } catch (err) {
            console.error('cargarRegistrosVentas error:', err);
            set({ error: err.message || String(err), loading: false });
        }
    },

}));
