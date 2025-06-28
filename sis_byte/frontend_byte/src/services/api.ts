import axios from "axios";
import { getToken, refreshAccessToken } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token y renovar si está por expirar
api.interceptors.request.use(async (config) => {
  const token = getToken();
  const expiresAt = localStorage.getItem("token_expires_at");

  // Verificar expiración si existe
  if (expiresAt && Date.now() > parseInt(expiresAt) - 60000) {
    try {
      await refreshAccessToken(); // intenta renovar antes de expirar (1 min)
    } catch (err) {
      console.warn("⚠️ No se pudo refrescar token:", err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expires_at");
    }
  }

  const finalToken = getToken();
  if (finalToken) {
    config.headers.Authorization = `Bearer ${finalToken}`;
  }

  return config;
});

export default api;
