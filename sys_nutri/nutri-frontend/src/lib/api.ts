import { ENDPOINTS } from './apiEndpoints';

/* ──────────────── 🔐 KEYCLOAK AUTH ──────────────── */

// Login usando grant_type = password
export async function login(data: { username: string; password: string }) {
  const response = await fetch('http://localhost:8080/realms/MultiAppRealm/protocol/openid-connect/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: 'frontend-nutri-client',
      username: data.username,
      password: data.password,
    }),
  });

  if (!response.ok) throw new Error('Error al iniciar sesión.');
  return await response.json();
}


// Guardar token localmente
export function saveToken(token: string) {
  localStorage.setItem('keycloak_token', token);
}

// Obtener token guardado
export function getToken(): string | null {
  // Leer desde localStorage (token compartido)
  return localStorage.getItem("access_token");
}


/* ──────────────── 👤 USUARIO ──────────────── */

// Obtener perfil del usuario autenticado
export async function getUserData(token: string) {
  const response = await fetch(ENDPOINTS.AUTH.USER, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('No se pudieron cargar los datos del usuario');
  return await response.json();
}

// Actualizar perfil del usuario autenticado
export async function updateUserData(token: string, data: any) {
  const response = await fetch(ENDPOINTS.AUTH.USER, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error al actualizar los datos');
  return await response.json();
}


// 🆕 Registro de usuario (usado en RegisterPage)
export async function registerUser(data: any) {
  const response = await fetch('http://localhost:8000/api/auth/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al registrar usuario: ${errorText}`);
  }

  return await response.json();
}
