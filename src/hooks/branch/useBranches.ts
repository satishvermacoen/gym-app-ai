import { fetchBranches, fetchDashboard } from "@/services/branch/branch.service";
import { useQuery } from "@tanstack/react-query";


export function useBranches() {
  return useQuery({
    queryKey: ["auth","branches"],
    queryFn: fetchBranches,
    staleTime: 5 * 60 * 1000,
  });
}



export function useDashboard(branchId: string | undefined) {
  return useQuery({
    queryKey: ["auth", "dashboard", branchId],
    queryFn: () => {
      if (!branchId) throw new Error("Missing branchId");
      return fetchDashboard(branchId);
    },
    enabled: !!branchId,
  });
}