import { api } from "@/lib/api";
import { MemberListResponse } from "@/lib/types/Member";
import { AxiosResponse } from "axios";


export const getMembersList = (
  branchId: string,
  params: { page?: number; limit?: number }
): Promise<AxiosResponse<MemberListResponse>> => {
  // Ensure the API instance uses the latest token for every request
  api.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
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

  return api.get(`/members/branch/${branchId}`, { params });
};
