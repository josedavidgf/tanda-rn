// utils/deeplinkHandler.ts
import * as Linking from 'expo-linking';
import { handleDeeplinkNavigation } from './handleDeeplinkNavigation';

export function handleDeeplink({ url }: { url: string }) {
  console.log('[🔗 handleDeeplink] URL recibida:', url);

  const parsed = Linking.parse(url);
  const { path, queryParams } = parsed;

  if (!path) return;

  // Casos especiales con query
  if (path === 'profile-reset-password' && queryParams.token) {
    return handleDeeplinkNavigation({
      route: 'ProfileResetPassword',
      params: { token: queryParams.token },
    });
  }

  if (path === 'onboarding-code' && queryParams.code) {
    return handleDeeplinkNavigation({
      route: 'OnboardingCode',
      params: { code: queryParams.code },
    });
  }

  // Casos estándar con parámetro en path
  const segments = path.split('/');
  const route = segments[0];
  const param = segments[1];

  if (route === 'SwapDetails') {
    return handleDeeplinkNavigation({ route, params: { swapId: param } });
  }

  if (route === 'ProposeSwap') {
    return handleDeeplinkNavigation({ route, params: { shiftId: param } });
  }
}
