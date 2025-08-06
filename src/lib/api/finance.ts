// src/lib/api/finance.ts

import { get } from '@/utils/api-helpers';

export const getBranchFinanceDashboard = (branchId: string) => get(`/finance/${branchId}/finance-branch`);
export const getBranchFinanceSummary = (branchId: string) => get(`/finance/${branchId}/finance-branch-summary`);
export const getAllFinanceData = (branchId: string) => get(`/finance/${branchId}/finance-branch-all-data`);
export const getEmployeeFinanceDashboard = (branchId: string) => get(`/finance/${branchId}/employee-finance`);