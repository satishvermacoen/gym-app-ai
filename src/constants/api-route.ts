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

  },
  search:{
    search: "/search", // use searchApi function from services/search.service.ts
  },
  branchesInfo: {
    list: "/branch",
    register: "/branch/register",
    update: (id: string) => `/branch/${id}`,
    dashboard: (id: string) => `/branch/${id}/dashboard`,
  },
  employee: {
    list: "/employee",
    create: "/employee",
    update: (id: string) => `/employee/${id}`,
    delete: (id: string) => `/employee/${id}`,
  },
  members: {
    // GET -> router.route("/:branchId/").get(getListMember)
    list: (branchId: string) => `/${branchId}/members`,
    
    // POST (multipart) -> router.route("/:branchId/add").post(...addMember)
    create: (branchId: string) => `/members/${branchId}/add`,

    // GET/PATCH (multipart) -> router.route("/:memberId/info").get(...).patch(...updateMember)
    info: (memberId: string) => `/members/${memberId}/info`,
    update: (memberId: string) => `/members/${memberId}/info`,

    // POST -> router.route("/payments/:memberId").post(...membershipPaymentDetails)
    payments: (memberId: string) => `/members/payments/${memberId}`,

    // PATCH -> router.route("/:memberId/toggleMemberStatus").patch(toggleMemberStatus)
    toggleStatus: (memberId: string) => `/members/${memberId}/toggleMemberStatus`,
  },
} as const;
