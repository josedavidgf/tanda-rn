import { navigationRef } from '@/app/navigation/navigationRef';

export async function handleDeeplinkNavigation(url: URL) {
  const pathname = decodeURIComponent(url.pathname);
  const segments = pathname.split('/').filter(Boolean); // elimina '' vacíos

  if (segments.length < 2) {
    console.warn('[DEEPLINK] Ruta no válida:', pathname);
    return;
  }

  const [route, id] = segments;

  const routeMap = {
    SwapDetails: (swapId: string) => navigationRef.navigate('SwapDetails', { swapId }),
    ProposeSwap: (shiftId: string) => navigationRef.navigate('ProposeSwap', { shiftId }),
    // puedes añadir más aquí fácilmente
  };

  const handler = routeMap[route as keyof typeof routeMap];

  if (handler && id) {
    console.log(`[DEEPLINK] Navegando a ${route} con id ${id}`);
    handler(id);
  } else {
    console.warn('[DEEPLINK] Ruta desconocida o ID faltante:', route, id);
  }
}
