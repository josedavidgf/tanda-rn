import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type OnboardingStackParamList = {
  OnboardingConfirm: {
    hospitalId: string;
    workerTypeId: string;
    hospitalName: string;
    workerTypeName: string;
  };
  // ...other routes if needed
};
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/app/hooks/useToast';
import { useAccessCodeApi } from '@/api/useAccessCodeApi';
import { useHospitalApi } from '@/api/useHospitalApi';
import { useWorkerApi } from '@/api/useWorkerApi';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useOnboardingGuard } from '@/app/hooks/useOnboardingGuard';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';
import { spacing } from '@/styles';

import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import AppLoader from '@/components/ui/AppLoader';
import SimpleLayout from '@/components/layout/SimpleLayout';

import AccessCodeInput from '@/components/forms/AccessCodeInput'; // adaptado a RN

export default function OnboardingCodeScreen() {
  const [code, setCode] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);

  const navigation = useNavigation<StackNavigationProp<OnboardingStackParamList>>();


  const { accessToken, loading, isWorker } = useAuth();
  const { validateAccessCode } = useAccessCodeApi();
  const { getHospitals } = useHospitalApi();
  const { getWorkerTypes } = useWorkerApi();
  const { setOnboardingData } = useOnboardingContext();
  const { showError } = useToast();

  console.log('[ONBOARDING] OnboardingCodeScreen rendered');

  useOnboardingGuard('code');

  console.log('[ONBOARDING] OnboardingCodeScreen - isWorker:', isWorker);
  if (loading) return <AppLoader onFinish={() => loading(false)} message='Cargando código...' />;

  const handleSubmit = async () => {
    try {
      if (code.length !== 4) {
        showError('Código inválido. Introduce los 4 dígitos del código.');
        return;
      }

      trackEvent(EVENTS.ONBOARDING_CODE_SUBMITTED, { code });
      setLoadingForm(true);

      const { hospital_id, worker_type_id } = await validateAccessCode(code);
      const hospitals = await getHospitals(accessToken);
      const workerTypes = await getWorkerTypes(accessToken);
      console.log('[ONBOARDING] Validando código:', code);
      const hospital = hospitals.find(h => h.hospital_id === hospital_id);
      const workerType = workerTypes.find(w => w.worker_type_id === worker_type_id);
      console.log('[ONBOARDING] Hospital encontrado:', hospital);
      console.log('[ONBOARDING] WorkerType encontrado:', workerType);
      if (!hospital || !workerType) {
        showError('Hospital o tipo de trabajador no encontrado. Verifica el código e intenta de nuevo.');
        return;
      }
      console.log('[ONBOARDING] Código validado correctamente:', code);
      // Guardar datos del paso actual092

      setOnboardingData({
        accessCode: code,
        hospitalId: hospital_id,
        workerTypeId: worker_type_id,
        hospitalName: hospital?.name || '',
        workerTypeName: workerType?.worker_type_name || ''
      });
      console.log('[ONBOARDING] Código validado correctamente:', {
        code,
        hospitalId: hospital_id,
        workerTypeId: worker_type_id,
      });

      trackEvent(EVENTS.ONBOARDING_CODE_SUCCESS, {
        code,
        hospitalId: hospital_id,
        workerTypeId: worker_type_id,
      });
      navigation.navigate('OnboardingConfirm', {
        hospitalId: hospital_id,
        workerTypeId: worker_type_id,
        hospitalName: hospital?.name || '',
        workerTypeName: workerType?.worker_type_name || '',
      });
    } catch (err: any) {
      showError('Código inválido o error al validar. Verifica e intenta de nuevo.');
      trackEvent(EVENTS.ONBOARDING_CODE_FAILED, {
        code,
        error: err.message,
      });
    } finally {
      setLoadingForm(false);
    }
  };
  const handleGoToLogin = () => {
    console.log('[Onboarding Code] Redirigiendo a Login');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as never }] // o 'Login' si tienes esa screen directamente
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <SimpleLayout title="Confirmar cuenta" showBackButton>

        <View style={styles.inner}>
          <AppText variant="h2" style={styles.title}>
            Bienvenido a la plataforma
          </AppText>

          <AppText variant="p" style={styles.description}>
            Para completar tu registro, introduce el código de acceso proporcionado por tus compañeros.
          </AppText>

          <AccessCodeInput code={code} setCode={setCode} />

          <Button
            label="Validar código"
            size='lg'
            variant="primary"
            onPress={handleSubmit}
            loading={loadingForm}
            disabled={code.length !== 4 || loadingForm}
            style={styles.button}
          />
          <Button
            label="Volver al login"
            size='lg'
            variant="ghost"
            onPress={handleGoToLogin}
          />
        </View>
      </SimpleLayout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'flex-start',
  },
  title: {
    marginBottom: spacing.md,
  },
  description: {
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.lg,
  },
});
