import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import InputField from '@/components/forms/InputField';
import InputFieldArea from '@/components/forms/InputFieldArea';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/app/hooks/useToast';
import { useShiftApi } from '@/api/useShiftApi';
import { formatFriendlyDate } from '@/utils/useFormatFriendlyDate';
import { shiftTypeLabels } from '@/utils/useLabelMap';
import { spacing } from '@/styles';
import SimpleLayout from '@/components/layout/SimpleLayout';
import AppLoader from '@/components/ui/AppLoader';
import FadeInView from '@/components/animations/FadeInView';
import AppText from '@/components/ui/AppText';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';

export default function EditShiftScreen() {
    const { accessToken, isWorker } = useAuth();
    const { getShiftById, updateShift } = useShiftApi();
    const { showSuccess, showError } = useToast();
    const navigation = useNavigation();
    const route = useRoute<any>();

    const { shiftId } = route.params;
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState('');
    const [requiresReturn, setRequiresReturn] = useState(true);
    const [shiftData, setShiftData] = useState<any>(null);



    useEffect(() => {
        const loadShift = async () => {
            try {
                const data = await getShiftById(shiftId, accessToken);
                setShiftData(data);
                setComments(data.shift_comments || '');
                setRequiresReturn(data.requires_return ?? true);
            } catch (err: any) {
                console.error('Error al cargar turno:', err.message);
                showError('Error al cargar turno');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        loadShift();
    }, [shiftId]);

    const handleSave = async () => {
        try {
            await updateShift(shiftId, { shift_comments: comments, requires_return: requiresReturn }, accessToken);
            showSuccess('Turno actualizado correctamente');
            setTimeout(() => navigation.navigate('Calendar'), 1000);
        } catch (err: any) {
            console.error('❌ Error actualizando turno:', err.message);
            showError('Error al actualizar turno');
        }
    };

    if (loading) return <AppLoader message="Cargando turno..." />;

    const shiftLabel = `${formatFriendlyDate(shiftData.date)} de ${shiftTypeLabels[shiftData.shift_type]}`;
    const specialityLabel = `${isWorker?.workers_specialities?.[0]?.specialities?.speciality_category || '—'}`;

    return (
        <FadeInView>
            <SimpleLayout title="Editar turno" showBackButton onBack={() => navigation.goBack()}>
                <View style={styles.page}>
                    <View style={styles.container}>
                        <InputField label="Turno" value={shiftLabel} editable={false} disabled />
                        <InputField label="Servicio" value={specialityLabel} editable={false} disabled />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <AppText style={{ fontSize: 16 }}>¿Requiere devolución?</AppText>
                            <Switch value={requiresReturn} onValueChange={setRequiresReturn} />
                        </View>
                        <InputFieldArea
                            label="Comentarios"
                            placeholder="Añade comentarios si lo deseas"
                            value={comments}
                            onChangeText={setComments}
                            multiline
                        />

                        <Button
                            label="Guardar cambios"
                            size="lg"
                            variant="primary"
                            style={{ marginTop: spacing.md }}
                            disabled={!comments.trim() && !requiresReturn}
                            onPress={() => {
                                handleSave();
                                trackEvent(EVENTS.EDIT_SHIFT_SAVE_BUTTON_CLICKED, { shiftId });
                            }}
                        />
                    </View>
                </View>
            </SimpleLayout>
        </FadeInView>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: spacing.md,
        gap: spacing.md,
        flex: 1,
    },
});
