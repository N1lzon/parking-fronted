import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ ADMIN ============
export const loginAdmin = async (nombre, contraseña) => {
  const response = await api.post('/admin/login', { nombre, contraseña });
  return response.data;
};

// ============ ESPACIOS ============
export const getEspacios = async () => {
  const response = await api.get('/espacios');
  return response.data;
};

export const updateEspacio = async (id, data) => {
  const response = await api.put(`/espacios/${id}`, data);
  return response.data;
};

export const liberarEspacio = async (id) => {
  const response = await api.put(`/asignaciones/espacio/${id}/liberar`);
  return response.data;
};

// ============ ASIGNACIONES ============
export const getAsignacionesActivas = async () => {
  const response = await api.get('/asignaciones/activas');
  return response.data;
};

// ============ ESTADÍSTICAS ============
export const getEstadisticas = async () => {
  const response = await api.get('/reportes/estadisticas/actual');
  return response.data;
};

export default api;