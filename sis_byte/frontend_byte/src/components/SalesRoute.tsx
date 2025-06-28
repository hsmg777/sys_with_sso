// src/components/SalesRoute.tsx
import { type ReactNode }     from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth }       from "../contexts/AuthContext";

export function SalesRoute({ children }: { children?: ReactNode }) {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return null;          
  if (!user)  return <Navigate to="/" replace state={{ from: loc }} />;
  if (user.rol !== "contable" && user.rol !== "administrador") {
    return <Navigate to="/not-authorized" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
}
