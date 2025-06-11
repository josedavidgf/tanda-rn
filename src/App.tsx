// App.tsx
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '@/app/navigation/AppNavigator';
import AuthNavigator from '@/app/navigation/AuthNavigator';
import AuthProvider, { useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import AppText from '@/components/ui/AppText';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { navigationRef } from '@/app/navigation/navigationRef';
import 'react-native-url-polyfill/auto';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { Buffer } from 'buffer';
import * as Linking from 'expo-linking';
import NavigationTracker from '@/components/analytics/NavigationTracker';

import { handleDeeplink } from '@/utils/deeplinkHandler';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://e5f77a0c54a16a395061ad0b04efd958@o4509300831223808.ingest.de.sentry.io/4509479717503056',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

global.Buffer = Buffer;
global.process = require('process');

export default Sentry.wrap(function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const sub = Linking.addEventListener('url', handleDeeplink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeeplink({ url });
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    Font.loadAsync({
      Custom: require('@assets/fonts/HostGrotesk-Regular.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  const linking = {
    prefixes: ['tanda://'],
    config: {
      screens: {
        AuthCallback: 'auth-callback',
        Login: 'login',
        SwapDetails: 'SwapDetails/:swapId',
        ProposeSwap: 'ProposeSwap/:shiftId',
        // otras rutas...
      },
    },
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <AppText variant="p">Loading fonts...</AppText>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        onReady={() => {
          console.log('[NAV] Navigation is ready');
        }}
      >
        <AuthProvider>
          <OnboardingProvider>
            <NavigationTracker />
            <AuthGate />
          </OnboardingProvider>
        </AuthProvider>
        <ToastProvider />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
});

function AuthGate() {
  const { session } = useAuth();
  return session ? <AppNavigator /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});