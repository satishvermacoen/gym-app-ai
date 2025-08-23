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
  }
} as const;
