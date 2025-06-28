// src/components/AdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AdminRoute() {
  const { user, ready } = useAuth();

  if (!ready) {
    return <div className="p-4 text-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.rol !== "administrador") {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
}
