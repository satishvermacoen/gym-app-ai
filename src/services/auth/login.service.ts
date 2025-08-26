import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/auth.api-route";
import type { LoginInput, LoginResponse, User } from "@/types/auth";
import { isAxiosError } from "axios";

export async function login(payload: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post(API_ROUTES.auth.login, payload);
  const d = data?.data ?? data;
  const u = d.user ?? d?.data?.user ?? d; // tolerant unwrap

  return {
    user: {
      ...u,
      isEmailVerified: typeof u?.isEmailVerified === "string"
        ? u.isEmailVerified.toLowerCase() === "true"
        : !!u?.isEmailVerified,
    },
    accessToken: d.accessToken,
    refreshToken: d.refreshToken,
  };
}

export async function logout() {
  await api.post(API_ROUTES.auth.logout);
}

export async function me(): Promise<User | null> {
  try {
    const { data } = await api.get(API_ROUTES.auth.me, { withCredentials: true });
    const root = data?.data ?? data;
    const u = root?.user ?? root?.currentUser ?? root;
    return u ?? null;
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 401) return null;
    throw e;
  }
}
