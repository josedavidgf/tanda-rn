// utils/deeplinkHandler.ts
import { handleDeeplinkNavigation } from './handleDeeplinkNavigation';
import { supabase } from '@/lib/supabase';
import { navigationRef } from '@/app/navigation/navigationRef';

export async function handleDeeplink(event: { url: string }) {
  const url = new URL(event.url);
  const { hash, pathname } = url;

  // 1. Gestión especial de recovery/signup
  if (hash.includes('access_token')) {
    const fragmentParams = new URLSearchParams(hash.slice(1));
    const access_token = fragmentParams.get('access_token');
    const refresh_token = fragmentParams.get('refresh_token');
    const type = fragmentParams.get('type');

    if (access_token && refresh_token) {
      console.log('[DEEPLINK] Restaurando sesión desde hash');
      await supabase.setSession({ access_token, refresh_token });

      if (type === 'recovery') {
        navigationRef.navigate('ProfileResetPassword');
      } else if (type === 'signup') {
        navigationRef.navigate('OnboardingCode');
      }
      return;
    }
  }

  // 2. Rutas normales: SwapDetails, ProposeSwap, etc
  await handleDeeplinkNavigation(url);
}