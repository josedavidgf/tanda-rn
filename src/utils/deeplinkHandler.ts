// src/utils/deeplinkHandler.ts
import { URL } from 'react-native-url-polyfill';
import { supabase } from '@/lib/supabase';
import { navigationRef } from '@/app/navigation/navigationRef';

export async function handleDeeplink(urlString: string) {
  const url = new URL(urlString);

  if (!url.hash.includes('access_token')) return;

  const fragmentParams = new URLSearchParams(url.hash.slice(1));
  const access_token = fragmentParams.get('access_token');
  const refresh_token = fragmentParams.get('refresh_token');
  const type = fragmentParams.get('type');

  if (!access_token || !refresh_token || !type) {
    console.warn('[DEEPLINK] Falta algún parámetro necesario');
    return;
  }

  console.log(`[DEEPLINK] Tipo de evento detectado: ${type}`);
  await supabase.setSession({ access_token, refresh_token });

  const navigateWithDelay = (route: string) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(route);
    } else {
      setTimeout(() => navigationRef.navigate(route), 200);
    }
  };

  switch (type) {
    case 'recovery':
      navigateWithDelay('ProfileResetPassword');
      break;
    case 'signup':
      navigateWithDelay('OnboardingCode');
      break;
    default:
      console.warn('[DEEPLINK] Tipo no reconocido:', type);
  }
}
