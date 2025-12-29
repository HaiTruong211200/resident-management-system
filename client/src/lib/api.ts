import axios from "axios";

const VITE_SERVER_URL = "http://localhost:4000";

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
