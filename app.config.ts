import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Tanda',
  slug: 'tanda-rn',
  scheme: "tanda", // importante
  version: '1.0.0',
  icon: './assets/icon.png',
  jsEngine: 'hermes',
  ios: {
    bundleIdentifier: 'com.apptanda.app',
    buildNumber: '1.0.0',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false
    }
  },
  android: {
    package: 'com.apptanda.app'
  },
  extra: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    EXPO_PUBLIC_BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
    eas: {
      projectId: 'c3526404-d409-4a31-8471-085a324c0adc'
    }
  }
});
