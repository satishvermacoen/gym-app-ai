// src/lib/api/employees.ts

import { get, post, patch } from '@/utils/api-helpers';

export const getEmployees = (branchId: string, params?: any) => get(`/employees/${branchId}`, { params });
export const addEmployee = (branchId: string, employeeData: any) => post(`/employees/${branchId}/add`, employeeData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateEmployee = (employeeId: string, updates: any) => patch(`/employees/${employeeId}/info`, updates, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getEmployeeDashboard = (employeeId: string) => get(`/employees/${employeeId}/info`);
export const recordSalary = (employeeId: string, salaryData: any) => post(`/employees/${employeeId}/record-salary`, salaryData);
export const toggleEmployeeStatus = (employeeId: string) => patch(`/employees/${employeeId}/togglememberstatus`, {});