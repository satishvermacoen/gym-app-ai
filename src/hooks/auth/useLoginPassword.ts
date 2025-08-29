import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../../services/auth/login.service";
import type { LoginInput } from "@/types/auth";
export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginInput) => login(payload),
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["auth","me"] }); /* redirect if needed */ },
  });
}
