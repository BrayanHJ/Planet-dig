import { create } from "zustand";
import { persist } from "zustand/middleware";
export const UseThemStore = create(persist((set) => ({
        theme: "light",
        setTheme: () => set((State) => {
            const newTheme = State.theme === "light" ? "dark" : "light";
            document.documentElement.classList.remove(State.theme);
            document.documentElement.classList.add(newTheme);
            return { theme: newTheme };
        })
    }), {
        name: "theme-storage-onlidevs",
        // getStorage: () => localStorage,
    }  
))