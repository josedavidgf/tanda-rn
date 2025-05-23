import React, { useState } from 'react';
import { View, StyleSheet, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { useWorkerApi } from '@/api/useWorkerApi';
import { useToast } from '@/app/hooks/useToast';
import { useOnboardingGuard } from '@/app/hooks/useOnboardingGuard';
//import { trackEvent } from '@/lib/amplitude';
import { EVENTS } from '@/utils/amplitudeEvents';
import { spacing } from '@/styles';

import SimpleLayout from '@/components/layout/SimpleLayout';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';


export default function OnboardingConfirmScreen() {
    const { accessCode, hospitalId, workerTypeId, hospitalName, workerTypeName } = useOnboardingContext();
    const { getToken, setIsWorker } = useAuth();
    const { createWorker, createWorkerHospital, getMyWorkerProfile } = useWorkerApi();
    const { showError, showSuccess } = useToast();
    const navigation = useNavigation();

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [loading, setLoading] = useState(false);

    useOnboardingGuard({ currentStep: 'OnboardingConfirm' });

    const handleConfirm = async () => {
        if (!hospitalId || !workerTypeId) {
            Alert.alert('Faltan datos para crear el perfil.');
            return;
        }

        /* trackEvent(EVENTS.ONBOARDING_CONFIRM_SUBMITTED, {
          hospitalId,
          workerTypeId,
          acceptedTerms,
          acceptedPrivacy,
        }); */

        try {
            setLoading(true);
            const token = await getToken();
            const response = await createWorker({ workerTypeId }, token);
            if (!response?.success) throw new Error(response?.message);

            await createWorkerHospital(response.worker.worker_id, hospitalId, token);

            const newProfile = await getMyWorkerProfile(token);
            if (newProfile) {
                // Actualizar el contexto global manualmente
                setIsWorker(newProfile); // ❌ Actualmente no lo tienes disponible
            }


            //trackEvent(EVENTS.ONBOARDING_CONFIRM_SUCCESS, { hospitalId, workerTypeId });
            showSuccess('Cuenta creada con éxito');
            navigation.navigate('OnboardingSpeciality');
        } catch (err: any) {
            showError('Error creando el perfil. Intenta de nuevo.');
            //trackEvent(EVENTS.ONBOARDING_CONFIRM_FAILED, {
            //  error: err.message,
            //  hospitalId,
            //  workerTypeId,
            //});
        } finally {
            setLoading(false);
        }
    };

    return (
        <SimpleLayout title="Confirmar cuenta" showBackButton>
            <View style={styles.container}>
                <AppText variant="h3" style={styles.intro}>
                    El código te habilita como {workerTypeName} en {hospitalName}
                </AppText>

                <Checkbox
                    checked={acceptedTerms}
                    onChange={() => setAcceptedTerms(!acceptedTerms)}
                    label="He leído y acepto los Términos y Condiciones"
                />

                <Checkbox
                    checked={acceptedPrivacy}
                    onChange={() => setAcceptedPrivacy(!acceptedPrivacy)}
                    label="He leído y acepto la Política de Privacidad"
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
                    onPress={() => Linking.openURL('https://tally.so/r/3NOK0j')}
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
    intro: {
        marginBottom: spacing.md,
    },
});
