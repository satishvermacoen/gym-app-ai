import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import { useAuthStore } from "../stores/auth.store";
import type { LoginInput } from "../schemas/auth.schema";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginInput) => login(payload),
    onSuccess: (res) => {
      setAuth({
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });
      // invalidate anything that depends on auth
      qc.invalidateQueries();
    },
  });
}
