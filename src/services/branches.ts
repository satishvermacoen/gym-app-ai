// services/branches.ts
import api from "@/lib/api"
import { Branch } from "@/types/Branch"

export async function getBranches(page: number) {
  const res = await api.get<{ items: Branch[] }>(`/branches?page=${page}`)
  return res.data
}
