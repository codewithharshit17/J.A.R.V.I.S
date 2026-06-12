import axios, { AxiosError, isAxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
      timestamp: new Date().toISOString(),
    });
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status}`, {
      url: response.config.url,
      timestamp: new Date().toISOString(),
    });
    return response;
  },
  (error: unknown) => {
    if (isAxiosError(error)) {
      const status = error.response?.status || "unknown";
      const url = error.config?.url || "unknown";
      
      console.error("[API] Response error:", {
        status,
        url,
        message: error.message,
        data: error.response?.data,
        timestamp: new Date().toISOString(),
      });

      // Handle common errors
      if (error.code === "ECONNABORTED") {
        console.error("[API] Request timeout - backend may be unavailable");
      } else if (error.code === "ECONNREFUSED") {
        console.error(
          `[API] Connection refused - check if backend is running at ${API_BASE_URL}`
        );
      }
    } else {
      console.error("[API] Unknown error:", error);
    }
    
    return Promise.reject(error);
  }
);

export default api;