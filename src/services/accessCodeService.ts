// src/services/accessCodeService.js
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

export const validateAccessCode = async (code) => {
  try {
    const response = await axios.post(`${API_URL}/api/access-codes/validate`, { code });
    return response.data.data;
  } catch (error) {
    console.error('❌ Error en validateAccessCode:', error.message);
    throw new Error('Error al validar código de acceso');
  }
};
