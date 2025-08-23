import { api } from "@/lib/api";
import { API_ROUTES } from "../../../constants/auth.api-route";
import {
  LoginApiResponseSchema,
  LoginInput,
  LoginResult,
  LoginResultSchema,
  User,
  UserSchema,
} from "../../../schemas/User/login.schema";

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

  const raw = parsed.data;

  // Normalize isEmailVerified -> boolean
  const isEmailVerifiedRaw = raw.data.user.isEmailVerified;
  const isEmailVerifiedNormalized =
    typeof isEmailVerifiedRaw === "string"
      ? isEmailVerifiedRaw.toLowerCase() === "true"
      : Boolean(isEmailVerifiedRaw);

  // Build normalized result
  const normalized = {
    user: {
      ...raw.data.user,
      isEmailVerified: isEmailVerifiedNormalized,
      // ownedBranches already matches {_id, name}[]
    },
    accessToken: raw.data.accessToken,
    refreshToken: raw.data.refreshToken,
    message: raw.message,
  };

  const check = LoginResultSchema.safeParse(normalized);
  if (!check.success) {
    throw new Error(check.error.issues[0]?.message ?? "Invalid normalized data");
  }

  return check.data;
}


export const logout = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};

export async function me(): Promise<User> {
  const { data } = await api.get(API_ROUTES.auth.me);
  return UserSchema.parse(data?.data ?? data);
}