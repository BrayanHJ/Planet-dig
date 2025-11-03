import { create } from 'zustand';

export const imagenWebStore = create((set, get) => ({
    setData: (data) => set({ data }),
    getData: () => get().data,
    data: [],
}));
