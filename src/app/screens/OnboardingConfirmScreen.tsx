import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useWorkerApi } from '@/api/useWorkerApi';
import { useToast } from '@/app/hooks/useToast';
import { useOnboardingGuard } from '@/app/hooks/useOnboardingGuard';
import { spacing, colors } from '@/styles';

import SimpleLayout from '@/components/layout/SimpleLayout';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import AppLoader from '@/components/ui/AppLoader';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';
import { translateWorkerType } from '@/utils/useTranslateServices';
import { getDbWithAuth } from '@/lib/supabase';


export default function OnboardingConfirmScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { accessCode, setOnboardingData } = useOnboardingContext();
  const { isWorker, accessToken, setIsWorker } = useAuth();
  const { createWorker, createWorkerHospital, getMyWorkerProfile } = useWorkerApi();
  const { showError, showSuccess } = useToast();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);

  const { hospitalId, workerTypeId, hospitalName, workerTypeName } = route.params as {
    hospitalId: string;
    workerTypeId: string;
    hospitalName: string;
    workerTypeName: string;
  };

  useOnboardingGuard('confirm');

  useEffect(() => {
    setOnboardingData({
      accessCode,
      hospitalId,
      workerTypeId,
      hospitalName,
      workerTypeName,
    });
  }, [hospitalId, workerTypeId, hospitalName, workerTypeName]);

  if (!isWorker?.worker_id) return <AppLoader onFinish={() => setLoading(false)} message="Cargando trabajador..." />;

  const handleConfirm = async () => {
    if (!hospitalId || !workerTypeId) {
      showError('Faltan datos para crear el perfil.');
      return;
    }

    trackEvent(EVENTS.ONBOARDING_CONFIRM_SUBMITTED, {
      hospitalId,
      workerTypeId,
      hospitalName,
      workerTypeName,
    });

    try {
      setLoading(true);
      const response = await createWorker({ workerTypeId }, accessToken);
      if (!response?.success) throw new Error(response?.message);

      await createWorkerHospital(response.worker.worker_id, hospitalId, accessToken);

      // Guardar aceptación legal (versión hardcoded)
      const db = await getDbWithAuth(accessToken);
      await db.from('legal_acceptance').insert({
        worker_id: response.worker.worker_id,
        terms_version: 'v1',
        privacy_version: 'v1',
        user_agent: 'react-native',
      });

      const newProfile = await getMyWorkerProfile(accessToken);
      if (newProfile) {
        setIsWorker(newProfile);
      }

      trackEvent(EVENTS.ONBOARDING_CONFIRM_SUCCESS, {
        workerId: response.worker.worker_id,
        hospitalId,
        workerTypeId,
      });

      showSuccess('Cuenta creada con éxito');
      navigation.navigate('OnboardingSpeciality');
    } catch (err: any) {
      trackEvent(EVENTS.ONBOARDING_CONFIRM_FAILED, {
        hospitalId,
        workerTypeId,
        error: err?.message,
      });
      showError('Error creando el perfil. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleLayout title="Confirmar cuenta" showBackButton>
      <View style={styles.container}>
        <AppText variant="h2" style={styles.intro}>
          El código que has introducido te habilita Tanda como{' '}
          <AppText variant="h2" style={styles.highlight}>{translateWorkerType(workerTypeName)}</AppText> en{' '}
          <AppText variant="h2" style={styles.highlight}>{hospitalName}</AppText>
        </AppText>

        <Checkbox
          checked={acceptedTerms}
          onChange={() => setAcceptedTerms(!acceptedTerms)}
          label={
            <>
              He leído y acepto los{' '}
              <AppText
                variant="link"
                onPress={() => Linking.openURL('https://apptanda.com/legal/terminos-y-condiciones')}
              >
                Términos y Condiciones
              </AppText>
            </>
          }
        />

        <Checkbox
          checked={acceptedPrivacy}
          onChange={() => setAcceptedPrivacy(!acceptedPrivacy)}
          label={
            <>
              He leído y acepto la{' '}
              <AppText
                variant="link"
                onPress={() => Linking.openURL('https://apptanda.com/legal/politica-privacidad')}
              >
                Política de Privacidad
              </AppText>
            </>
          }
        />

        <Button
          label="Crear cuenta"
          size="lg"
          variant="primary"
          onPress={handleConfirm}
          loading={loading}
          disabled={!acceptedTerms || !acceptedPrivacy || loading}
          style={{ marginTop: spacing.lg }}
        />

        <Button
          label="Contactar con Tanda"
          size="lg"
          variant="outline"
          onPress={() => {
            trackEvent(EVENTS.ONBOARDING_CONTACT_CLICKED);
            Linking.openURL('https://tally.so/r/3NOK0j');
          }}
          disabled={loading}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </SimpleLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  highlight: {
    color: colors.secondary,
  },
  intro: {
    marginBottom: spacing.md,
  },
});
