import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Alert,
    TextInput,
    Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import AppLoader from '@/components/ui/AppLoader';
import SimpleLayout from '@/components/layout/SimpleLayout';
import SwapFeedbackModal from '@/components/modals/SwapFeedbackModal';
import ShiftCardContent from '@/components/ui/cards/ShiftCardContent';

import { useAuth } from '@/contexts/AuthContext';
import { useShiftApi } from '@/api/useShiftApi';
import { useSwapApi } from '@/api/useSwapApi';
import { useCalendarApi } from '@/api/useCalendarApi';

import { formatFriendlyDate } from '@/utils/useFormatFriendlyDate';
import { shiftTypeLabels } from '@/utils/useLabelMap';
import { spacing, colors, typography } from '@/styles';
import { useSwapPreferencesApi } from '@/api/useSwapPreferencesApi';
import ShiftSelector from '@/components/ui/ShiftSelector';


export default function ProposeSwap() {

    const navigation = useNavigation();
    const route = useRoute();
    const { accessToken, isWorker } = useAuth();
    const { getShiftById, getMyAvailableShifts } = useShiftApi();
    const { getShiftsForMonth } = useCalendarApi();
    const { getMySwapPreferences } = useSwapPreferencesApi();
    const { proposeSwap } = useSwapApi();

    const [targetShift, setTargetShift] = useState<any>(null);
    const [availableShifts, setAvailableShifts] = useState<any[]>([]);
    const [selectedShift, setSelectedShift] = useState<any>(null);
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(true);
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [submittedSwap, setSubmittedSwap] = useState<any>(null);

    const { shiftId } = route.params as { shiftId: string };

    useEffect(() => {
        const fetchData = async () => {
            const target = await getShiftById(shiftId, accessToken);
            const available = await getMyAvailableShifts(isWorker.worker_id, accessToken);
            const receiverId = target.worker?.worker_id;

            const receiverSchedules = await getShiftsForMonth(accessToken, receiverId);
            const preferences = await getMySwapPreferences(receiverId, accessToken);

            const receiverHasShift = new Set(receiverSchedules.map((r) => r.date));

            const enriched = available
                .filter((s) => !receiverHasShift.has(s.date))
                .map((s) => ({
                    ...s,
                    preferred: preferences.some(p => p.date === s.date && p.preference_type === s.type),
                }));

            setTargetShift(target);
            setAvailableShifts(enriched);
            setLoading(false);
        };

        fetchData();
    }, []);

    console.log('availableShifts', availableShifts);

    const handleSubmit = async () => {
        if (!selectedShift) {
            Alert.alert('Selecciona un turno para ofrecer');
            return;
        }

        try {
            const form = {
                offered_date: selectedShift.date,
                offered_type: selectedShift.type,
                offered_label: selectedShift.label || 'regular',
                swap_comments: comments,
            };


            const result = await proposeSwap(shiftId, form, accessToken);
            const enrichedSwap = {
                ...result,
                shift: targetShift, // turno objetivo
                shiftSelected: selectedShift, // turno ofrecido
            };
            setSubmittedSwap(enrichedSwap);
            setFeedbackVisible(true);
        } catch (err: any) {r
            Alert.alert('Error', err.message);
        }
    };

    if (loading || !targetShift) return <AppLoader message='Cargando propuesta...' onFinish={() => setLoading(false)} />;

    return (
        <>
            <SimpleLayout title="Proponer intercambio" showBackButton onBack={() => navigation.goBack()}>
                <ScrollView contentContainerStyle={styles.container}>
                    <AppText variant="p">Turno a intercambiar</AppText>
                    <AppText>{formatFriendlyDate(targetShift.date)} — {shiftTypeLabels[targetShift.shift_type]}</AppText>

                    <AppText variant="p" style={{ marginTop: 16 }}>Selecciona un turno tuyo</AppText>
                    <ShiftSelector
                        shifts={availableShifts}
                        selectedShiftId={selectedShift?.id}
                        onSelect={setSelectedShift}
                    />
                    <AppText variant="p" style={{ marginTop: 16 }}>Comentarios</AppText>
                    <TextInput
                        value={comments}
                        onChangeText={setComments}
                        placeholder="Escribe algo opcional..."
                        multiline
                        style={styles.input}
                    />

                    <Button
                        variant="primary"
                        style={{ marginTop: spacing.md }}
                        size='lg'
                        label="Enviar propuesta"
                        onPress={handleSubmit}
                        disabled={!selectedShift}
                    />
                </ScrollView>
            </SimpleLayout>

            <SwapFeedbackModal
                visible={feedbackVisible}
                swap={submittedSwap}
                onClose={() => {
                    setFeedbackVisible(false);
                    navigation.navigate('MySwaps');
                }}
            />
        </>
    );

}

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        gap: spacing.md,
    },
    input: {
        minHeight: 80,
        borderColor: colors.gray[300],
        color: colors.primary,
        borderWidth: 1,
        borderRadius: 8,
        padding: spacing.sm,
        textAlignVertical: 'top',
    },
});
