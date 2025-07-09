// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";
import {
  loginWithCredentials,
  getToken,
  getUserInfo,
  logout as keycloakLogout,
} from "../services/auth";

export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  contraseña: string;
  rol: "administrador" | "cosecha" | "contable";
}

interface AuthContextType {
  user: Usuario | null;
  ready: boolean;
  login: (data: { username: string; password: string }) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>; 
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (token && stored) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(JSON.parse(stored));
    }
    setReady(true);
  }, []);

  const login = async ({ username, password }: { username: string; password: string }) => {
  console.log("[Auth] Iniciando login con usuario:", username);
  await loginWithCredentials(username, password);

  const token = getToken();
  const parsed = getUserInfo();

  if (!token || !parsed) {
    console.error("[Auth] Token o datos de usuario no disponibles");
    throw new Error("No se pudo obtener el token");
  }

  const usuario: Usuario = {
    id_usuario: 0,
    nombre: parsed.name || parsed.preferred_username || username,
    email: parsed.email || `${username}@fake.local`,
    rol: parsed.realm_access?.roles?.[0] || "usuario",
  };

  console.log("[Auth] Usuario autenticado:", usuario);

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(usuario));
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
  setUser(usuario);

  // Verificar si necesita 2FA
  try {
    const res = await api.post("/auth/verify-2fa", { username, otp: null });
    const requiere2FA = res.data.requires_2fa;

    console.log("[2FA] Resultado verificación inicial:", requiere2FA);

    console.log("[2FA] Resultado verificación inicial:", requiere2FA);
    if (requiere2FA) {
      localStorage.removeItem("2fa_passed"); // opcional por limpieza
    } else {
      // aún no seteamos nada
    }

  } catch (err) {
    console.error("[2FA] Error al verificar si requiere 2FA", err);
  }
};




const loginWithToken = async (token: string) => {
  localStorage.setItem("token", token);
  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  const parsed = getUserInfo(); // usa el token de localStorage

  if (!parsed) {
    throw new Error("No se pudo extraer la información del usuario");
  }

  const usuario: Usuario = {
    id_usuario: 0,
    nombre: parsed.name || parsed.preferred_username || "usuario",
    email: parsed.email || "correo@fake.com",
    rol: parsed.realm_access?.roles?.[0] || "usuario",
  };

  localStorage.setItem("user", JSON.stringify(usuario));
  setUser(usuario);
};




  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("2fa_passed");
    localStorage.removeItem("pending_2fa_user");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    keycloakLogout();
  };

  const register = async (_data: RegisterData) => {
    throw new Error("El registro se gestiona directamente en Keycloak");
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, loginWithToken, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
