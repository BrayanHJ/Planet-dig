import { create } from "zustand";
import { persist } from "zustand/middleware";
export const User = create(persist((set) => ({
        name: "",
        password: "",
        setName: (name) => set({ name }),
        setPassword: (password) => set({ password }),
        reset: () => set({ name: "", password: "" }),
        
    }), {
        name: "user-storage",
    }  
))