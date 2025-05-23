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

export default function OnboardingSuccessScreen() {
  const { getToken, setIsWorker } = useAuth();
  const { completeOnboarding, getMyWorkerProfile } = useWorkerApi();
  const { showError } = useToast();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const completeAndRedirect = async () => {
      try {
        const token = await getToken();
        await completeOnboarding(token);
        const updated = await getMyWorkerProfile(token);
        setIsWorker(updated);

        if (updated?.onboarding_completed) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Calendar' as never }],
          });
        } else {
          showError('Tu perfil no se ha actualizado correctamente.');
          setFailed(true);
        }
      } catch (err: any) {
        showError('Error finalizando el onboarding.');
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };

    completeAndRedirect();
  }, []);

  if (loading) return <AppLoader text="Cargando tu calendario..." />;

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
