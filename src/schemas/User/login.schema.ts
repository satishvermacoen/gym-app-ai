import { z } from "zod";


export const OwnedBranchSchema = z.object({
  _id: z.string(),
  name: z.string(),
});
export type OwnedBranch = z.infer<typeof OwnedBranchSchema>;

/** User shape (updated) */
export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  fullName: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  avatar: z.url().optional(),
  role: z.string(),
  ownedBranches: z.array(OwnedBranchSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number().optional(),
  isEmailVerified: z.union([z.boolean(), z.string()]),
  loginOTP: z.string().optional(),
  loginOTPExpiry: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

/** Raw API response from backend */
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

/** Normalized app shape */
export const LoginResultSchema = z.object({
  user: UserSchema.extend({
    // normalize to real boolean in the final object
    isEmailVerified: z.boolean(),
  }),
  accessToken: z.string(),
  refreshToken: z.string(),
  message: z.string().optional(),
});
export type LoginResult = z.infer<typeof LoginResultSchema>;

/** Form input */
export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginInput = z.infer<typeof LoginSchema>;
