import { ENDPOINTS } from './apiEndpoints';

export async function registerUser(data: any) {
  const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al registrarse.');
  return response.json();
}

export async function login(data: any) {
  const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al iniciar sesión.');
  return response.json();
}

export async function getUserData(token: string) {
  const response = await fetch(ENDPOINTS.AUTH.USER, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('No se pudieron cargar los datos del usuario');
  }
  return response.json();
}

export const updateUserData = async (token: string, data: any) => {
  const response = await fetch(ENDPOINTS.AUTH.USER, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar los datos');
  }

  return await response.json();
};
