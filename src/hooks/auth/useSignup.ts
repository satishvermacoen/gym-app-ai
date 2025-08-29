// src/features/auth/hooks/use.Signup.Auth.ts
import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  verifyEmailOtp,
} from "@/services/auth/signup.service";
import type { SignupInput, VerifyEmailInput } from "@/types/auth";

/**
 * Registers a user and triggers email OTP.
 * Service already handles object→FormData conversion when needed.
 */
export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupInput | FormData) => registerUser(payload),
  });
}

/**
 * Verifies the email OTP.
 * Backend returns { emailVerified: boolean } — no cache invalidation needed here.
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: VerifyEmailInput) => verifyEmailOtp(payload),
  });
}
