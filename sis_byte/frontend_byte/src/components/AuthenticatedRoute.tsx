// src/components/AuthenticatedRoute.tsx
import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children?: ReactNode;
}

/**
 * Ruta que permite el acceso a cualquier usuario autenticado.
 * Si la sesión aún no se ha hidratado (ready = false), devuelve null (o un spinner).
 * Si no hay usuario, redirige al login.
 */
export function AuthenticatedRoute({ children }: Props) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return null; 
  }

 
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }


  return children ? <>{children}</> : <Outlet />;
}
