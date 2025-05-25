import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import DividerText from '@/components/ui/DividerText';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleLogo } from 'phosphor-react-native';
import { colors, spacing } from '@/styles';
import SimpleLayout from '@/components/layout/SimpleLayout';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    await signUpWithEmail(email, password);
    setLoading(false);
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
        size='lg'
        variant='primary'
        onPress={handleRegister}
        loading={loading}
        style={styles.primaryButton}
      />

      <DividerText text="o" />

      <Button
        label="Registrarme con Google"
        size='lg'
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
  link: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
