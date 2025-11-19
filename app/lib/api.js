import axios from "axios";
import { logout } from "./auth.js";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.BASE_URL || "",
  withCredentials: true,
});

let refreshTokenPromise = null;
let toastLock = false;

const showToastOnce = (msg) => {
  if (toastLock) return;
  toastLock = true;
  toast.error(msg);

  setTimeout(() => {
    toastLock = false;
  }, 1000);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const isRefreshRequest = originalRequest.url.includes("/auth/refresh");

    // 403
    if (status === 403) {
      showToastOnce("권한이 없습니다");
      return Promise.reject(error);
    }

    // 500
    if (status === 500) {
      showToastOnce("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요");
      return Promise.reject(error);
    }

    // 401 (refresh)
    if (status === 401 && !originalRequest._retry && !isRefreshRequest) {
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