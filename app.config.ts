import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'tanda-rn-reset',
  slug: 'tanda-rn-reset',
  version: '1.0.0',
  cli: {
    appVersionSource: "version"
  },
  jsEngine: 'hermes', // ✅ esto hay que dejarlo
  android: {
    package: 'com.apptanda.app' // ✅ Aquí defines el ID de paquete único
  },
  extra: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    eas: {
      projectId: "01eb90f0-48ce-4828-9989-bea7ad905b71"
    }
  },
});
