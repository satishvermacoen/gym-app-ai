import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout } from "../services/login.service";
import { useAuthStore } from "../../../stores/auth.store";
import type { LoginInput } from "../../../schemas/User/login.schema";
import { useRouter } from "next/navigation";

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
      qc.invalidateQueries();
    },
  });
}


export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      router.push("/login"); // redirect after logout
    },
    onError: (err: any) => {
      console.error("Logout failed:", err);
      clearAuth();
      router.push("/login");
    },
  });
};