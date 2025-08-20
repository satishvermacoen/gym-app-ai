// /stores/auth.store.ts
import { create } from "zustand";
import type { User } from "@/features/auth/types/User";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (u: User | null) => void;
  clearUser: () => void;

  // Only if you cannot use cookies (prefer cookies!)
  accessToken?: string | null;
  refreshToken?: string | null;
  setTokens?: (a: string | null, r: string | null) => void;
  clearTokens?: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearUser: () => set({ user: null, isAuthenticated: false }),

  // If you *must* keep tokens client-side:
  accessToken: null,
  refreshToken: null,
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  clearTokens: () => set({ accessToken: null, refreshToken: null }),
}));
