import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Tanda',
  slug: 'tanda-rn',
  scheme: "tanda",
  platforms: ['ios', 'android'],
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  version: '1.0.0',
  icon: './assets/icon.png',
  jsEngine: 'hermes',
  ios: {
    bundleIdentifier: 'com.apptanda.app',
    googleServicesFile: process.env.EXPO_PUBLIC_GOOGLE_SERVICES_PLIST,
    supportsTablet: false,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSUserTrackingUsageDescription: 'Tanda uses notifications to keep you informed of shift changes.',
      UIBackgroundModes: ['remote-notification'],
      LSApplicationQueriesSchemes: ["whatsapp"],
    },
  },
  android: {
    package: 'com.apptanda.app',
    // Para Google Sign-In nativo
    googleServicesFile: process.env.EXPO_PUBLIC_GOOGLE_SERVICES_JSON
  },
  plugins: [
    '@react-native-google-signin/google-signin'
  ],
  extra: {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
    // Para Google Sign-In
    GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
/*     ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID,
 */    eas: {
      projectId: 'c3526404-d409-4a31-8471-085a324c0adc'
    }
  },
});
