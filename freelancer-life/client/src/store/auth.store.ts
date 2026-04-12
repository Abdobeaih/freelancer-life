import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Company, Role } from "../types";
import api from "../lib/api";

interface AuthStore {
  token:   string | null;
  role:    Role | null;
  user:    User | null;
  company: Company | null;
  isLoading: boolean;

  login:    (email: string, password: string, role: Role) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout:   () => void;
  refreshUser: () => Promise<void>;
  refreshCompany: () => Promise<void>;
  setUser:  (u: User) => void;
}

export interface RegisterData {
  name: string; email: string; password: string; job: string;
  plan: "free" | "premium" | "elite"; referralCode?: string;
  card?: { nameOnCard: string; lastFour: string; expiry: string } | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null, role: null, user: null, company: null, isLoading: false,

      login: async (email, password, role) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/login", { email, password, role });
          localStorage.setItem("fl_token", data.token);
          localStorage.setItem("fl_role", role);
          set({ token: data.token, role, user: data.user ?? null, company: data.company ?? null });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (payload) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/register", payload);
          localStorage.setItem("fl_token", data.token);
          localStorage.setItem("fl_role", "user");
          set({ token: data.token, role: "user", user: data.user });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem("fl_token");
        localStorage.removeItem("fl_role");
        set({ token: null, role: null, user: null, company: null });
      },

      refreshUser: async () => {
        if (get().role !== "user") return;
        const { data } = await api.get("/users/me");
        set({ user: data });
      },

      refreshCompany: async () => {
        if (get().role !== "company") return;
        const { data } = await api.get("/companies/me");
        set({ company: data });
      },

      setUser: (u) => set({ user: u }),
    }),
    {
      name: "fl_auth",
      partialize: (s) => ({ token: s.token, role: s.role, user: s.user, company: s.company }),
    }
  )
);
