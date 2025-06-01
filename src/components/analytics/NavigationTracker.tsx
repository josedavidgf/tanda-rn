// components/analytics/NavigationTracker.tsx
import { useEffect, useRef } from 'react';
import { navigationRef } from '@/app/navigation/navigationRef';
import AmplitudeService from '@/lib/amplitude';
import { NavigationState, PartialState } from '@react-navigation/native';

function getActiveRouteName(state: NavigationState | PartialState<NavigationState>): string | undefined {
  const route = state.routes[state.index ?? 0];
  if (!route) return undefined;
  if (route.state) return getActiveRouteName(route.state as NavigationState);
  return route.name;
}

function sanitizeScreenName(name: string): string {
  return name
    .replace(/\/:[^/]+/g, '') // remove param patterns like /:id
    .replace(/\?.*$/, '')     // remove query params
    .replace(/\d+/g, '#');    // replace numeric IDs
}

export default function NavigationTracker() {
  const currentScreenRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      const state = navigationRef.getRootState();
      const currentScreen = getActiveRouteName(state);

      if (!currentScreen) return;

      const sanitizedScreen = sanitizeScreenName(currentScreen);

      if (currentScreenRef.current !== sanitizedScreen) {
        AmplitudeService.track('screen-viewed', { screen: sanitizedScreen });
        currentScreenRef.current = sanitizedScreen;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
}
