export type Role = "OWNER" | "ADMIN" | "MANAGER" | "STAFF";

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  avatar?: File | null;
}

export interface VerifyEmailInput { email: string; otp: string; }
export interface LoginInput { email: string; password: string; }

export interface OwnedBranch { _id: string; name?: string; }

export interface User {
  _id: string;
  email: string;
  role: string;
  fullName?: { firstName?: string; lastName?: string };
  avatar?: { url: string } | string | null;
  ownedBranches?: Array<string | OwnedBranch>;
  branches?: Array<string | OwnedBranch>;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}
export interface RegisterResponse { email: string; ttlMs: number; }
export interface VerifyResponse { emailVerified: boolean; }
