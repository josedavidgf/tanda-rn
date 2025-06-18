import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

export const getContentCards = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/content-cards`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Tarjetas de contenido cargadas:', response.data.data);
    return response.data.cards || [];
  } catch (error) {
    console.error('❌ Error en getContentCards:', error.message);
    throw new Error('Error al cargar tarjetas de contenido');
  }
};

export const dismissContentCard = async (cardId, token) => {
  try {
    await axios.post(`${API_URL}/api/content-cards/${cardId}/dismiss`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error('❌ Error en dismissContentCard:', error.message);
    throw new Error('Error al ocultar tarjeta de contenido');
  }
};  