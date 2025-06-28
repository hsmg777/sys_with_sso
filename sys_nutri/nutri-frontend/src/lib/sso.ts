export function tryGetSSOToken(): Promise<boolean> {
  return new Promise((resolve) => {
    const popup = window.open("http://localhost:5173/sso-token.html", "_blank", "width=300,height=200");

    if (!popup) {
      console.warn("❌ No se pudo abrir el popup de SSO");
      return resolve(false);
    }

    const timeout = setTimeout(() => {
      console.warn("⏰ Timeout esperando respuesta SSO");
      resolve(false);
    }, 3000);

    window.addEventListener("message", function handler(event) {
      if (event.origin !== "http://localhost:5173") {
        console.warn("🚫 Origen inválido:", event.origin);
        return;
      }

      console.log("📨 Mensaje recibido:", event.data);

      if (event.data?.type === "KC_SSO_TOKEN") {
        clearTimeout(timeout);
        window.removeEventListener("message", handler);

        const { token, refresh, expires } = event.data;
        if (token) {
          console.log("✅ Token recibido por SSO:", token);
          localStorage.setItem("token", token);
          localStorage.setItem("refresh_token", refresh);
          localStorage.setItem("token_expires_at", expires);
          resolve(true);
        } else {
          console.warn("⚠️ Token vacío recibido");
          resolve(false);
        }
      }
    });
  });
}
