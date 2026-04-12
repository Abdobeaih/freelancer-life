import { create } from "zustand";

export type ToastType = "ok" | "err" | "warn" | "info" | "points";

interface ToastStore {
  msg:  string | null;
  type: ToastType;
  show: (msg: string, type?: ToastType) => void;
  hide: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  msg: null,
  type: "ok",
  show: (msg, type = "ok") => {
    set({ msg, type });
    setTimeout(() => set({ msg: null }), 3800);
  },
  hide: () => set({ msg: null }),
}));
