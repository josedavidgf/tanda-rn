import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@/styles';

export default function AuthLandingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../../../../assets/logo-tanda-light.png')} style={styles.logo} resizeMode="contain" />

      <Image source={require('../../../../assets/illustrations/illustration.png')} style={styles.illustration} resizeMode="contain" />

      <AppText variant="h2" style={styles.title}>Gestiona tus turnos con facilidad</AppText>
      <AppText variant="p" style={styles.description}>
        Intercambia turnos, consulta tu calendario y mantente siempre informado.
      </AppText>

      <View style={styles.buttonGroup}>
        <Button 
            label="Iniciar sesión" 
            size='lg'
            variant='primary'
            style={{ marginBottom: spacing.md }}
            onPress={() => navigation.navigate('Login')} />
        <Button 
            label="Registrarme" 
            size='lg'
            style={{ marginBottom: spacing.md }}
            onPress={() => navigation.navigate('Register')} 
            variant="outline" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 40,
    marginBottom: spacing.xl,
  },
  illustration: {
    width: '100%',
    height: 180,
    marginBottom: spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.gray[600],
  },
  buttonGroup: {
    gap: spacing.md,
    width: '100%',
  },
});
