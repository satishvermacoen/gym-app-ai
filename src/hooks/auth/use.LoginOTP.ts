// src/features/auth/hooks/use.LoginOTP.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendLoginOtp,
  verifyLoginOtp,
} from "@/services/auth/login-otp.service";


export function useSendLoginOtp() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof sendLoginOtp>[0]) => sendLoginOtp(payload as any),
  });
}

export function useVerifyLoginOtp() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof verifyLoginOtp>[0]) => verifyLoginOtp(payload as any),
    // Whether your backend logs the user in or not, refreshing /me is harmless.
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
