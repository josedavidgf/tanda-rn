import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/app/hooks/useToast';
import { useAccessCodeApi } from '@/api/useAccessCodeApi';
import { useHospitalApi } from '@/api/useHospitalApi';
import { useWorkerApi } from '@/api/useWorkerApi';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useOnboardingGuard } from '@/app/hooks/useOnboardingGuard';
//import { trackEvent } from '@/lib/amplitude';
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

  const { getToken, loading, isWorker } = useAuth();
  const { validateAccessCode } = useAccessCodeApi();
  const { getHospitals } = useHospitalApi();
  const { getWorkerTypes } = useWorkerApi();
  const { setStepData } = useOnboardingContext();
  const { showError } = useToast();
  const navigation = useNavigation();

  useOnboardingGuard({ currentStep: 'OnboardingCode' });

  if (loading) return <Loader text="Cargando paso de onboarding..." />;

  const handleSubmit = async () => {
    try {
      if (code.length !== 4) {
        Alert.alert('Código inválido', 'Introduce los 4 dígitos del código.');
        return;
      }

      //trackEvent(EVENTS.ONBOARDING_CODE_SUBMITTED, { code });
      setLoadingForm(true);

      const { hospital_id, worker_type_id } = await validateAccessCode(code);
      const token = await getToken();
      const hospitals = await getHospitals(token);
      const workerTypes = await getWorkerTypes(token);

      const hospital = hospitals.find(h => h.hospital_id === hospital_id);
      const workerType = workerTypes.find(w => w.worker_type_id === worker_type_id);

      setStepData({
        accessCode: code,
        hospitalId: hospital_id,
        workerTypeId: worker_type_id,
        hospitalName: hospital?.name || '',
        workerTypeName: workerType?.worker_type_name || ''
      });

      /* trackEvent(EVENTS.ONBOARDING_CODE_SUCCESS, {
        code,
        hospitalId: hospital_id,
        workerTypeId: worker_type_id,
      }); */

      navigation.navigate('OnboardingConfirm');
    } catch (err: any) {
      showError('Código inválido o error al validar. Verifica e intenta de nuevo.');
      /* trackEvent(EVENTS.ONBOARDING_CODE_FAILED, {
        code,
        error: err.message,
      }); */
    } finally {
      setLoadingForm(false);
    }
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
