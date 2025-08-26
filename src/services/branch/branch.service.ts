// src/services/branch.service.ts
// Standardized service layer for branches & dashboard
// - Always returns BranchListItem[] for fetchBranches
// - Always returns a single BranchDashboardData for fetchDashboard
// - Normalizes common API shapes and throws clear errors for React Query

import { AxiosError } from "axios";
import { API_ROUTES } from "@/constants/branch.api-route";
import { api } from "@/lib/api";
import type { BranchDashboardData, BranchListItem } from "@/types/branch";

/* ---------------------------------- Types --------------------------------- */

type BranchListResponse =
  | BranchListItem[]                               // e.g. [ { _id, name }, ... ]
  | { branches: BranchListItem[] }                 // e.g. { branches: [ ... ] }
  | { data: BranchListItem[] };                    // sometimes wrapped as { data: [...] }

type DashboardResponse =
  | BranchDashboardData                            // e.g. { ...dashboard fields }
  | { dashboard: BranchDashboardData }             // e.g. { dashboard: { ... } }
  | { data: BranchDashboardData };

/* ------------------------------- Normalizers ------------------------------- */

function normalizeBranches(resp: BranchListResponse): BranchListItem[] {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray((resp as any).branches)) return (resp as any).branches;
  if (resp && Array.isArray((resp as any).data)) return (resp as any).data;
  // Keep UI stable, but you can also choose to throw instead:
  return [];
}

function normalizeDashboard(resp: DashboardResponse): BranchDashboardData {
  if (resp && (resp as any).dashboard) return (resp as any).dashboard as BranchDashboardData;
  if (resp && (resp as any).data) return (resp as any).data as BranchDashboardData;
  return resp as BranchDashboardData;
}

/* ------------------------------- Error helper ------------------------------ */

function extractErrorMessage(err: unknown): string {
  const ax = err as AxiosError<any>;
  return (
    ax?.response?.data?.message ||
    ax?.message ||
    (err instanceof Error ? err.message : "Request failed")
  );
}

/* --------------------------------- Services -------------------------------- */

/**
 * Fetch the list of branches.
 * @returns BranchListItem[] (never a wrapped object)
 */
export async function fetchBranches(): Promise<BranchListItem[]> {
  try {
    const { data } = await api.get<BranchListResponse>(API_ROUTES.branchesInfo.list);
    return normalizeBranches(data);
  } catch (err) {
    const msg = extractErrorMessage(err);
    console.error("fetchBranches error:", err);
    throw new Error(msg || "Failed to fetch branches");
  }
}

/**
 * Fetch dashboard summary for a given branch.
 * @param branchId Branch _id (required)
 * @returns BranchDashboardData (single summary object)
 */
export async function fetchDashboard(branchId: string): Promise<BranchDashboardData> {
  if (!branchId) throw new Error("branchId is required");
  try {
    const { data } = await api.get<DashboardResponse>(API_ROUTES.branchesInfo.dashboard(branchId));
    return normalizeDashboard(data);
  } catch (err) {
    const msg = extractErrorMessage(err);
    console.error("fetchDashboard error:", err);
    throw new Error(msg || "Failed to fetch dashboard");
  }
}
