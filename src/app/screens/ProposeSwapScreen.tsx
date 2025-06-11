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
import InputField from '@/components/forms/InputField';
import InputFieldArea from '@/components/forms/InputFieldArea';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';
import { track } from '@amplitude/analytics-react-native';
import { format } from 'date-fns';


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
            setLoading(true);
            const target = await getShiftById(shiftId, accessToken);
            const available = await getMyAvailableShifts(isWorker.worker_id || isWorker.worker.worker_id, accessToken);
            const receiverId = target.worker_id || target.worker?.worker_id;

            const receiverSchedules = await getShiftsForMonth(accessToken, receiverId);
            const preferences = await getMySwapPreferences(receiverId, accessToken);

            // Agrupamos turnos del receptor por día
            const receiverScheduleMap = new Map<string, string[]>(); // date => [shift_type]

            for (const shift of receiverSchedules) {
                if (!receiverScheduleMap.has(shift.date)) {
                    receiverScheduleMap.set(shift.date, []);
                }
                receiverScheduleMap.get(shift.date)!.push(shift.shift_type);
            }

            const enriched = available
                .filter((s) => {
                    const types = receiverScheduleMap.get(s.date) || [];
                    if (types.length >= 2) return false;
                    if (types.includes(s.type)) return false;
                    return true;
                })
                .map((s) => ({
                    ...s,
                    preferred: preferences.some(p => p.date === s.date && p.preference_type === s.type)
                }))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setTargetShift(target);
            setAvailableShifts(enriched);
            setLoading(false);
        };


        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (targetShift.requires_return && !selectedShift) {
            Alert.alert('Selecciona un turno para ofrecer');
            return;
        }

        try {
            const form: any = {
                swap_comments: comments,
            };

            if (targetShift.requires_return) {
                form.offered_date = selectedShift.date;
                form.offered_type = selectedShift.type;
                form.offered_label = selectedShift.label || 'regular';
            }

            track(EVENTS.SWAP_PROPOSAL_SUBMITTED, {
                offeredShiftDate: selectedShift?.date || '',
                offeredShiftType: selectedShift?.type || '',
                hasComments: comments || '',
                commentsLength: comments.length || 0,
                targetShiftId: shiftId,
            });

            const result = await proposeSwap(shiftId, form, accessToken);
            const enrichedSwap = {
                ...result,
                shift: targetShift, // turno objetivo
                shiftSelected: selectedShift, // turno ofrecido
            };
            setSubmittedSwap(enrichedSwap);
            setFeedbackVisible(true);
        } catch (err: any) {
            console.error('Error al enviar propuesta:', err);
            Alert.alert('Error', err.message);
        }
    };

    if (loading || !targetShift) return <AppLoader message='Cargando propuesta...' onFinish={() => setLoading(false)} />;
    const shiftDate = `${formatFriendlyDate(targetShift?.date)} — ${shiftTypeLabels[targetShift?.shift_type]}`;

    return (
        <>
            <SimpleLayout title="Proponer intercambio" showBackButton onBack={() => navigation.goBack()}>
                <ScrollView contentContainerStyle={styles.container}>
                    <InputField
                        label="Turno que recibirías"
                        value={shiftDate}
                        editable={false}
                        disabled
                    />
                    {targetShift.comments?.trim().length > 0 ? (
                        <InputFieldArea
                            label="Comentarios del turno"
                            value={targetShift.comments}
                            editable={false}
                        />
                    ) : (
                        <InputField
                            label="Comentarios del turno"
                            value="Sin comentarios"
                            editable={false}
                            disabled
                        />
                    )}
                    {!targetShift.requires_return && (
                        <>

                            <InputField
                                label="Tipología de intercambio"
                                value="Sin devolución"
                                disabled
                                editable={false}
                            />
                        </>
                    )}
                    {targetShift.requires_return && (
                        <>

                            <ShiftSelector
                                shifts={availableShifts}
                                selectedShiftId={selectedShift?.id}
                                onSelect={setSelectedShift}
                            />
                        </>
                    )}

                    <InputFieldArea
                        label="Comentarios opcionales"
                        value={comments}
                        onChangeText={setComments}
                        placeholder="Escribe algo opcional..."
                        multiline
                    />

                    <Button
                        variant="primary"
                        style={{ marginTop: spacing.md }}
                        size='lg'
                        label="Enviar propuesta"
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={targetShift.requires_return && !selectedShift}
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
