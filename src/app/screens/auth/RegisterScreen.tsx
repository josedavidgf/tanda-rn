import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AppText from '@/components/ui/AppText';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import DividerText from '@/components/ui/DividerText';
import { useNavigation } from '@react-navigation/native';
import { GoogleLogo } from 'phosphor-react-native';
import { colors, spacing } from '@/styles';
import SimpleLayout from '@/components/layout/SimpleLayout';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/lib/supabase';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://redirect.apptanda.com/auth/callback', // ajusta a tu entorno real
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      // Si devuelve sesión directamente (caso poco común), la guardamos
      if (data.session) {
        await SecureStore.setItemAsync(
          'supabase.session',
          JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          })
        );
        navigation.navigate('OnboardingCode');
      } else {
        Alert.alert(
          'Revisa tu correo',
          'Hemos enviado un enlace de confirmación para activar tu cuenta.'
        );
      }
    } catch (err) {
      Alert.alert('Error inesperado', err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = () => {
    Alert.alert('No implementado aún', 'El login con Google se añadirá próximamente.');
  };

  return (
    <SimpleLayout showBackButton>
      <View style={styles.container}>
        <AppText variant="h1" style={styles.title}>Crea tu cuenta</AppText>

        <InputField
          label="Correo electrónico"
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          label="Contraseña"
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          label="Registrarme"
          size="lg"
          variant="primary"
          onPress={handleRegister}
          loading={loading}
          style={styles.primaryButton}
        />

        <DividerText text="o" />

        <Button
          label="Registrarme con Google"
          size="lg"
          onPress={signInWithGoogle}
          variant="outline"
          leftIcon={<GoogleLogo size={20} color={colors.text} />}
        />
      </View>
    </SimpleLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.white,
    justifyContent: 'flex-start',
  },
  title: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: spacing.md,
  },
});
