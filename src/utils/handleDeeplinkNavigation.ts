// utils/handleDeeplinkNavigation.ts
import { navigationRef } from '@/app/navigation/navigationRef';

export type DeeplinkPayload = {
  route?: string;
  params?: Record<string, any>;
};

export function handleDeeplinkNavigation({ route, params }: DeeplinkPayload) {
  if (!route) return;

  console.log('[🔗 Navegando a]', route, params);

  if (navigationRef.isReady()) {
    navigationRef.navigate(route, params || {});
  } else {
    setTimeout(() => handleDeeplinkNavigation({ route, params }), 50);
  }
}
