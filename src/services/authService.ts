// src/services/authService.js
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

// ✅ Configuración inicial — llama a esto en App.tsx o en un hook global
export function configureGoogleSignin() {
  console.log('[Google Signin] Configurando Google Signin...');
  console.log('[Expo Config] iosUrlScheme:', process.env.EXPO_PUBLIC_GOOGLE_REVERSED_CLIENT_ID);
  console.log('[Google Signin] Variables de entorno:', {
    webClientId,
    iosClientId,
  });
  //androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || !process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID) {
    console.warn('[Google Signin] Variables de entorno EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID y EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID no están definidas');
    return;
  }
  GoogleSignin.configure({
    webClientId: webClientId, // ID de cliente web de Google
    iosClientId: iosClientId, // ID de cliente iOS de Google
    //androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true, // opcional, pero recomendable para consistencia con Supabase
  });
}


// ✅ Login nativo con Google + Supabase
export async function loginWithGoogle() {
  try {
    console.log('[Google Login] Iniciando login nativo...');

    // 1. Verifica si Google Play Services están disponibles (Android)
    await GoogleSignin.hasPlayServices();

    // 2. Inicia sesión con Google
    const userInfo = await GoogleSignin.signIn();
    console.log('[Google Login] Usuario obtenido:', userInfo);

    const idToken = userInfo?.idToken;
    if (!idToken) throw new Error('No se pudo obtener el ID Token de Google');

    // 3. Autenticación en Supabase con el token de Google
    const { data, error } = await supabase.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) {
      console.error('[Google Login] Error en Supabase:', error);
      throw error;
    }

    console.log('[Google Login] Autenticación exitosa en Supabase');
    return data;
  } catch (err: any) {
    console.error('[Google Login] Error general:', err.message);
    throw err;
  }
}
// Cerrar sesión de Google también
export async function signOutGoogle() {
  try {
    await GoogleSignin.signOut();
    await supabase.signOut();
  } catch (error) {
    console.error('Error signing out from Google:', error);
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