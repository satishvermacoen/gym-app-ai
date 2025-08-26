import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/auth.api-route";

export interface SendLoginOtpInput { email: string; }
export interface SendOtpResponse { email: string; ttlMs: number; }
export interface VerifyLoginOtpInput { email: string; otp: string; }

export async function sendLoginOtp(payload: SendLoginOtpInput): Promise<SendOtpResponse> {
  const { data } = await api.post(API_ROUTES.auth.sendLoginOtp, payload);
  const d = data?.data ?? data;
  return { email: String(d.email), ttlMs: Number(d.ttlMs ?? 600_000) };
}

export async function verifyLoginOtp(payload: VerifyLoginOtpInput): Promise<{ ok: boolean }> {
  const { data } = await api.post(API_ROUTES.auth.verifyLoginOtp, payload);
  const d = data?.data ?? data;
  return { ok: Boolean(d.emailVerified) };
}
