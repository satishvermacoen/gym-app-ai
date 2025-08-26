import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, logout } from "../../services/auth/login.service";
import type { LoginInput } from "@/types/auth";

export function useLogin() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: LoginInput) => login(payload),
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["auth","me"] }); /* redirect if needed */ },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => logout(),
    onSettled: async () => { await qc.resetQueries(); router.push("/login"); },
  });
}
