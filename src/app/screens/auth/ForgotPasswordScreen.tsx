import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing } from '@/styles';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    await requestPasswordReset(email);
    setLoading(false);
    navigation.navigate('Login');
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
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
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
