import axios from "axios";

// API URL 생성
export const getApiUrl = (path = "") => {
  const base = "http://localhost:3000";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

// Axios 인스턴스
export const apiClient = axios.create({
  timeout: 5000,
});

/**
 * SSR 페이지를 위한 API 호출
 * @param {string} path - API 경로
 * @param {object} [config={}] - GET || POST || PUT || DELETE ( 생략 시 GET )
 * @returns {Promise<any|null>} API 응답 데이터 ( 오류 시 null )
 */
export const fetchApi = async (path, config = {}) => {
  try {
    const url = getApiUrl(path);
    const response = await apiClient({
      url,
      method: config.method || "get",
      validateStatus: () => true,
      ...config,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.warn(`Non-200 response for ${url}:`, response.status);
      return null;
    }
  } catch (err) {
    console.error("API fetch error:", err.message);
    return null;
  }
};
