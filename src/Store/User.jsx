import { create } from "zustand";
import { persist } from "zustand/middleware";
export const User = create(persist((set) => ({
        name: "",
        age: "",
        password: "",
        setName: (name) => set({ name }),
        setAge: (age) => set({ age }),
        setPassword: (password) => set({ password }),

        reset: () => set({ name: "", age: "", password: "" }),
        
    }), {
        name: "user-storage",
    }  
))