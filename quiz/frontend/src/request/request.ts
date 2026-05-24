import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
import { getUser, removeUser } from "@/libs/storage";
import API_VERSION from "./APIVersion";
import { handleApiError } from "./handleError";

declare module "axios" {
  interface AxiosRequestConfig {
    requiresAuth?: boolean;
    __retryCount?: number;
  }
}

const baseURL = "http://localhost:5000" + API_VERSION;

if (!baseURL) {
  throw new Error("Missing VITE_API_BASE_URL in environment variables");
}

const API = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { requiresAuth?: boolean }) => {
    if (config.requiresAuth !== false) {
      const token = getUser();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
);

const MAX_RETRIES = 3;
const RETRY_DELAY = 10000;

API.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const config = error.config;
    if (!config) {
      handleApiError(error);
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      removeUser();
      const navigate = useNavigate();
      navigate("/", { replace: true });
      return Promise.reject(error);
    }
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.message?.toLowerCase().includes("timeout");
    const isNetworkError = !error.response;

    if (isTimeout || isNetworkError) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return API(config);
      }
    }
    handleApiError(error);
    return Promise.reject(error);
  },
);

export default API;
