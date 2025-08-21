import { api } from "../lib/api";
import { API_ROUTES } from "../constants/api-routes";
import {
  LoginApiResponseSchema,
  LoginInput,
  LoginResult,
  LoginResultSchema,
} from "../schemas/auth.schema";

export async function login(payload: LoginInput): Promise<LoginResult> {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Invalid input: expected object");
  }

  const { data } = await api.post(API_ROUTES.auth.login, payload);

  // Validate raw server response
  const parsed = LoginApiResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid login response");
  }

  // Normalize to a simpler shape for the app
  const normalized = {
    user: parsed.data.data.user,
    accessToken: parsed.data.data.accessToken,
    refreshToken: parsed.data.data.refreshToken,
    message: parsed.data.message,
  };

  const check = LoginResultSchema.safeParse(normalized);
  if (!check.success) {
    throw new Error(check.error.issues[0]?.message ?? "Invalid normalized data");
  }

  return check.data;
}
