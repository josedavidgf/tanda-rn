import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const handleError = (error, defaultMessage = 'Error al obtener flags') => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

export const getFeatureFlags = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/flags`, authHeaders(token));
    return response.data.flags;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
