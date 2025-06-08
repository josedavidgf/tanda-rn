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
import { EVENTS } from '@/utils/amplitudeEvents';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { makeRedirectUri } from 'expo-auth-session'
import {useToast} from '@/app/hooks/useToast';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showInfo } = useToast();

  const isEmailValid = /\S+@\S+\.\S+/.test(email);


  const isDisabled = loading || !email || !password || !isEmailValid;

  const handleRegister = async () => {
    trackEvent(EVENTS.REGISTER_ATTEMPTED_WITH_EMAIL);
    setLoading(true);

    const redirectTo = makeRedirectUri({
          path: 'auth-callback',
          scheme: 'tanda',
        });

    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        trackEvent(EVENTS.REGISTER_FAILED);
        Alert.alert('Error', error.message);
        return;
      }

      trackEvent(EVENTS.REGISTER_SUCCESS);

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
        setTimeout(() => navigation.navigate('Login'), 1000);
        Alert.alert(
          'Revisa tu correo',
          'Hemos enviado un enlace de confirmación para activar tu cuenta.'
        );
      }
    } catch (err) {
      trackEvent(EVENTS.REGISTER_FAILED);
      Alert.alert('Error inesperado', err.message);
    } finally {
      setLoading(false);
    }
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
          disabled={isDisabled}
          style={styles.primaryButton}
        />

        <DividerText text="o" />

        <Button
          label="Registrarme con Google"
          size="lg"
          onPress={() => {
            trackEvent(EVENTS.REGISTER_ATTEMPTED_WITH_GOOGLE);
            showInfo('Próximamente');
          }}
          variant="outline"
          leftIcon={<GoogleLogo size={20} />}
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
