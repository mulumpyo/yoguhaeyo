import axios from "axios";

export const getApiUrl = (path = "") => {
  const base =
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${base}${normalizedPath}`;
};

export const apiClient = axios.create({
  timeout: 5000,
});

export const fetchApi = async (path, config = {}) => {
  try {
    const url = getApiUrl(path);

    const response = await apiClient({
      url,
      method: config.method || "get",
      ...config,
    });

    return response.data;
  } catch (err) {
    console.error("API fetch error:", err.message);
    throw err;
  }
};