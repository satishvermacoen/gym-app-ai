import { z } from "zod";

/** ---------- User shape from your payload ---------- */
export const UserSchema = z.object({
  fullName: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  _id: z.string(),
  email: z.string().email(),
  avatar: z.string().url().optional(),
  role: z.string(),
  ownedBranches: z.array(z.string()),
  createdAt: z.string(), // ISO
  updatedAt: z.string(), // ISO
  __v: z.number().optional(),
  isEmailVerified: z.boolean(),
  loginOTP: z.string().optional(),
  loginOTPExpiry: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

/** ---------- Login API response from your payload ---------- */
export const LoginApiResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    user: UserSchema,
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  message: z.string(),
  success: z.boolean(),
});
export type LoginApiResponse = z.infer<typeof LoginApiResponseSchema>;

/** ---------- Normalized app shape for convenience ---------- */
export const LoginResultSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  message: z.string().optional(),
});
export type LoginResult = z.infer<typeof LoginResultSchema>;

/** ---------- Input (form) ---------- */
export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginInput = z.infer<typeof LoginSchema>;
