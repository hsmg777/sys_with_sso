// ✅ src/components/TwoFactorStep.tsx
import { useState, useEffect } from "react";
import api from "../services/api";

export interface TwoFactorStepProps {
  username: string;
  onSuccess: () => void;
}

export default function TwoFactorStep({ username, onSuccess }: TwoFactorStepProps) {
  const [qr, setQr] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("[2FA] Solicitando QR para usuario:", username);
    api
      .get(`/auth/setup-2fa/${username}`)
      .then((res) => {
        const raw = res.data.qr_code;
        const final = raw.startsWith("data:image") ? raw : `data:image/png;base64,${raw}`;
        setQr(final);
        console.log("[2FA] QR cargado");
      })
      .catch((err) => {
        console.error("[2FA] Error al cargar QR:", err);
        setError("No se pudo cargar el QR de 2FA.");
      });
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[2FA] Verificando OTP:", otp);

    try {
      const res = await api.post("/auth/verify-2fa", { username, otp });
      console.log("[2FA] Verificación exitosa:", res.data);

      localStorage.setItem("2fa_passed", "true");
      onSuccess();
    } catch (err: any) {
      console.error("[2FA] Código incorrecto:", err.response?.data || err.message);
      setError("Código inválido. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md">
        <h2 className="text-xl font-semibold mb-4">Verificación 2FA</h2>
        {qr && <img src={qr} alt="QR 2FA" className="mx-auto mb-4 w-48" />}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Código del Authenticator"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded w-full">
            Verificar
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
