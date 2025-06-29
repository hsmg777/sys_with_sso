import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TwoFactorStep from "../components/TwoFactorStep"; 

export default function Login() {
  
  const [username, setUsername] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"login" | "2fa">("login");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handle2FASuccess = () => {
    localStorage.setItem("2fa_passed", "true");
    console.log("[Login] 2FA verificado, redirigiendo a homepage...");
    navigate("/homepage");
  };


  if (step === "2fa") {
    return <TwoFactorStep username={username} onSuccess={handle2FASuccess} />;
  }


  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    console.log("[Login] Intentando login para:", username);
    await login({ username, password: contraseña });

    const passed2FA = localStorage.getItem("2fa_passed") === "true";
    console.log("[Login] ¿Ya pasó 2FA?", passed2FA);

    if (passed2FA) {
      console.log("[Login] Redirigiendo a homepage...");
      navigate("/homepage");
    } else {
      localStorage.setItem("pending_2fa_user", username);
      console.log("[Login] Redirigiendo a paso 2FA...");
      setStep("2fa");
    }
  } catch (err: any) {
    console.error("[Login] Error en login:", err);
    setError(err.response?.data?.mensaje || err.message);
  }
};


  // ✅ Paso original: formulario de login
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
