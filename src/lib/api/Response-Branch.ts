import { api } from "@/lib/api";
import { ApiResponse } from "@/utils/ApiResponse";
import { Branch } from "@/lib/types/Branch";
import { AxiosResponse } from "axios";

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

export const getBranchList = (): Promise<AxiosResponse<ApiResponse<Branch[]>>> => {
  return api.get('/branch');
};