import { create } from "zustand";
import { persist } from "zustand/middleware";

export const UserStore = create(persist((set) => ({
    // User state

        User: "",
        Rol: "Null",
        idUser: "Null",
        modal: false,

        // User setters
        setIdUser: (idUser) => set({ idUser }),
        setUser: (User) => set({ User }),
        setRol: (Rol) => set({ Rol }),
        
        // Modal state
        setModal: (modal) => set({ modal }),
        reset: () => set({ User: "Null", Rol: "Null", idUser: "Null", modal: false }),

    }), {
        name: "user-storage",
    },
))