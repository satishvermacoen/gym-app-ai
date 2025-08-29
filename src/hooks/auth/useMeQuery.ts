import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/constants/auth.api-route";
import { api } from "@/lib/api";
import type { User } from "@/types/auth";
import { isAxiosError } from "axios";
import { useBranches } from "../branch/useBranches";
import React from "react";


const qk = { me: () => ["auth","me"] as const };

function unwrapUser(payload: any) {
  const root = payload?.data ?? payload;
  const inner = root?.data ?? root;
  return inner?.user ?? inner?.currentUser ?? inner ?? null;
}

async function fetchMe(): Promise<User | null> {
  try {
    const { data } = await api.get(API_ROUTES.auth.me, { withCredentials: true });
    return unwrapUser(data);
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 401) {
      return null;
    }
    throw e;
  }
}

export function useMeQuery(enabled = true) {
  return useQuery({ 
    queryKey: qk.me(), 
    queryFn: fetchMe,
    enabled, 
    staleTime: 300_000, 
    retry: 1 
  });
}

