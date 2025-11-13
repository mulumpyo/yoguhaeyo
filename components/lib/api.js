import axios from "axios";

const API_URL = "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export const fetchApi = async (path, config = {}) => {
  try {
    const res = await apiClient.get(path, config);
    return res.data;
  } catch (err) {
    console.error("API fetch error:", err.message);
    throw err;
  }
};