// src/lib/api/branch.ts

import { get, post, patch } from '@/utils/api-helpers';

export const getBranches = () => get('/branch');
export const registerBranch = (branchData: any) => post('/branch/register', branchData);
export const updateBranch = (branchId: string, updates: any) => patch(`/branch/${branchId}`, updates);
export const getBranchDashboard = (branchId: string) => get(`/branch/${branchId}/dashboard`);