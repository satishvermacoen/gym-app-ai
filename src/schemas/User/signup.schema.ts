import { z } from "zod";

/** ---------- Form inputs ---------- */
export const SignupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "STAFF"]),
  avatar: z.any().optional(), // FileList | undefined
});
export type SignupInput = z.infer<typeof SignupSchema>;

export const VerifyEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email."),
  otp: z.string().length(6, "OTP must be 6 digits."),
});
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

/** ---------- API responses ---------- */
// Signup -> { email }
export const SignupApiResponseSchema = z.object({
  statusCode: z.number(), // 201
  data: z.object({ email: z.string().email() }),
  message: z.string(),
  success: z.boolean(),
});
export type SignupApiResponse = z.infer<typeof SignupApiResponseSchema>;

// Verify -> { user, accessToken } (ownedBranches may be string[])
const RawVerifiedUserSchema = z.object({
  fullName: z.object({ firstName: z.string(), lastName: z.string() }),
  _id: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  role: z.string(),
  ownedBranches: z.array(z.union([z.string(), z.object({ _id: z.string(), name: z.string().optional() })])),
  password: z.string().optional(),
  isEmailVerified: z.union([z.boolean(), z.string()]),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number().optional(),
});
export type RawVerifiedUser = z.infer<typeof RawVerifiedUserSchema>;

export const VerifyEmailApiResponseSchema = z.object({
  statusCode: z.number(), // 200
  data: z.object({
    user: RawVerifiedUserSchema,
    accessToken: z.string(),
  }),
  message: z.string(),
  success: z.boolean(),
});
export type VerifyEmailApiResponse = z.infer<typeof VerifyEmailApiResponseSchema>;

/** ---------- App normalized types ---------- */
export const OwnedBranchSchema = z.object({ _id: z.string(), name: z.string().optional() });
export type OwnedBranch = z.infer<typeof OwnedBranchSchema>;

export const AppUserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  fullName: z.object({ firstName: z.string(), lastName: z.string() }),
  avatar: z.string().url().optional(),
  role: z.string(),
  ownedBranches: z.array(OwnedBranchSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number().optional(),
  isEmailVerified: z.boolean(),
  loginOTP: z.string().optional(),
  loginOTPExpiry: z.string().optional(),
});
export type AppUser = z.infer<typeof AppUserSchema>;

export const SignupResultSchema = z.object({
  email: z.string().email(),
  message: z.string().optional(),
});
export type SignupResult = z.infer<typeof SignupResultSchema>;

export const VerifyEmailResultSchema = z.object({
  user: AppUserSchema,
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  message: z.string().optional(),
});
export type VerifyEmailResult = z.infer<typeof VerifyEmailResultSchema>;
