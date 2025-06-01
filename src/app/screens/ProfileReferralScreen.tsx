// screens/ReferScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import AppText from '@/components/ui/AppText';
import * as Linking from 'expo-linking';
import { spacing } from '@/styles';
import SimpleLayout from '@/components/layout/SimpleLayout';
import { useAccessCodeApi } from '@/api/useAccessCodeApi';
import { useToast } from '../hooks/useToast';
import { trackEvent } from '../hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';   

export default function ProfileReferral() {
    const { isWorker } = useAuth();
    const { getAccessCode } = useAccessCodeApi();
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const { showError } = useToast();

    useEffect(() => {
        const fetchCode = async () => {
            if (!isWorker) return;
            const code = await getAccessCode(isWorker.workers_hospitals?.[0]?.hospital_id, isWorker.worker_type_id);
            setReferralCode(code);
        };
        fetchCode();
    }, [isWorker]);

    const workerTypeName = isWorker?.worker_types?.worker_type_name || 'tu rol';
    const shareMessage = `Hola 👋 Quiero invitarte a usar Tanda para gestionar tus turnos. Puedes descargarla desde https://apptanda.com/download y usar este código de acceso para tu hospital: *${referralCode}*, como *${workerTypeName}*.

¡Te va a encantar!`;

    const handleShare = async () => {
        const message = encodeURIComponent(shareMessage);
        const url = `whatsapp://send?text=${message}`;

        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
            Linking.openURL(url);
            trackEvent(EVENTS.SHARED_REFERRAL_CODE);
        } else {
            showError('WhatsApp no está instalado');
        }
    };

    return (
        <SimpleLayout title="Invitar a un compañero" showBackButton>
            <View style={styles.container}>
                <AppText variant='p' style={styles.body}>
                    Comparte Tanda con tus compañeros para que también puedan intercambiar turnos contigo.
                </AppText>
                <Button
                    label='Compartir por WhatsApp'
                    onPress={handleShare}
                    size='lg'
                    variant='primary'
                />
            </View>
        </SimpleLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        gap: spacing.md,
    },
    title: {
        marginBottom: spacing.sm
    },
    body: {
        marginBottom: spacing.lg
    },
    button: {
        alignSelf: 'center'
    },
});
