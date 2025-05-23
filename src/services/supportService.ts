// src/services/supportService.js
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

export const sendSupportContact = async (workerId, title, description, token) => {

  try {
    const response = await axios.post(
      `${API_URL}/api/support/contact`,
      { workerId, title, description },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error en sendSupportContact:', error.message);
    throw new Error('Error al enviar el mensaje de soporte');
  }
};
