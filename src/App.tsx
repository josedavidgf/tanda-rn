// App.tsx (simplificado y ajustado)
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

global.Buffer = Buffer;
global.process = require('process');

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  

  useEffect(() => {
    Font.loadAsync({
      Custom: require('@assets/fonts/HostGrotesk-Regular.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <AppText variant='p'>Loading fonts...</AppText>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          console.log('[NAV] Navigation is ready');
        }}
      >
        <AuthProvider>
          <OnboardingProvider>
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
