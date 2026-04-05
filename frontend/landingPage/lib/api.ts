import axios from "axios";

// 🔥 THE HACKATHON FIX: Direct Render Link
export function getApiBase(): string {
  return "https://astra-karma-phase2-submission.onrender.com/api/v1";
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
