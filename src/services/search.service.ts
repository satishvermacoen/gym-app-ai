// src/services/search.service.ts
import { API_ROUTES } from "@/constants/api-route";
import { api } from "@/lib/api"; // your configured axios instance
import { SearchEntity } from "@/types/search";



export async function searchApi(params: {
  q: string;
  entity?: SearchEntity;
  branchId?: string | null;
  page?: number;
  limit?: number;
}) {
  const { q, entity = "all", branchId, page, limit } = params;
  const res = await api.get(API_ROUTES.search.search, {
    params: { q, entity, branchId, page, limit },
  });
  return res.data;
}
