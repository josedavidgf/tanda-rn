import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Tanda',
  slug: 'tanda-rn',
  version: '1.0.0',
  jsEngine: 'hermes', // ✅ esto hay que dejarlo
  android: {
    package: 'com.apptanda.app' // ✅ Aquí defines el ID de paquete único
  },
  extra: {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
    eas: {
      projectId: "c3526404-d409-4a31-8471-085a324c0adc"
    }
  },
});
