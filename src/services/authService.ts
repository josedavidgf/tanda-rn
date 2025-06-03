// src/services/authService.js
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { GoogleSignin } from '@/lib/googleSignInClient'; // ✅ cambio aquí

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';
const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

export function configureGoogleSignin() {
  console.log('[Google Signin] Configurando...');
  if (!GoogleSignin) return console.warn('[Google Signin] No disponible en este entorno');

  if (!webClientId || !iosClientId) {
    console.warn('[Google Signin] Faltan variables de entorno');
    return;
  }

  GoogleSignin.configure({
    webClientId,
    iosClientId,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
}

export async function loginWithGoogle() {
  if (!GoogleSignin) throw new Error('[Google Login] GoogleSignin no disponible');

  try {
    console.log('[Google Login] Iniciando...');
    await GoogleSignin.hasPlayServices?.();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo?.idToken;
    if (!idToken) throw new Error('No se obtuvo ID Token de Google');

    const { data, error } = await supabase.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) throw error;

    console.log('[Google Login] Supabase login OK');
    return data;
  } catch (err: any) {
    console.error('[Google Login] Error:', err.message);
    throw err;
  }
}

export async function signOutGoogle() {
  try {
    if (GoogleSignin?.signOut) await GoogleSignin.signOut();
    await supabase.signOut();
  } catch (error) {
    console.error('[Google SignOut] Error:', error);
  }
}

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