import axios, { AxiosInstance, AxiosResponse } from 'axios';

// --- TYPE DEFINITIONS ---
// These interfaces should mirror your backend's Mongoose schemas for full type safety.

// A generic type for the standard API response from your backend
export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}

// Data model interfaces (examples, expand as needed)
export interface User {
    _id: string;
    username: string;
    email: string;
    fullName: {
        firstName: string;
        lastName: string;
    };
    role: "OWNER" | "ADMIN" | "MANAGER" | "STAFF";
    avatar: {
        public_id: string;
        url: string;
    }
    ownedBranches: string[];

    // ... other user fields
}

export interface Branch {
    _id: string;
    name: string;
    owner: string;
    location: {
        adreessline1: string;
        addressline2: string;
        city: string;
        state: string;
        pinCode: string;
        country: string;
    };
    contact: {
        mobile: string;
        phone: string;
        email: string;
    };
    operatingHours: [
        {
            day: string;
            open: string;
            close: string;
            isOpen: boolean;
            _id: string;
        }
    ];
    staff: [];
    members: [];
    
}

export interface Member {
     _id: string;
    // ... add other member fields
}

export interface Employee {
     _id: string;
    // ... add other employee fields
}


// --- AXIOS INSTANCE SETUP ---

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: false, // Important for sending cookies (like refresh tokens)
});

// Interceptor to automatically attach the JWT access token to requests
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// --- API SERVICE FUNCTIONS ---

// Auth Endpoints (from user.routes.js & auth.routes.js)
export const registerUser = (formData: FormData): Promise<AxiosResponse<ApiResponse<User>>> => {
    return api.post('/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const verifyOtp = (data: { email: string; otp: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/users/verify-otp', data);
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

export const loginWithGoogle = (): void => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    window.location.href = `${backendUrl}/auth/google`; // Corresponds to /api/v1/auth/google
};

/**
 * Fetches the currently logged-in user's information.
 * @returns {Promise<AxiosResponse<ApiResponse<User>>>} The current user's data.
 */
export const getCurrentUser = (): Promise<AxiosResponse<ApiResponse<User>>> => {
    return api.get('/users');
};

// Branch Endpoints (from branch.routes.js)
export const getBranchDashboard = (branchId: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.get(`/branch/${branchId}/dashboard`);
};

export const getBranchList = (): Promise<AxiosResponse<ApiResponse<Branch[]>>> => {
    return api.get('/branch');
};

// Member Endpoints (from member.routes.js)
export const addMember = (branchId: string, memberData: any): Promise<AxiosResponse<ApiResponse<Member>>> => {
    return api.post(`/members/${branchId}`, memberData);
};

export const getMembersList = (branchId: string, params: { page?: number; limit?: number; search?: string; status?: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.get(`/members/branch/${branchId}`, { params });
};

// Employee Endpoints (from employees.routes.js)
export const addEmployee = (branchId: string, employeeData: any): Promise<AxiosResponse<ApiResponse<Employee>>> => {
    return api.post(`/employees/${branchId}`, employeeData);
};

export const getEmployeeList = (branchId: string, params: { page?: number; limit?: number; search?: string; status?: string }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.get(`/employees/branch/${branchId}`, { params });
};


// Finance Endpoints (from finance.routes.js)
export const getFinanceDashboard = (branchId: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.get(`/finance/${branchId}/finance-dashboard`);
};

export const getEmployeeFinanceDashboard = (branchId: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.get(`/finance/${branchId}/employee-finance`);
};


export default api;
