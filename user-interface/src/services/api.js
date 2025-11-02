import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ ESPACIOS ============
export const getEspacios = async () => {
  const response = await api.get('/espacios');
  return response.data;
};

// ============ USUARIOS RESERVA ============
export const verificarUsuarioReserva = async (ci) => {
  try {
    const response = await api.get(`/usuarios-reserva/${ci}`);
    return response.data;
  } catch (error) {
    return null; // Usuario no encontrado
  }
};

// ============ ASIGNACIONES ============
export const solicitarEspacioNormal = async () => {
  const response = await api.post('/asignaciones/', { ci: null });
  return response.data;
};

export const solicitarEspacioReservado = async (ci) => {
  const response = await api.post('/asignaciones/', { ci });
  return response.data;
};

export default api;