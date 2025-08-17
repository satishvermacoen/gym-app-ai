import { create } from "zustand"

type BranchState = {
  activeBranchId: string | null
  setActiveBranchId: (id: string | null) => void
}

export const useBranchStore = create<BranchState>((set) => ({
  activeBranchId: null,
  setActiveBranchId: (id) => {
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem("active_branch_id", id)
      else localStorage.removeItem("active_branch_id")
    }
    set({ activeBranchId: id })
  },
}))

// Hydrate from storage
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("active_branch_id")
  if (saved) useBranchStore.setState({ activeBranchId: saved })
}
