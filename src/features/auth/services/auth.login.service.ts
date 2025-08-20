// features/auth/services/auth.service.ts
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import api from "@/lib/api";

/**
 * Adjust these to your actual Express routes.
 * Based on your controller names: loginUser & loginVerfication
 */
const AUTH_ROUTES = {
  loginUser: "/users/login",               // POST -> sends OTP, returns 202 + { email }
  loginVerification: "/users/login-otp-verfication"// POST -> verifies OTP, sets cookies, returns 200 + { user }
} as const;

/* =========================
   Types (align with server)
   ========================= */
export type LoginUserDto = {
  email: string;
  password: string;
};

export type VerifyLoginOtpDto = {
  email: string;
  otp: string;
};

export type LoginUserResponse = {
  statusCode: number;           // 202 expected
  message: string;              // "OTP sent ..." from controller
  data: {
    message: string;
    statusCode: number; email: string 
};
};

export type VerifyLoginOtpResponse = {
  statusCode: number;           // 200 expected
  message: string;              // "User logged in successfully"
  data: {
    statusCode: number;
    message: string; user: any 
};          // replace `any` with your User model type if you have one
};

/* =========================
   Pure API functions
   ========================= */

/**
 * Step 1: call loginUser -> sends OTP to user's email.
 * Controller returns 202 + { email } on success.
 */
export async function loginUserApi(
  payload: LoginUserDto
): Promise<LoginUserResponse> {
  const { data } = await api.post(AUTH_ROUTES.loginUser, payload, {
    withCredentials: true,
  });
  // Expect: { statusCode: 202, message, data: { email } }
  return data as LoginUserResponse;
}

/**
 * Step 2: verify the OTP -> server sets cookies & returns { user }.
 */
export async function verifyLoginOtpApi(
  payload: VerifyLoginOtpDto
): Promise<VerifyLoginOtpResponse> {
  const { data } = await api.post(AUTH_ROUTES.loginVerification, payload, {
    withCredentials: true,
  });
  // Expect: { statusCode: 200, message, data: { user } }
  return data as VerifyLoginOtpResponse;
}

/* =========================
   React Query mutations
   ========================= */

/**
 * Use in your Login form (step 1).
 * Example:
 *   const loginMut = useLoginUserMutation();
 *   const res = await loginMut.mutateAsync({ email, password });
 *   if (res.statusCode === 202) { /* show OTP step *\/ }
 */
export function useLoginUserMutation(): UseMutationResult<
  LoginUserResponse,
  unknown,
  LoginUserDto
> {
  return useMutation({
    mutationFn: (payload) => loginUserApi(payload),
  });
}

/**
 * Use in your OTP form (step 2).
 * Example:
 *   const verifyMut = useLoginVerificationMutation();
 *   const res = await verifyMut.mutateAsync({ email, otp });
 *   if (res.statusCode === 200) { /* success -> route *\/ }
 */
export function useLoginVerificationMutation(): UseMutationResult<
  VerifyLoginOtpResponse,
  unknown,
  VerifyLoginOtpDto
> {
  return useMutation({
    mutationFn: (payload) => verifyLoginOtpApi(payload),
  });
}


// inside auth.service.ts
export async function loginWithGoogleApi(): Promise<any> {
  const { data } = await api.get("/auth/google", {
    withCredentials: true,
  });
  return data;
}

export function useLoginWithGoogleMutation() {
  return useMutation({
    mutationFn: () => loginWithGoogleApi(),
  });
}
