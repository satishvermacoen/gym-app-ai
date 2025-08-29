// src/hooks/useSearch.ts
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/services/search.service";
import { SearchEntity } from "@/types/search";

export function useSearch(q: string, entity: SearchEntity = "all", branchId?: string | null) {
  return useQuery({
    queryKey: ["search", entity, q, branchId ?? ""],
    queryFn: () => {
      const params = branchId === undefined ? { q, entity } : { q, entity, branchId };
      return searchApi(params);
    },
    enabled: q.trim().length >= 2, // start searching from 2+ chars
    staleTime: 30_000,
  });
}
