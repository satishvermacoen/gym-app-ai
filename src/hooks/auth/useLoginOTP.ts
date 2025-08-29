// src/features/auth/hooks/use.LoginOTP.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendLoginOtp,
  verifyLoginOtp,
} from "@/services/auth/login-otp.service";


export function useSendLoginOtp() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof sendLoginOtp>[0]) => sendLoginOtp(payload),
  });
}

export function useVerifyLoginOtp() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof verifyLoginOtp>[0]) => verifyLoginOtp(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
