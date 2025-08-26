import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/auth.api-route";
import type { RegisterResponse, VerifyResponse, SignupInput, VerifyEmailInput } from "@/types/auth";

export async function registerUser(input: SignupInput | FormData): Promise<RegisterResponse> {
  const payload = input instanceof FormData ? input : toFormData(input);
  const { data } = await api.post(API_ROUTES.auth.signup, payload);
  const d = data?.data ?? data;
  return { email: String(d.email), ttlMs: Number(d.ttlMs ?? 600_000) };
}

export async function verifyEmailOtp(payload: VerifyEmailInput): Promise<VerifyResponse> {
  const { data } = await api.post(API_ROUTES.auth.verifyEmail, payload);
  const d = data?.data ?? data;
  return { emailVerified: Boolean(d.emailVerified) };
}

function toFormData(p: SignupInput): FormData {
  const fd = new FormData();
  fd.append("firstName", p.firstName);
  fd.append("lastName", p.lastName);
  fd.append("email", p.email);
  fd.append("password", p.password);
  fd.append("role", p.role);
  if (p.avatar instanceof File) fd.append("avatar", p.avatar);
  return fd;
}

export const loginWithGoogle = () => {    
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  window.location.href = `${backendUrl}/auth/google`;
};