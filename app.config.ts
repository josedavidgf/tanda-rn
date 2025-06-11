import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const plugins: NonNullable<ExpoConfig['plugins']> = [
    [
      'onesignal-expo-plugin',
      {
        mode: 'production',
      },

    ],
    [
      "expo-tracking-transparency",
      {
        userTrackingPermission: "This identifier will be used to deliver personalized ads to you."
      }
    ]
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
    ios: {
      bundleIdentifier: 'com.apptanda.app',
      usesBroadcastPushNotifications: true,
      supportsTablet: false,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserTrackingUsageDescription: 'Tanda uses notifications to keep you informed of shift changes.',
        UIBackgroundModes: ['remote-notification'],
        LSApplicationQueriesSchemes: ['whatsapp'],
      },
    },
    android: {
      package: 'com.apptanda.app',
    },

    plugins,
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
      EXPO_PUBLIC_PROJECT_ID: process.env.EXPO_PUBLIC_PROJECT_ID,
      EXPO_PUBLIC_ONESIGNAL_APP_ID: process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID,
      eas: {
        projectId: 'c3526404-d409-4a31-8471-085a324c0adc',
      },
    },
  };
};
