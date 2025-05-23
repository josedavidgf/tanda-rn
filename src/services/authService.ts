// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

// Utilidad interna para capturar errores
const handleError = (error, defaultMessage) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

// Registro
export async function registerUser(email, password) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al registrar usuario'));
  }
}

// Login
export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al iniciar sesión'));
  }
}

// Obtener perfil
export async function getUserProfile() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Si es 401 (token expirado), limpia token
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    throw new Error(handleError(error, 'Error al obtener el perfil'));
  }
}

// Reenviar verificación email
export async function resendVerificationEmail(token) {
  try {
    const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al reenviar verificación');
    return data;
  } catch (error) {
    throw new Error(error.message || 'Error desconocido en reenvío de verificación');
  }
}
