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
import { supabase } from '@/lib/supabase';
import NavigationTracker from '@/components/analytics/NavigationTracker';
import { configureGoogleSignin } from '@/services/authService';

global.Buffer = Buffer;
global.process = require('process');

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // 🔗 Captura de deeplinks con tokens de Supabase
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = new URL(event.url);

      if (
        url.hash.includes('access_token') &&
        url.hash.includes('type=recovery')
      ) {
        const fragmentParams = new URLSearchParams(url.hash.slice(1)); // elimina el "#" inicial
        const access_token = fragmentParams.get('access_token');
        const refresh_token = fragmentParams.get('refresh_token');

        if (access_token && refresh_token) {
          console.log('[RESET] Recuperación detectada. Restaurando sesión...');
          await supabase.setSession({ access_token, refresh_token });

          // Redirige a la pantalla de cambio de contraseña
          if (navigationRef.isReady()) {
            navigationRef.navigate('ProfileResetPassword');
          } else {
            setTimeout(() => navigationRef.navigate('ProfileResetPassword'), 200);
          }
        }
      }
    };


    // Suscribirse a eventos en caliente
    const sub = Linking.addEventListener('url', handleDeepLink);

    // Manejar apertura en frío
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    configureGoogleSignin();
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
            <NavigationTracker /> {/* 👈 Aquí */}
            <AuthGate />
          </OnboardingProvider>
        </AuthProvider>
        <ToastProvider />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

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
