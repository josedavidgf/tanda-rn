import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AppText from '@/components/ui/AppText';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@/styles';
import DividerText from '@/components/ui/DividerText';
import SimpleLayout from '@/components/layout/SimpleLayout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleLogo } from 'phosphor-react-native';
import {EVENTS} from '@/utils/amplitudeEvents';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { useToast } from '@/app/hooks/useToast';


const schema = z.object({
  email: z.string().email({ message: 'Introduce un correo válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export default function LoginScreen() {
  const { setSession } = useAuth();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });
  const { showInfo } = useToast();

  const email = watch('email');
  const password = watch('password');
  const isDisabled = isSubmitting || !email || !password;


  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    trackEvent(EVENTS.LOGIN_ATTEMPTED_WITH_EMAIL);

    const { data, error } = await supabase.signInWithPassword({ email, password });

    if (error || !data?.session) {
      trackEvent(EVENTS.LOGIN_FAILED);
      setError('email', { message: 'Credenciales incorrectas' });
      Alert.alert('Error', 'El correo o la contraseña no son correctos');
      return;
    }

    trackEvent(EVENTS.LOGIN_SUCCESS);

    await SecureStore.setItemAsync(
      'supabase.session',
      JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
    );
    setSession(data.session);

  };

  return (
    <SimpleLayout title="" showBackButton>
      <View style={styles.container}>
        <AppText variant="h1" style={styles.title}>Inicia sesión</AppText>
        <InputField
          label="Correo electrónico"
          name="email"
          placeholder="tucorreo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          control={control}
          error={errors.email?.message}
        />
        <InputField
          label="Contraseña"
          name="password"
          placeholder="********"
          secureTextEntry
          control={control}
          error={errors.password?.message}
        />

        <Button
          label="Iniciar sesión"
          size="lg"
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isDisabled}
          style={styles.primaryButton}
        />

        <DividerText text="o" />

        <Button
          label="Login con Google"
          size="lg"
          onPress={() => {
            trackEvent(EVENTS.LOGIN_ATTEMPTED_WITH_GOOGLE);
            showInfo("Próximamente");
          }}
          variant="outline"
          leftIcon={<GoogleLogo size={20} />}
        />

        <AppText
          variant="link"
          style={styles.link}
          onPress={() => {
            trackEvent(EVENTS.FORGOT_PASSWORD_CLICKED);
            navigation.navigate('ForgotPassword');
          }}
        >
          ¿Has olvidado tu contraseña?
        </AppText>
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
  link: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
