import axios, { AxiosInstance, AxiosResponse } from 'axios';

// --- TYPE DEFINITIONS ---
// It's a good practice to define types for your API responses and data models.
// These should ideally match the structure of your Mongoose schemas.

// A generic API response structure from your backend
export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}

// Example type for a new member
export interface NewMemberData {
    personalInfo: {
        firstName: string;
        lastName: string;
        mobileNumberMain: string;
        email?: string;
        // ... other personal info fields
    };
    membershipInfo: {
        membershiptype: 'Basic' | 'Premium' | 'Family';
        duration: 'Monthly' | 'Quarterly' | 'Annually';
        // ... other membership fields
    };
    // ... other top-level objects
}

// Example type for a new employee
export interface NewEmployeeData {
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        mobileNumber: string;
         // ... other personal info fields
    };
    employmentDetails: {
        jobTitle: string;
        role: 'ADMIN' | 'MANAGER' | 'STAFF';
        // ... other employment fields
    };
    password?: string; // Optional password for Admin/Manager roles
     // ... other top-level objects
}

// --- AXIOS INSTANCE SETUP ---

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Necessary for sending cookies
});

// Add a request interceptor to automatically include the auth token
api.interceptors.request.use(
    (config) => {
        // You would typically get the token from localStorage, cookies, or a state management library
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- API SERVICE FUNCTIONS ---

// Branch Endpoints
export const getBranchDashboard = (branchId: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.get(`/branch/${branchId}/dashboard`);
};

export const getFinanceDashboard = (branchId: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.get(`/branch/${branchId}/finance-dashboard`);
};

// Member Endpoints
export const addMember = (branchId: string, memberData: NewMemberData): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post(`/members/${branchId}`, memberData);
};

export const getMembersList = (branchId: string, params: { page?: number; limit?: number; search?: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.get(`/members/branch/${branchId}`, { params });
};

// Employee Endpoints
export const addEmployee = (branchId: string, employeeData: NewEmployeeData): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post(`/employees/${branchId}`, employeeData);
};

export const getEmployeeFinanceDashboard = (branchId: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.get(`/branch/${branchId}/employee-finance`);
};

export const recordSalaryPayment = (employeeId: string, paymentData: { year: number; month: string; paymentAmount: number; paidthrough: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post(`/employees/${employeeId}/record-salary`, paymentData);
};

// Auth Endpoints
export const loginUser = (credentials: {email: string, password?: string}): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/login', credentials);
};

export const loginWithGoogle = (): void => {
    // This isn't an API call from the client, but a redirect to the backend auth route
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    window.location.href = `${backendUrl}/users/google`;
};

export default api;
