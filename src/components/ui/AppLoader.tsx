import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Image, StyleSheet, Text } from 'react-native';
import { spacing } from '@/styles';

type AppLoaderProps = {
  onFinish?: () => void; // ✅ ahora es opcional
  message?: string;
};

const MINIMUM_LOADING_TIME_MS = 1000;

export default function AppLoader({ onFinish, message }: AppLoaderProps) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMinTimeElapsed(true), MINIMUM_LOADING_TIME_MS);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (minTimeElapsed && onFinish) onFinish(); // ✅ solo se llama si está definida
  }, [minTimeElapsed]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/logo-tanda-light.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#111" style={styles.spinner} />
      <Text style={styles.text}>{message || 'Cargando Tanda...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
  },
  spinner: {
    marginTop: spacing.sm,
  },
  text: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: '#444',
  },
});
