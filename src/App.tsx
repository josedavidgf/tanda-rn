import 'react-native-reanimated'; // debe ir arriba del todo
import 'react-native-gesture-handler'; // si usas stacks nativos
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '@/app/navigation/AppNavigator';
import AuthNavigator from '@/app/navigation/AuthNavigator';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import AppText from './components/ui/AppText';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


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
      <AuthProvider>
        <NavigationContainer>
          <AuthGate />
        </NavigationContainer>
        <ToastProvider />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function AuthGate() {
  const { session, loading } = useAuth();

  if (loading) return null;

  return session ? <AppNavigator /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
