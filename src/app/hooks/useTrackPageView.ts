// hooks/useTrackPageView.ts
import { useEffect, useRef } from 'react';
import AmplitudeService from '@/lib/amplitude';

/**
 * Hook para trackear la vista de una pantalla
 * @param pageName Nombre de la pantalla para Amplitude (ej: 'calendar')
 */
export default function useTrackPageView(pageName: string) {
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!hasTrackedView.current && pageName) {
      AmplitudeService.track(`${pageName}-viewed`);
      hasTrackedView.current = true;
    }
  }, [pageName]);
}

/**
 * Función para eventos puntuales desde cualquier lugar
 */
export function trackEvent(eventName: string, eventProperties: Record<string, any> = {}) {
  AmplitudeService.track(eventName, eventProperties);
}
