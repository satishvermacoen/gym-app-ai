import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser, verifyEmailOtp } from "@/features/auth/services/signup.service";
import type { SignupInput, VerifyEmailInput } from "@/schemas/User/signup.schema";
import { useAuthStore } from "@/stores/auth.store";

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupInput | FormData) => {
      // Accept FormData for avatar upload
      return payload instanceof FormData
        ? registerUser(payload)
        : (() => {
            const fd = new FormData();
            fd.append("firstName", (payload as SignupInput).firstName);
            fd.append("lastName", (payload as SignupInput).lastName);
            fd.append("email", (payload as SignupInput).email);
            fd.append("password", (payload as SignupInput).password);
            fd.append("role", (payload as SignupInput).role);
            return registerUser(fd);
          })();
    },
  });
}

export function useVerifyEmail() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: VerifyEmailInput) => verifyEmailOtp(payload),
  });
}
