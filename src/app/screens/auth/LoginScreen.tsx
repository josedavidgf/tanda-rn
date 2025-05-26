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
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.signInWithPassword({ email, password });

    if (error || !data?.session) {
      setError('email', { message: 'Credenciales incorrectas' });
      Alert.alert('Error', 'El correo o la contraseña no son correctos');
      return;
    }

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
          style={styles.primaryButton}
        />

        <DividerText text="o" />

        <AppText
          variant="link"
          style={styles.link}
          onPress={() => navigation.navigate('ForgotPassword')}
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
