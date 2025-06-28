// src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");  // <-- CAMBIADO de email a username
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ username, password: contraseña }); // <-- CAMBIADO email → username
      navigate("/homepage");
    } catch (err: any) {
      setError(err.response?.data?.mensaje || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3e8ff]">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row">
        {/* Imagen lateral */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url('/bg-login.jpg')` }}
        />
        {/* Formulario */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">
            Inicio de sesión
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Bienvenido de vuelta! Por favor ingresa tus credenciales
          </p>

          {error && (
            <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Usuario</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Ej: hayland"
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <input
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                type="password"
                placeholder="Al menos 8 caracteres"
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
