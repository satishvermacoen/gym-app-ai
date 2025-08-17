// hooks/useBranches.ts
import { useQuery } from "@tanstack/react-query"
import { getBranches } from "@/services/branches"

export function useBranches(page: number) {
  return useQuery({
    queryKey: ["branches", page],
    queryFn: () => getBranches(page),
    keepPreviousData: true
  })
}
