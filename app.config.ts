import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

const isEASBuild = process.env.EAS_BUILD === 'true';

export default ({ config }: ConfigContext): ExpoConfig => {
  const plugins: NonNullable<ExpoConfig['plugins']> = [];

  if (isEASBuild) {
    plugins.push([
      '@react-native-google-signin/google-signin',
      {
        iosUrlScheme:
          'com.googleusercontent.apps.161823689095-51njcp75miao8hkatl83r2g6v5r624bo',
      },
    ]);
  }

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
    },
    plugins,
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY:
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
      EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID:
        process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      eas: {
        projectId: 'c3526404-d409-4a31-8471-085a324c0adc',
      },
    },
  };
};
