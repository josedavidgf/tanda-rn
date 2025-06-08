import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { savePushToken } from '@/services/pushService';

// Configurar el comportamiento de notificaciones ANTES de registrar
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(userId: string, accessToken: string) {
  console.log('[PUSH] Iniciando registro de push notifications...');
  
  // Verificar que es un dispositivo real
  if (!Device.isDevice) {
    console.warn('[PUSH] No es un dispositivo físico, saltando registro');
    return null;
  }

  try {
    // Verificar permisos existentes
    console.log('[PUSH] Verificando permisos existentes...');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('[PUSH] Status de permisos existentes:', existingStatus);
    
    let finalStatus = existingStatus;

    // Solicitar permisos si no están concedidos
    if (existingStatus !== 'granted') {
      console.log('[PUSH] Solicitando permisos...');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log('[PUSH] Nuevo status de permisos:', finalStatus);
    }

    if (finalStatus !== 'granted') {
      console.warn('[PUSH] Permisos denegados por el usuario');
      return null;
    }

    // Configurar canal de Android ANTES de obtener el token
    if (Platform.OS === 'android') {
      console.log('[PUSH] Configurando canal de Android...');
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      });
    }

    // ✅ CRÍTICO: Usar el projectId correctamente
    const projectId = Constants.expoConfig?.extra?.EXPO_PUBLIC_PROJECT_ID;
    console.log('[PUSH] Project ID:', projectId);

    if (!projectId) {
      throw new Error('Project ID no encontrado en la configuración');
    }

    // Obtener el token con timeout y manejo de errores
    console.log('[PUSH] Obteniendo token de Expo...');
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout obteniendo token')), 15000) // Aumentado a 15s
    );

    const tokenPromise = Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });

    const tokenResult = await Promise.race([tokenPromise, timeoutPromise]) as any;
    const token = tokenResult.data;
    
    console.log('[PUSH] Token obtenido exitosamente:', token);

    // Guardar token en el servidor
    console.log('[PUSH] Guardando token en el servidor...');
    await savePushToken(token, userId, accessToken);
    console.log('[PUSH] Token guardado exitosamente');

    return token;

  } catch (error) {
    console.error('[PUSH] Error durante el registro:', error);
    
    // Log específico del tipo de error
    if (error.message?.includes('Timeout')) {
      console.error('[PUSH] Error: Timeout obteniendo token - posible problema de conectividad');
    } else if (error.message?.includes('credentials')) {
      console.error('[PUSH] Error: Problema con credenciales de push');
    } else if (error.message?.includes('network')) {
      console.error('[PUSH] Error: Problema de red');
    } else if (error.message?.includes('Project ID')) {
      console.error('[PUSH] Error: Project ID no configurado correctamente');
    }
    
    // No relanzar el error para no romper el flujo de la app
    return null;
  }
}