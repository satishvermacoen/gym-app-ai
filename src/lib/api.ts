import axios, { AxiosError } from "axios";
import { API_ROUTES } from "@/constants/api-route";
import { getAccessToken, setAccessToken } from "@/lib/auth-token";

if (!process.env.NEXT_PUBLIC_API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Attach Authorization header if we have a token (optional)
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as any;

    // If unauthorized, try refresh once
    if (status === 401 && !original?._retry) {
      original._retry = true;

      if (!refreshing) {
        refreshing = (async () => {
          try {
            const { data } = await api.post(API_ROUTES.auth.refreshToken, null, { withCredentials: true });
            const newToken: string | undefined = data?.data?.accessToken ?? data?.accessToken;
            setAccessToken(newToken ?? null);
            return newToken ?? null;
          } catch {
            setAccessToken(null);
            return null;
          } finally {
            refreshing = null;
          }
        })();
      }

      const newToken = await refreshing;
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }

    const message = (error.response?.data as any)?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);