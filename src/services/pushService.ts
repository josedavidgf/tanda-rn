import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

export async function savePushToken(token: string, userId: string, accessToken: string) {
  console.log('[PUSH SERVICE] Guardando token:', { token: token.substring(0, 20) + '...', userId });
  
  try {
    const response = await axios.post(`${API_URL}/push/register`, {
      token,
      userId,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 segundos timeout
    });

    console.log('[PUSH SERVICE] Token guardado exitosamente:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('[PUSH SERVICE] Error guardando token:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('[PUSH SERVICE] Error response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('[PUSH SERVICE] Error request:', error.request);
      }
    }
    
    // Re-lanzar el error para que el caller pueda manejarlo
    throw error;
  }
}