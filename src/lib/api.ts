// src/lib/api.ts
import axios from "axios";

if (!process.env.NEXT_PUBLIC_API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL, withCredentials: true });

let refreshing: Promise<string | null> | null = null;

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const { useAuthStore } = require("@/stores/auth.store");
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    if (response?.status === 401 && !config.__isRetry && typeof window !== "undefined") {
      config.__isRetry = true;
      const { useAuthStore } = require("@/stores/auth.store");
      const store = useAuthStore.getState();

      // if you keep refreshToken in cookie, call backend refresh endpoint
      if (!refreshing) {
        refreshing = (async () => {
          try {
            const r = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/refresh`, {}, { withCredentials: true });
            const newAccess = r?.data?.accessToken as string | null;
            if (newAccess) useAuthStore.getState().setAuth({ user: store.user!, accessToken: newAccess, refreshToken: store.refreshToken ?? "" });
            return newAccess ?? null;
          } catch {
            useAuthStore.getState().clearAuth();
            return null;
          } finally {
            refreshing = null;
          }
        })();
      }
      const newToken = await refreshing;
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      }
    }
    const message = error?.response?.data?.message || error?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);
