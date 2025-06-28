// src/components/CosechaRoute.tsx
import { type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children?: ReactNode;
}

export function CosechaRoute({ children }: Props) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (user.rol !== "administrador" && user.rol !== "cosecha") {
    return <Navigate to="/not-authorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
