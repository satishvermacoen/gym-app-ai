import axios from "axios";

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

// Attach token on client only (Zustand persists in localStorage)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // avoid ESM import on server
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useAuthStore } = require("../stores/auth.store") as typeof import("../stores/auth.store");
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);
