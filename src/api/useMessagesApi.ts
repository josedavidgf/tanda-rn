import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

export const markMessagesAsRead = async (token: string, swapId: string) => {
  try {
    await axios.post(
      `${API_URL}/api/messages/mark-as-read`,
      { swap_id: swapId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error('❌ Error al marcar mensajes como leídos:', err.message);
  }
};

export const getUnreadMessagesPerChat = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/messages/unread`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (err) {
    console.error('❌ Error al obtener mensajes no leídos:', err.message);
    return [];
  }
};