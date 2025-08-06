// src/lib/api/auth.ts

import { post } from '@/utils/api-helpers';

export const loginUser = (credentials: any) => post('/users/login', credentials);
export const registerUser = (userData: any) => post('/users/register', userData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const forgotPassword = (email: string) => post('/users/forgot-password', { email });
export const resetPassword = (data: any) => post('/users/reset-password', data);
export const verifyOtp = (data: any) => post('/users/verify-otp', data);
export const resendOtp = (email: string) => post('/users/resend-otp', { email });