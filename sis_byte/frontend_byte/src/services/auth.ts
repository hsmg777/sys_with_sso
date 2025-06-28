import Keycloak from "keycloak-js";

const AUTH_SERVER = "http://localhost:8080";
const REALM = "MultiAppRealm";
const CLIENT_ID = "frontend-byte-client";

const keycloak = new Keycloak({
  url: AUTH_SERVER,
  realm: REALM,
  clientId: CLIENT_ID,
});

export async function loginWithCredentials(username: string, password: string): Promise<void> {
  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("grant_type", "password");
  params.append("username", username);
  params.append("password", password);

  const res = await fetch(`${AUTH_SERVER}/realms/${REALM}/protocol/openid-connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Respuesta de Keycloak:", errorText);
    throw new Error("Credenciales inválidas");
  }

  const data = await res.json();

  keycloak.token = data.access_token;
  keycloak.refreshToken = data.refresh_token;

  try {
    const base64Url = data.access_token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base64);
    keycloak.tokenParsed = JSON.parse(decodedPayload);
  } catch (err) {
    throw new Error("Error al decodificar el token");
  }

  // ✅ Guardar en localStorage
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  localStorage.setItem("token_expires_at", (Date.now() + data.expires_in * 1000).toString());
}

export function getToken(): string | null {
  return localStorage.getItem("access_token") || null;
}

export function getUserInfo() {
  return keycloak.tokenParsed;
}

export function logout(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_expires_at");
  keycloak.logout({ redirectUri: "http://localhost:5173" });
}

// Opcional: función para refrescar token en background
export async function refreshAccessToken(): Promise<void> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) throw new Error("No hay refresh token disponible");

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const res = await fetch(`${AUTH_SERVER}/realms/${REALM}/protocol/openid-connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) throw new Error("Error al refrescar token");

  const data = await res.json();
  keycloak.token = data.access_token;
  keycloak.refreshToken = data.refresh_token;
  keycloak.tokenParsed = JSON.parse(atob(data.access_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  localStorage.setItem("token_expires_at", (Date.now() + data.expires_in * 1000).toString());
}
