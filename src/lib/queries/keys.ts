export const qk = {
  me:       () => ["auth", "me"] as const,
  branches: () => ["branches"] as const,
  branchDashboard: (branchId: string) => ["branchDashboard", branchId] as const,
};