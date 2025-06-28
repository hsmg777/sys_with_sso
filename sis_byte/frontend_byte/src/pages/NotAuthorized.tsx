// src/pages/NotAuthorized.tsx
import { Link } from "react-router-dom";

export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">403 – No autorizado</h1>
      <p className="mb-6">No tienes permiso para acceder a esta sección.</p>
      <Link to="/" className="text-purple-600 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
