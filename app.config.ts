import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const plugins: NonNullable<ExpoConfig['plugins']> = [
    // ✅ CRÍTICO: Plugin de expo-notifications
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png', // Crea este icon (96x96, blanco con fondo transparente)
        color: '#ffffff',
        defaultChannel: 'default',
      },
    ],
  ];

  return {
    ...config,
    name: 'Tanda',
    slug: 'tanda-rn',
    scheme: 'tanda',
    platforms: ['ios', 'android'],
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    version: '1.0.0',
    icon: './assets/icon.png',
    jsEngine: 'hermes',

    // ✅ CRÍTICO: Configuración de notificaciones
    notification: {
      icon: './assets/notification-icon.png',
      color: '#000000',
      iosDisplayInForeground: true,
      androidMode: 'default',
      androidCollapsedTitle: 'Tanda',
    },

    ios: {
      bundleIdentifier: 'com.apptanda.app',
      supportsTablet: false,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserTrackingUsageDescription:
          'Tanda uses notifications to keep you informed of shift changes.',
        UIBackgroundModes: ['remote-notification'],
        LSApplicationQueriesSchemes: ['whatsapp'],
      },
    },
    android: {
      package: 'com.apptanda.app',
      googleServicesFile: './google-services.json',
      // ✅ Configuración de notificaciones para Android
      permissions: [
        'RECEIVE_BOOT_COMPLETED',
        'WAKE_LOCK',
        'VIBRATE',
        'USE_FINGERPRINT',
        'USE_BIOMETRIC',
      ],
    },
    plugins,
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
      // ✅ CRÍTICO: Exponer el projectId para uso en runtime
      EXPO_PUBLIC_PROJECT_ID: process.env.EXPO_PUBLIC_PROJECT_ID,
      eas: {
        projectId: 'c3526404-d409-4a31-8471-085a324c0adc',
      },
    },
  };
};