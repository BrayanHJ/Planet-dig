import { create } from 'zustand';

export const BoletosStore = create((set, get) => ({
    Boletos: [],
    loading: false,
    error: null,

    // método para cargar boletos (endpoint correcto)
    cargarBoletos: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/boletos");
            const data = await res.json();
            console.log('cargarBoletos: response', res.status, data);
            if (!data.success) {
                const msg = data.mensaje || "Error al cargar boletos";
                set({ error: msg, loading: false });
                throw new Error(msg);
            }
            // Some endpoints return 'boletos' (lowercase) — accept both shapes
            set({ Boletos: data.boletos || data.Boletos || [], loading: false });
        } catch (err) {
            console.error('cargarBoletos error:', err);
            set({ error: err.message || String(err), loading: false });
        }
    },

    // Guardar Row de selección
    seleccionados: [],
    setSeleccionados: (items) => set({ seleccionados: items }),
    clearSeleccionados: () => set({ seleccionados: [] }),

    //Agregar registro de venta
    insertarVenta: async (usuario) => {
        const res = await fetch("/api/Insert_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
        });
        alert(usuario);
        const data = await res.json();
        if (!data.success) throw new Error(data.mensaje || "Error al insertar usuario");
        return data;
    },

}));
