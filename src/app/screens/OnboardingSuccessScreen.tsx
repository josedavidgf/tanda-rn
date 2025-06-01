import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerApi } from '@/api/useWorkerApi';
import { useToast } from '@/app/hooks/useToast';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import AppLoader from '@/components/ui/AppLoader';
import { spacing } from '@/styles';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';

export default function OnboardingSuccessScreen() {
  const { accessToken, setIsWorker } = useAuth();
  const { completeOnboarding, getMyWorkerProfile } = useWorkerApi();
  const { showError } = useToast();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const completeAndRedirect = async () => {
      try {
        await completeOnboarding(accessToken);
        const updated = await getMyWorkerProfile(accessToken);
        setIsWorker(updated);

        if (updated?.onboarding_completed) {
          trackEvent(EVENTS.ONBOARDING_COMPLETED, { workerId: updated.worker_id });
          navigation.reset({
            index: 0,
            routes: [{ name: 'Calendar' as never }],
          });
        } else {
          trackEvent(EVENTS.ONBOARDING_SUCCESS_FAILED, { reason: 'Profile not updated' });
          showError('Tu perfil no se ha actualizado correctamente.');
          setFailed(true);
        }
      } catch (err: any) {
        trackEvent(EVENTS.ONBOARDING_SUCCESS_FAILED, { error: err?.message });
        showError('Error finalizando el onboarding.');
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };

    trackEvent(EVENTS.ONBOARDING_SUCCESS_CONFIRMED);
    completeAndRedirect();
  }, []);

  if (loading) return <AppLoader message='Cargando...' />;

  if (failed) {
    return (
      <View style={styles.errorScreen}>
        <AppText variant="h2">❌ Error al finalizar el onboarding</AppText>
        <AppText style={styles.text}>Redirígete manualmente al calendario.</AppText>
        <Button
          label="Ir al calendario"
          size="lg"
          variant="primary"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Calendar' as never }],
            })
          }
          style={{ marginTop: spacing.lg }}
        />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  errorScreen: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  text: {
    textAlign: 'center',
  },
});
