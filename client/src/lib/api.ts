import axios from "axios";

const VITE_SERVER_URL = (import.meta as any).env?.VITE_SERVER_URL as
  | string
  | undefined;

const normalizeBase = (url: string) => url.replace(/\/+$/, "");

// Default: same-origin + Vite proxy (avoids CORS in dev)
// Override by setting VITE_SERVER_URL (e.g. https://api.example.com)
const API_BASE_URL = VITE_SERVER_URL
  ? `${normalizeBase(VITE_SERVER_URL)}/api`
  : "/api";

const api = axios.create({
  baseURL: VITE_SERVER_URL + "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor (bắt lỗi chung)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Có lỗi xảy ra";
    return Promise.reject(new Error(message));
  }
);

export default api;
