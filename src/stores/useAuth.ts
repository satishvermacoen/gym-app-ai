import { create } from "zustand";

export type User = {
  _id: string;
  email: string;
  fullName?: {
    firstName?: string;
    lastName?: string;
  };
  role?: string;
} | null;

interface AuthState {
  user: User;
  setUser: (user: User) => void;
}


export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));