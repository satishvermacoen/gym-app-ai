import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth.store"

// Demo: pretend we fetch branch metadata by IDs
async function fetchBranchSummaries(ids: string[]) {
  // In real life: return (await api.get('/branches', { params: { ids } })).data
  // Demo: map ids to fake names
  return ids.map((id, i) => ({
    id,
    name: ["Downtown Fitness", "Westside Gym", "Sunrise Strength"][i % 3] +
      ` #${i + 1}`,
    city: ["New York", "Los Angeles", "Miami"][i % 3],
  }))
}

export function useOwnedBranches() {
  const user = useAuthStore((s) => s.user)
  const ids = user?.ownedBranches ?? []

  return useQuery({
    queryKey: ["owned-branches", ids],
    queryFn: () => fetchBranchSummaries(ids),
    enabled: ids.length > 0,
  })
}