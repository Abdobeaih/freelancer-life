import { create } from "zustand";
export const useToastStore = create((set) => ({
    msg: null,
    type: "ok",
    show: (msg, type = "ok") => {
        set({ msg, type });
        setTimeout(() => set({ msg: null }), 3800);
    },
    hide: () => set({ msg: null }),
}));
