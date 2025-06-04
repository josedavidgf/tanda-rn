import { navigationRef } from '@/app/navigation/navigationRef';

export function handleDeeplinkNavigation(data: any) {
  if (!data?.route) return;

  try {
    if (navigationRef.isReady()) {
      navigationRef.navigate(data.route, data.params || {});
    } else {
      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigationRef.navigate(data.route, data.params || {});
        }
      }, 300);
    }
  } catch (error) {
    console.warn('[Deeplink] Error navegando desde push:', error);
  }
}
