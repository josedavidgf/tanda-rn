import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AppText from '@/components/ui/AppText';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing } from '@/styles';
import DividerText from '@/components/ui/DividerText';
import { GoogleLogo } from 'phosphor-react-native';
import SimpleLayout from '@/components/layout/SimpleLayout';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signInWithEmail(email, password);
    setLoading(false);
  };

  return (
    <SimpleLayout showBackButton>
    <View style={styles.container}>
      <AppText variant="h1" style={styles.title}>Inicia sesión</AppText>

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
        label="Iniciar sesión"
        size='lg'
        variant='primary'
        onPress={handleLogin}
        loading={loading}
        style={styles.primaryButton}
      />

      <DividerText text="o" />

      <Button
        label="Iniciar sesión con Google"
        size='lg'
        onPress={signInWithGoogle}
        variant="outline"
        leftIcon={<GoogleLogo size={20} color={colors.text} />}
      />

      <AppText variant="link" style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
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
