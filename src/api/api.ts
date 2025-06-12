import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Request error: " + (error.message || "Unknown error"));
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await api.post("/auth/refresh", {
          token: refreshToken,
        });

        localStorage.setItem("accessToken", response.data.accessToken);
        const newConfig = {
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${response.data.accessToken}`,
          },
        };
        return api(newConfig);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        toast.error("Session expired. Please log in again.");
        return Promise.reject(refreshError);
      }
    }

    toast.error(
      error.response?.data?.message || error.message || "Unknown error"
    );
    return Promise.reject(error);
  }
);

export default api;
