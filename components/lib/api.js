import axios from "axios";
import { logout } from "./auth.js";

const api = axios.create({
  baseURL: process.env.BASE_URL || "",
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise = null;

const tryRefresh = async () => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = api
      .post("/api/auth/refresh", {}, { withCredentials: true })
      .finally(() => {
        isRefreshing = false;
      });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const original = error.config;

    if (status === 401 && !original._retry) {
      original._retry = true;

      try {
        await tryRefresh();

        return api(original);
      } catch (err) {
        await logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
