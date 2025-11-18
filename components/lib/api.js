import axios from "axios";
import { logout } from "./auth.js";

const api = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const errorMsg = error?.response?.data?.error;

    if (status === 401 && errorMsg === "Invalid refresh token") {
      await logout();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;