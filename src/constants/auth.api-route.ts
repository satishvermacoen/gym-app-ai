// Centralized API endpoints

export const API_ROUTES = {
  auth: {
    login: "/users/login",
    loginWithOtp: "/users/loginwithotp",
    logout: "/users/logout",
    me: "/users/me",
    signup: "/users/register",
    verifyEmail: "/users/verify-otp", // this is for email verification during signup
    google: "/auth/google",
    forgotPassword: "/users/forgot-password",
    resetPassword: "/users/reset-password",
    refreshToken: "/users/refresh-token",
    sendLoginOtp: "/auth/sendloginotp",                // this is for sending OTP for login
    verifyLoginOtp: "/auth/verifyloginotp" // this is for login with OTP
  },
  infoUpdate:{
    updateInfo: "/users/update-info",
    updatePassword: "/users/change-password",
    updateAvatar: "/users/update-avatar",
    updateCoverImage: "/users/update-coverimage",

  }
} as const;
