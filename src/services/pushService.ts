import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

export async function savePushToken(token: string, userId: string, accessToken: string) {
  return axios.post(`${API_URL}/push/register`, {
    token,
    userId,
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}