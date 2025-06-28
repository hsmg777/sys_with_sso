const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const ENDPOINTS = {
  AUTH: {
    USER: `${API_BASE_URL}/auth/user/`, // Información del usuario autenticado
    MACRONUTRIENTES: `${API_BASE_URL}/auth/mis-macronutrientes/`, // Endpoint protegido con @require_token
  },
  INGREDIENTES: {
    LIST: `${API_BASE_URL}/ingredientes/`,
  },
  RECETAS: {
    BASE: `${API_BASE_URL}/recetas/`,
    NUTRICIONALES: `${API_BASE_URL}/recetas/recomendaciones-nutricionales/`,
    RECOMENDACIONES: `${API_BASE_URL}/recetas/recomendaciones/`,
    DETAILS: (id: number) => `${API_BASE_URL}/recetas/${id}/`,
    GUARDADAS: `${API_BASE_URL}/recetas-guardadas/`,
    MAS_GUARDADAS: `${API_BASE_URL}/recetas-guardadas/mas-guardadas/`,
  },
};
