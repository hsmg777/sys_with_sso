const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register/`,
    LOGIN: `${API_BASE_URL}/auth/login/`,
    USER: `${API_BASE_URL}/auth/user/`,
    MACRONUTRIENTES: `${API_BASE_URL}/auth/mis-macronutrientes/`,
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
    MAS_GUARDADAS: `${API_BASE_URL}/recetas-guardadas/mas-guardadas/`, // Ruta para obtener las recetas más guardadas
  },
};
