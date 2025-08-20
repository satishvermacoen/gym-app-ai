// /hooks/useAuth.ts
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login,
  logout,
  registerUser,
  getCurrentUser,
  type LoginDto,
  type SignupDto,
} from "../services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "../types/User";

/**
 * Fetch and cache the current user (from cookie session or valid token).
 * Keeps Zustand's user in sync with the server.
 */
export function useMeQuery() {
  const { setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    retry: false, // avoid retry loops on 401/403
    staleTime: 5 * 60 * 1000,
  });

  // Sync Zustand store with query result
  React.useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data ?? null);
    }
    if (query.isError) {
      setUser(null);
    }
  }, [query.data, query.isSuccess, query.isError, setUser]);

  return query;
}
console.log("check it", useMeQuery)
/**
 * Login hook.
 * On success: saves tokens (if provided), sets user, and invalidates "me".
 */
export function useLoginMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginDto) => login(payload),
    onSuccess: async (res) => {
      const { setUser, setTokens } = useAuthStore.getState();
      if (res?.user) setUser(res.user);
      // If your backend returns tokens (JWT), store them (optional)
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

/**
 * Signup hook.
 * Mirrors login behavior if your API returns the same shape.
 */
export function useSignupMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: SignupDto) => registerUser(payload),
    onSuccess: async (res) => {
      const { setUser, setTokens } = useAuthStore.getState();
      if (res?.user) setUser(res.user);
      
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

/**
 * Logout hook.
 * Clears tokens (if stored), clears user, and invalidates "me".
 */
export function useLogoutMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      const { clearUser, clearTokens } = useAuthStore.getState();
      clearTokens?.();
      clearUser();
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
