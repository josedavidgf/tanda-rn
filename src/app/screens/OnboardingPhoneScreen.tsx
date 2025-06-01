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
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents'; 


export default function OnboardingPhoneScreen() {
  const { isWorker, accessToken, setIsWorker } = useAuth();
  const { updateWorkerInfo, getFullWorkerProfile } = useUserApi();
  const { showError, showSuccess } = useToast();
  const navigation = useNavigation();
  const { setOnboardingData } = useOnboardingContext();

  const [phone, setPhone] = useState('');
  const [prefix, setPrefix] = useState('+34');
  const [saving, setSaving] = useState(false);

  useOnboardingGuard('phone');

  const handleSubmit = async () => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const phoneValid = /^[0-9]{9}$/.test(cleanPhone);
  const isValidPrefix = phonePrefixes.some(p => p.code === prefix);

  if (!phoneValid) {
    Alert.alert('Número inválido', 'Introduce un teléfono con 9 dígitos y un prefijo válido.');
    return;
  }

  trackEvent(EVENTS.ONBOARDING_PHONE_SUBMITTED, {
    workerId: isWorker?.worker_id,
    prefix,
    phone: cleanPhone,
  });

  try {
    setSaving(true);

    await updateWorkerInfo(
      {
        workerId: isWorker?.worker_id,
        mobile_country_code: prefix,
        mobile_phone: cleanPhone,
      },
      accessToken
    );

    setOnboardingData({ prefix, mobilePhone: cleanPhone }); // ✅ coherencia con el contexto

    const updated = await getFullWorkerProfile(accessToken);
    setIsWorker(updated);

    showSuccess('Teléfono guardado correctamente');
    navigation.navigate('OnboardingSuccess');
  } catch (err: any) {
    trackEvent(EVENTS.ONBOARDING_PHONE_FAILED, {
      workerId: isWorker?.worker_id,
      prefix,
      phone: cleanPhone,
      error: err?.message,
    });
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
