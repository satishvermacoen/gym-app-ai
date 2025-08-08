
import { ApiResponse } from "@/utils/ApiResponse";
import { AxiosResponse } from "axios";
import { User } from "../types/User";
import { api } from "../api";





// Auth Endpoints (from user.routes.js & auth.routes.js)
export const registerUser = (formData: FormData): Promise<AxiosResponse<ApiResponse<User>>> => {
    return api.post('/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const verifyOtp = (data: { email: string; otp: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/verify-otp', data);
};
export const verifyLoginOtp = (data: { email: string; otp: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/login-otp-verfication', data);
};

export const loginUser = (credentials: { email?: string; username?: string; password?: string }): Promise<AxiosResponse<ApiResponse<{ user: User; accessToken: string }>>> => {
    return api.post('/users/login', credentials);
};

export const forgotPassword = (data: { email: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/forgot-password', data);
};

export const resetPassword = (data: { email: string; otp: string; newPassword?: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/reset-password', data);
};