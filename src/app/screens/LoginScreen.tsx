import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import AppText from '@/components/ui/AppText';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log('[LOGIN] Intentando login con:', data);

    try {
      const { data: loginData, error } = await supabase.auth.signIn({
        email: data.email,
        password: data.password,
      });

      console.log('[LOGIN] loginData:', loginData);
      console.log('[LOGIN] error:', error);

      if (error) Alert.alert('Error', error.message);
      else Alert.alert('Login OK');
    } catch (e) {
      console.error('[LOGIN] Fallo inesperado', e);
      Alert.alert('Error', 'Fallo inesperado en login');
    }

  };

  return (
    <View style={styles.container}>
      <AppText variant='p' style={styles.title}>Iniciar sesión</AppText>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            secureTextEntry
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Button title="Entrar" onPress={handleSubmit(onSubmit)} />

      <AppText variant='p' style={styles.link} onPress={() => navigation.navigate('Register')}>
        ¿No tienes cuenta? Regístrate
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { fontSize: 24, marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  error: { color: 'red', marginBottom: 8 },
  link: { marginTop: 16, color: 'blue', textAlign: 'center' },
});
