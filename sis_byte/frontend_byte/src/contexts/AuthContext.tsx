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
    await loginWithCredentials(username, password);

    const token = getToken();
    const parsed = getUserInfo();

    if (!token || !parsed) throw new Error("No se pudo obtener el token");

    const usuario: Usuario = {
      id_usuario: 0,
      nombre: parsed.name || parsed.preferred_username || username,
      email: parsed.email || `${username}@fake.local`,
      rol: parsed.realm_access?.roles?.[0] || "usuario", // puedes personalizar esto
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(usuario));
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(usuario);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    keycloakLogout();
  };

  const register = async (_data: RegisterData) => {
    throw new Error("El registro se gestiona directamente en Keycloak");
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
