// /features/auth/services/auth.service.ts
import api from "@/lib/api";

/**
 * EDIT THESE PATHS to match your backend.
 * Examples shown are common:
 *  - login:         POST /auth/login
 *  - register:      POST /auth/register
 *  - verify-otp:    POST /auth/verify-otp
 *  - me:            GET  /auth/me  (or /users/me)
 *  - logout:        POST /auth/logout
 *  - refresh:       POST /auth/refresh-token
 *  - google:        GET  /auth/google  (redirect entry)
 */
const AUTH_ROUTES = {
  login: "/users/login",
  register: "/users/register",
  verifyOtp: "/users/verify-otp",
  me: "/users",
  logout: "/users/logout",
  refresh: "/users/refresh-token",
  google: "/auth/google",
};

/* =========================
   Types (adjust as needed)
   ========================= */
import type { User } from "../types/User";
// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string;
//   role?: "OWNER" | "ADMIN" | "MANAGER" | "STAFF" | string;
//   branches?: Array<{ id: string; name: string }>;
//   // ...extend to match your API
// };

export type LoginDto = { email: string; password: string };
export type SignupDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "STAFF";
  avatar?: File | null; // optional
};
export type VerifyOtpDto = { email: string; otp: string } | { userId: string; otp: string };

export type AuthResult = {
  message?: string;
  user?: User;
  otpRequired?: boolean;
  accessToken?: string;
  refreshToken?: string;
  raw?: any; // original backend payload (for debugging if needed)
};

/* ======================================
   Helpers to normalize backend responses
   ====================================== */
function pickUser(obj: any): User | undefined {
  if (!obj) return undefined;
  // common places where user might be returned
  return (
    obj.user ??
    obj.data?.user ??
    obj.data?.data?.user ??
    obj.data?.userInfo ??
    obj.profile ??
    undefined
  );
}

function pickMessage(obj: any): string | undefined {
  return obj?.message ?? obj?.data?.message ?? obj?.msg ?? undefined;
}

function normalizeAuthResult(data: any): AuthResult {
  const user = pickUser(data);
  const message = pickMessage(data);
  const accessToken =
    data?.accessToken ?? data?.data?.accessToken ?? data?.tokens?.accessToken;
  const refreshToken =
    data?.refreshToken ?? data?.data?.refreshToken ?? data?.tokens?.refreshToken;

  // Heuristics for OTP requirement (tweak if your API returns e.g. {statusCode: 202})
  const otpRequired =
    data?.otpRequired === true ||
    data?.data?.otpRequired === true ||
    data?.statusCode === 202 ||
    data?.code === "OTP_REQUIRED";

  return {
    message,
    user,
    otpRequired,
    accessToken,
    refreshToken,
    raw: data,
  };
}

/* =========================
   Auth API (pure services)
   ========================= */

/** Email/password login */
export async function login(payload: LoginDto): Promise<AuthResult> {
  const { data } = await api.post(AUTH_ROUTES.login, payload, {
    withCredentials: true,
  });
  return normalizeAuthResult(data);
}

/** Register (multipart if avatar provided) */
export async function registerUser(formDataOrValues: FormData | SignupDto): Promise<AuthResult> {
  let body: FormData | SignupDto = formDataOrValues;

  // If a plain object was passed, convert to FormData only if there's an avatar
  if (!(formDataOrValues instanceof FormData)) {
    const v = formDataOrValues as SignupDto;
    if (v.avatar) {
      const fd = new FormData();
      fd.append("firstName", v.firstName);
      fd.append("lastName", v.lastName);
      fd.append("email", v.email);
      fd.append("password", v.password);
      fd.append("role", v.role);
      if (v.avatar) fd.append("avatar", v.avatar);
      body = fd;
    }
  }

  const isForm = body instanceof FormData;
  const { data } = await api.post(AUTH_ROUTES.register, body, {
    withCredentials: true,
    headers: isForm ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return normalizeAuthResult(data);
}

/** Verify OTP (email+otp or userId+otp depending on your backend) */
export async function verifyOtp(payload: VerifyOtpDto): Promise<AuthResult> {
  const { data } = await api.post(AUTH_ROUTES.verifyOtp, payload, {
    withCredentials: true, // let server set httpOnly cookies after verify
  });
  return normalizeAuthResult(data);
}

/** Current user (session via cookie or bearer) */
export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get(AUTH_ROUTES.me, { withCredentials: true });
  // Often /me returns user directly or nested
  return pickUser(data) ?? (data as User);
}

/** Logout (server clears cookie/session) */
export async function logout(): Promise<void> {
  await api.post(AUTH_ROUTES.logout, null, { withCredentials: true });
}

/** Refresh access token (only if your app uses manual tokens; cookies often make this unnecessary) */
export async function refreshAccessToken(
  payload?: { refreshToken?: string }
): Promise<{ accessToken: string }> {
  const { data } = await api.post(AUTH_ROUTES.refresh, payload ?? {}, {
    withCredentials: true,
  });
  const token =
    data?.accessToken ?? data?.data?.accessToken ?? data?.token ?? undefined;
  if (!token) throw new Error("No accessToken in refresh response");
  return { accessToken: token };
}

/* =========================
   Google OAuth helpers
   ========================= */

/** Build the backend OAuth entry URL */
export function getGoogleLoginUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";
  return `${base}${AUTH_ROUTES.google}`;
}

/** Trigger redirect to Google OAuth (call from a button handler in the UI) */
export function loginWithGoogle(): void {
  if (typeof window !== "undefined") {
    window.location.href = getGoogleLoginUrl();
  }
}
