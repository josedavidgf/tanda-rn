import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AppText from '@/components/ui/AppText';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import DividerText from '@/components/ui/DividerText';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@/styles';
import SimpleLayout from '@/components/layout/SimpleLayout';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/lib/supabase';
import { EVENTS } from '@/utils/amplitudeEvents';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { makeRedirectUri } from 'expo-auth-session'
import { useToast } from '@/app/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native'
//import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes, GoogleSigninButton, GoogleSigninButtonProps } from '@react-native-google-signin/google-signin';


export default function RegisterScreen() {
  const { setSession } = useAuth();

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess, showInfo } = useToast();

  const isEmailValid = /\S+@\S+\.\S+/.test(email);

  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);

  const isDisabled = loading || !email || !password || !isEmailValid;

/*   useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []); */

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
        showError(error.message);
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
        showInfo('Revisa tu correo. Hemos enviado un enlace de confirmación para activar tu cuenta.'
        );
      }
    } catch (err) {
      trackEvent(EVENTS.REGISTER_FAILED);
      showError(err.message);
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
        <DividerText text="O" />
        <View style={styles.buttonGroup}>
          {/* <Button
            label="Registrarme con Google"
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
              label="Registrarme con Apple"
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
  buttonGroup: {
    gap: spacing.sm,
    width: '100%',
    marginTop: spacing.sm,
  },
});
