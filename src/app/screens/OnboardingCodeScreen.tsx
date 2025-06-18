import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type OnboardingStackParamList = {
  OnboardingConfirm: {
    hospitalId: string;
    workerTypeId: string;
    hospitalName: string;
    workerTypeName: string;
    verificated?: boolean;
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
import CustomSelectorInput from '@/components/forms/CustomSelectorInput';
import AccessCodeInput from '@/components/forms/AccessCodeInput'; // adaptado a RN
import DividerText from '@/components/ui/DividerText';
import { translateWorkerType } from '@/utils/useTranslateServices'; // Asegúrate de que esta función esté definida

export default function OnboardingCodeScreen() {
  const [code, setCode] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);

  const navigation = useNavigation<StackNavigationProp<OnboardingStackParamList>>();


  const { accessToken, isWorker } = useAuth();
  const { validateAccessCode } = useAccessCodeApi();
  const { getHospitals } = useHospitalApi();
  const { getWorkerTypes } = useWorkerApi();
  const { setOnboardingData } = useOnboardingContext();
  const { showError } = useToast();
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [selectedWorkerType, setSelectedWorkerType] = useState<any>(null);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [loadingWorkerTypes, setLoadingWorkerTypes] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [workerTypes, setWorkerTypes] = useState([]);
  const [manualAccessVisible, setManualAccessVisible] = useState(false);


  console.log('[ONBOARDING] OnboardingCodeScreen rendered');

  useOnboardingGuard('code');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hospitalsRes, workerTypesRes] = await Promise.all([
          getHospitals(accessToken),
          getWorkerTypes(accessToken),
        ]);
        setHospitals(hospitalsRes);
        setWorkerTypes(workerTypesRes);
      } catch (e) {
        showError('Error cargando hospitales o profesiones');
      }
    };
    loadData();
  }, []);

  console.log('[ONBOARDING] OnboardingCodeScreen - isWorker:', isWorker);

  const handleManualContinue = () => {
    if (!selectedHospital || !selectedWorkerType) {
      showError('Debes seleccionar hospital y profesión');
      return;
    }

    trackEvent(EVENTS.ONBOARDING_MANUAL_SELECTION, {
      hospitalId: selectedHospital.hospital_id,
      workerTypeId: selectedWorkerType.worker_type_id,
    });

    setOnboardingData({
      hospitalId: selectedHospital.hospital_id,
      workerTypeId: selectedWorkerType.worker_type_id,
      hospitalName: selectedHospital.name,
      workerTypeName: selectedWorkerType.worker_type_name,
      verificated: false,
    });

    navigation.navigate('OnboardingConfirm', {
      hospitalId: selectedHospital.hospital_id,
      workerTypeId: selectedWorkerType.worker_type_id,
      hospitalName: selectedHospital.name,
      workerTypeName: selectedWorkerType.worker_type_name,
      verificated: false,
    });
  };


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
        workerTypeName: workerType?.worker_type_name || '',
        verificated: true,
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
        verificated: true,
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
          {!manualAccessVisible && (
            <>
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
            </>
          )}

          {!manualAccessVisible && (
            <Button
              label="No tengo código de acceso"
              size="lg"
              variant="ghost"
              onPress={() => setManualAccessVisible(true)}
              style={styles.button}
            />
          )}
          {manualAccessVisible && (
            <>
              <AppText variant="p" style={styles.description}>
                Para completar tu registro, selecciona tu hospital y profesión. Tu cuenta será revisada antes de habilitar todas las funciones.
              </AppText>

              <CustomSelectorInput
                name="hospital"
                label="Hospital"
                value={selectedHospital?.hospital_id || null}
                options={hospitals.map(h => ({ value: h.hospital_id, label: h.name }))}
                onChange={(hospitalId) => {
                  const hospital = hospitals.find(h => h.hospital_id === hospitalId);
                  setSelectedHospital(hospital || null);
                }}
              />

              <CustomSelectorInput
                name="workerType"
                label="Profesión"
                value={selectedWorkerType?.worker_type_id || null}
                options={workerTypes.map(w => ({ value: w.worker_type_id, label: translateWorkerType(w.worker_type_name) }))}
                onChange={(workerTypeId) => {
                  const workerType = workerTypes.find(w => w.worker_type_id === workerTypeId);
                  setSelectedWorkerType(workerType || null);
                }}
              />
              <Button
                label="Continuar sin código"
                size="lg"
                variant="secondary"
                onPress={handleManualContinue}
                style={styles.button}
              />
              <Button
                label="Tengo código de acceso"
                size="lg"
                variant="ghost"
                onPress={() => setManualAccessVisible(false)}
                style={styles.button}
              />
            </>
          )}

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
