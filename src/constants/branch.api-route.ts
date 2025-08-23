// Centralized API endpoints

export const API_ROUTES = {
  auth: {
    login: "/users/log",
    logout: "/users/logout",
    me: "/users/me",
    signup: "/users/register",
    verifyEmail: "/users/verify-otp",
    loginOtp: "/users/login-otp-verfication",
    google: "/auth/google",
  },
  members: {
    list: "/members",
    create: "/members",
    update: (id: string) => `/members/${id}`,
    delete: (id: string) => `/members/${id}`,
  },
  branches: {
    list: "/branches",
    detail: (id: string) => `/branches/${id}`,
  },
  // add more modules here...
} as const;
