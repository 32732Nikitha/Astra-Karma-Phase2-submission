import axios from "axios";

export function getApiBase(): string {
  const env = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (env) return env;
  if (typeof window !== "undefined") {
    const port = window.location.port;
    if (port === "3000" || port === "3001") {
      return `${window.location.origin}/api/v1`;
    }
  }
  return (
    process.env.INTERNAL_API_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:8000/api/v1"
  );
}

const api = axios.create({
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  config.baseURL = getApiBase();
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("bhima_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data.data ?? response.data,
  (error) => Promise.reject(error)
);

export default api;

export const rawApi = axios.create({
  timeout: 15000,
});

rawApi.interceptors.request.use((config) => {
  config.baseURL = getApiBase();
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("bhima_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
