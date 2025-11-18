import axios from "axios";
import { logout } from "./auth.js";

const api = axios.create({
  baseURL: process.env.BASE_URL || "",
  withCredentials: true,
});

let refreshTokenPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = api
          .post("/api/auth/refresh", {}, { withCredentials: true })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      try {
        await refreshTokenPromise;

        return api(originalRequest);
      } catch (refreshError) {

        await logout();

        return new Promise(() => {});
      }
    }

    return Promise.reject(error);
  }
);

export default api;
