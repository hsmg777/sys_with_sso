import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      const fetchToken = async () => {
        try {
          const res = await fetch("http://localhost:8080/realms/MultiAppRealm/protocol/openid-connect/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: "frontend-byte-client",
              redirect_uri: "http://localhost:5173/login/callback",
              code,
              // Si tu cliente tiene client_secret:
              // client_secret: "XXXXX",
            }),
          });

          const data = await res.json();
          console.log("Token recibido:", data);
          localStorage.setItem("token", data.access_token);
          navigate("/homepage");
        } catch (err) {
          console.error("Error al obtener token:", err);
        }
      };

      fetchToken();
    }
  }, [navigate]);

  return <div>Procesando autenticación...</div>;
}
