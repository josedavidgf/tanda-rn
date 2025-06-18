import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
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
import { EVENTS } from '@/utils/amplitudeEvents';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { useToast } from '@/app/hooks/useToast';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native'
//import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';

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
  const { showInfo, showError, showSuccess } = useToast();

  const email = watch('email');
  const password = watch('password');
  const isDisabled = isSubmitting || !email || !password;
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        showError('No se pudo obtener el token de Apple. Intenta de nuevo.');
        return;
      }
      const data = await supabase.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (data.data?.session) {
        trackEvent(EVENTS.LOGIN_SUCCESS, { provider: 'apple' });
        showSuccess('Inicio de sesión exitoso con Apple');
        setSession(data.data.session);
      } else {
        trackEvent(EVENTS.LOGIN_FAILED, { provider: 'apple' });
        showError('Error al iniciar sesión con Apple');
        return;
      }
    } catch (error) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        showInfo('Inicio de sesión con Apple cancelado');
        return;
      }
      console.error('Error al iniciar sesión con Apple:', error);
      trackEvent(EVENTS.LOGIN_FAILED, { error: error.message });
      showError('Error al iniciar sesión con Apple');
    }
  };

/*   const handleGoogleLogin = async () => {

    try {
      setIsSubmittingGoogle(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        if (!idToken) {
          showError('No se pudo obtener el token de Google. Intenta de nuevo.');
          setIsSubmittingGoogle(false);
          return;
        }
        const { data, error } = await supabase.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });
        if (error) {
          trackEvent(EVENTS.LOGIN_FAILED, { provider: 'google', error: error.message });
          console.error('Error al iniciar sesión con Google:', error);
          showError('Error al iniciar sesión con Google', error.message);
          return;
        }
        trackEvent(EVENTS.LOGIN_SUCCESS, { provider: 'google' });
        setIsSubmittingGoogle(false);
        showSuccess('Inicio de sesión exitoso con Google');
        setSession(data.session);
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            showInfo('Inicio de sesión con Google cancelado');
            break;
          case statusCodes.IN_PROGRESS:
            showInfo('Inicio de sesión con Google ya en progreso');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            showError('Google Play Services no está disponible');
            break;
          default:
            showError('Error desconocido al iniciar sesión con Google');
            console.error('Error desconocido al iniciar sesión con Google:', error.code);
            break;
        }
      }
      trackEvent(EVENTS.LOGIN_FAILED, { provider: 'google', error: error.message });
      showError('Error al iniciar sesión con Google');
      setIsSubmittingGoogle(false);
    }
  }; */

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    trackEvent(EVENTS.LOGIN_ATTEMPTED_WITH_EMAIL);

    const { data, error } = await supabase.signInWithPassword({ email, password });

    if (error || !data?.session) {
      trackEvent(EVENTS.LOGIN_FAILED);
      setError('email', { message: 'Credenciales incorrectas' });
      showError('El correo o la contraseña no son correctos');
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

        <DividerText text="O" />
        <View style={styles.buttonGroup}>
         {/*  <Button
            label="Iniciar sesión con Google"
            variant="outline"
            size="lg"
            onPress={handleGoogleLogin}
            leftIcon={
              <Image
                source={require('../../../../assets/icons/google.png')}
                style={{ width: 20, height: 20 }}
              />
            }
          /> */}
          {Platform.OS === 'ios' && (
            <Button
              label="Iniciar sesión con Apple"
              size="lg"
              variant="outline"
              leftIcon={
                <Image
                  source={require('../../../../assets/icons/apple.png')}
                  style={{ width: 20, height: 20 }}
                />}
              onPress={handleAppleLogin}
            />
          )}
        </View>

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
  buttonGroup: {
    gap: spacing.sm,
    width: '100%',
    marginTop: spacing.sm,
  },
});
