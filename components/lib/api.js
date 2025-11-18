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

    if (status === 401) {
      await logout();
    }

    return Promise.reject(error);
  }
);


export default api;