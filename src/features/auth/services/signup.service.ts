import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/auth.api-route";
import {
  SignupApiResponseSchema, SignupInput, SignupResultSchema, type SignupResult,
  VerifyEmailApiResponseSchema, VerifyEmailInput, VerifyEmailResultSchema, type VerifyEmailResult
} from "@/schemas/User/signup.schema";
import { toast } from "sonner";

export async function registerUser(form: FormData): Promise<SignupResult> {
  const { data } = await api.post(API_ROUTES.auth.signup, form);
  const parsed = SignupApiResponseSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid signup response");
  const normalized = { email: parsed.data.data.email, message: parsed.data.message };
  const check = SignupResultSchema.safeParse(normalized);
  if (!check.success) throw new Error(check.error.issues[0]?.message ?? "Invalid normalized signup");
  return check.data;
}

export async function verifyEmailOtp(payload: VerifyEmailInput): Promise<VerifyEmailResult> {
  const { data } = await api.post(API_ROUTES.auth.verifyEmail, payload);
  const parsed = VerifyEmailApiResponseSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid verify response");

  const raw = parsed.data.data;

  const isEmailVerified =
    typeof raw.user.isEmailVerified === "string"
      ? raw.user.isEmailVerified.toLowerCase() === "true"
      : Boolean(raw.user.isEmailVerified);

  const ownedBranches = raw.user.ownedBranches.map((b) =>
    typeof b === "string" ? { _id: b } : { _id: b._id, name: b.name }
  );

  const normalized = {
    user: {
      _id: raw.user._id,
      email: raw.user.email,
      fullName: raw.user.fullName,
      avatar: raw.user.avatar || undefined,
      role: raw.user.role,
      ownedBranches,
      createdAt: raw.user.createdAt,
      updatedAt: raw.user.updatedAt,
      __v: raw.user.__v,
      isEmailVerified,
      loginOTP: undefined,
      loginOTPExpiry: undefined,
    },
    accessToken: raw.accessToken,
    message: parsed.data.message,
  };

  const check = VerifyEmailResultSchema.safeParse(normalized);
  if (!check.success) throw new Error(check.error.issues[0]?.message ?? "Invalid normalized verify");
  return check.data;
}

export const loginWithGoogle = () => {
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL
    window.location.href = `${backendUrl}/auth/google`;

};