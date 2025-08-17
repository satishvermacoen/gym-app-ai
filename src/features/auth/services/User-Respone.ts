
import { ApiResponse } from "@/utils/ApiResponse";
import { AxiosResponse } from "axios";
import { User } from "../types/User";
import  api  from "../../../lib/api";

// Auth Endpoints (from user.routes.js & auth.routes.js)
export const registerUser = (formData: FormData): Promise<AxiosResponse<ApiResponse<User>>> => {
    return api.post('/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const verifyOtp = (data: { email: string; otp: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/verify-otp', data);
};
export const verifyLoginOtp = (data: { email: string; otp: string; }, p0: { withCredentials: boolean; },): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/login-otp-verfication', data, p0);
};

export const loginUser = (credentials: { email?: string; username?: string; password?: string }, p0: { withCredentials: boolean; }): Promise<AxiosResponse<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>> => {
    return api.post('/users/login', credentials, p0);
};

export const forgotPassword = (data: { email: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/forgot-password', data);
};

export const resetPassword = (data: { email: string; otp: string; newPassword?: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/reset-password', data);
};

export const logOut = (data:any): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/logout', data);
};

export const refreshAccessToken = (data:any): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/refresh-token', data);
};


export const loginWithGoogle = ():any => {
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL
    window.location.href = `${backendUrl}/auth/google`;

};

export const getCurrentUser = ():any => {
    return api.get('/users');
};
