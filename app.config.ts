import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Tanda',
  slug: 'tanda-rn',
  scheme: "tanda",
  version: '1.0.0',
  icon: './assets/icon.png',
  jsEngine: 'hermes',
  ios: {
    bundleIdentifier: 'com.apptanda.app',
    buildNumber: '1.0.3',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSUserTrackingUsageDescription: 'Tanda uses notifications to keep you informed of shift changes.',
      UIBackgroundModes: ['remote-notification'],
    }
  },
  android: {
    package: 'com.apptanda.app'
  },
  extra: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    EXPO_PUBLIC_BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
/*     ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID,
 */    eas: {
      projectId: 'c3526404-d409-4a31-8471-085a324c0adc'
    }
  },
});
