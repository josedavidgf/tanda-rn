import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@/styles';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/app/hooks/useToast';
import { makeRedirectUri } from 'expo-auth-session'


export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showError, showInfo } = useToast();

  const handlePasswordReset = async () => {
    if (!email || !email.includes('@')) {
      showError("Introduce un correo válido.");
      return;
    }

    setLoading(true);
    const redirectTo = makeRedirectUri({
      path: 'auth-callback',
      scheme: 'tanda',
    });

    const { error } = await supabase.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      showError(error.message || "No hemos podido enviar el email.");
    } else {
      showInfo("Si tu correo está registrado, te hemos enviado instrucciones.");
      setTimeout(() => navigation.navigate('Login'), 1000);
    }

    setLoading(false);
  };


  return (
    <View style={styles.container}>
      <AppText variant="h1" style={styles.title}>Recuperar contraseña</AppText>

      <InputField
        label="Correo electrónico"
        placeholder="ejemplo@tanda.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button
        label="Enviar enlace"
        size='lg'
        variant='primary'
        onPress={handlePasswordReset}
        loading={loading}
        style={styles.button}
        disabled={loading || !email}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.md,
  },
});
