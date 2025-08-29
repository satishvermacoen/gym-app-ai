import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "../../services/auth/login.service";
import { api } from "@/lib/api"

async function hardResetReactQuery(qc: ReturnType<typeof useQueryClient>) {
  await qc.cancelQueries();            
  qc.getMutationCache().clear();       
  qc.clear();                          
  delete api.defaults.headers.common.Authorization;
}

export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      await hardResetReactQuery(qc);
      router.replace("/login"); // go home after logout
    },
  });
}