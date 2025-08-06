// src/lib/api/members.ts

import { get, post, patch } from '@/utils/api-helpers';

export const getMembers = (branchId: string, params?: any) => get(`/members/${branchId}`, { params });
export const addMember = (branchId: string, memberData: any) => post(`/members/${branchId}/add`, memberData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateMember = (memberId: string, updates: any) => patch(`/members/${memberId}/info`, updates, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMemberDashboard = (memberId: string) => get(`/members/${memberId}/info`);
export const recordPayment = (memberId: string, paymentData: any) => post(`/members/payments/${memberId}`, paymentData);
export const toggleMemberStatus = (memberId: string) => patch(`/members/${memberId}/toggleMemberStatus`, {});