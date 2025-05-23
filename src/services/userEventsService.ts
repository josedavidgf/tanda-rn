import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const handleError = (error, defaultMessage = 'Error en la operación') => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

export const getUserEvents = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/user-events`, authHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar actividad'));
  }
};

export const markUserEventsAsSeen = async (token) => {
  try {
    await axios.post(`${API_URL}/api/user-events/seen`, null, authHeaders(token));
  } catch (error) {
    throw new Error(handleError(error, 'Error al marcar eventos como vistos'));
  }
};
