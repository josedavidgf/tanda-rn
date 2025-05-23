import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useUserApi } from '@/api/useUserApi';
import { useToast } from '@/app/hooks/useToast';
import { useOnboardingGuard } from '@/app/hooks/useOnboardingGuard';
import { phonePrefixes } from '@/utils/usePhonePrefix';
import PhoneInputGroup from '@/components/forms/PhoneInputGroup';
import Button from '@/components/ui/Button';
import AppText from '@/components/ui/AppText';
import SimpleLayout from '@/components/layout/SimpleLayout';
import { spacing } from '@/styles';

export default function OnboardingPhoneScreen() {
  const { isWorker, getToken, setIsWorker } = useAuth();
  const { updateWorkerInfo, getFullWorkerProfile } = useUserApi();
  const { showError, showSuccess } = useToast();
  const navigation = useNavigation();

  const [phone, setPhone] = useState('');
  const [prefix, setPrefix] = useState('+34');
  const [saving, setSaving] = useState(false);

  useOnboardingGuard({ currentStep: 'OnboardingPhone' });

  const handleSubmit = async () => {
    const cleanedPhone = phone.replace(/\s+/g, '');
    const isValidPhone = /^\d{9}$/.test(cleanedPhone);
    const isValidPrefix = phonePrefixes.some(p => p.code === prefix);

    if (!isValidPhone || !isValidPrefix) {
      Alert.alert('Número inválido', 'Introduce un teléfono con 9 dígitos y un prefijo válido.');
      return;
    }

    try {
      setSaving(true);
      const token = await getToken();

      await updateWorkerInfo(
        {
          workerId: isWorker?.worker_id,
          mobile_country_code: prefix,
          mobile_phone: cleanedPhone,
        },
        token
      );

      const updated = await getFullWorkerProfile(token);
      setIsWorker(updated);

      showSuccess('Teléfono guardado correctamente');
      navigation.navigate('OnboardingSuccess');
    } catch (err: any) {
      showError('Error guardando el teléfono');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SimpleLayout title="Tu teléfono" showBackButton>
      <View style={styles.wrapper}>
        <AppText variant="p" style={styles.intro}>
          Si lo deseas, añade tu número para facilitar la comunicación en caso de urgencia.
        </AppText>

        <PhoneInputGroup
          prefix={prefix}
          phone={phone}
          onChange={({ prefix, phone }) => {
            setPrefix(prefix);
            setPhone(phone);
          }}
        />

        <Button
          label="Finalizar registro"
          size="lg"
          variant="primary"
          onPress={handleSubmit}
          loading={saving}
          disabled={!phone || !prefix || saving}
          style={{ marginTop: spacing.lg }}
        />
      </View>
    </SimpleLayout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  intro: {
    marginBottom: spacing.md,
  },
});
