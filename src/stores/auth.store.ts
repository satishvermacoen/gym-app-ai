import { create } from "zustand"

type User = {
  _id: string
  username: string
  email: string
  role: "OWNER" | "MANAGER" | "STAFF"
  fullName?: { firstName?: string; lastName?: string }
  ownedBranches: string[]
}

type AuthState = {
  user: User | null
  loginDemo: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loginDemo: () => {
    const demoUser: User = {
      _id: "688b420d1da3c1c4ae776b62",
      username: "satish",
      email: "mukti@gmail.com",
      role: "OWNER",
      fullName: { firstName: "mukti", lastName: "verma" },
      ownedBranches: [
        "688b420d1da3c1c4ae776b64",
        "688bc5bd21961365004a1d07",
        "688bce861b174121531a939e",
      ],
    }
    localStorage.setItem("user", JSON.stringify(demoUser))
    set({ user: demoUser })
  },
  logout: () => {
    localStorage.removeItem("user")
    set({ user: null })
  },
}))

// Hydrate on import (client-only):
if (typeof window !== "undefined") {
  const raw = localStorage.getItem("user")
  if (raw) try { useAuthStore.setState({ user: JSON.parse(raw) }) } catch {}
}