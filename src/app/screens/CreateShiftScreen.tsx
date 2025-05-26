import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/app/hooks/useToast';
import { useShiftApi } from '@/api/useShiftApi';
//import { trackEvent } from '@/lib/amplitude';
import { EVENTS } from '@/utils/amplitudeEvents';
import { shiftTypeLabels } from '@/utils/useLabelMap';
import { spacing } from '@/styles';
import { formatFriendlyDate } from '@/utils/useFormatFriendlyDate';
import SimpleLayout from '@/components/layout/SimpleLayout';
import AppLoader from '@/components/ui/AppLoader';

export default function CreateShiftScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { date, shift_type } = route.params || {}; // Creo que no se usa
    const { isWorker, getToken, loading: loadingWorker } = useAuth();
    const { showSuccess, showError } = useToast();
    const { createShift, loading: creatingShift } = useShiftApi();

    const [invalidParams, setInvalidParams] = useState(false);
    const [comments, setComments] = useState('');


    useEffect(() => {
        if (!isWorker) return;
        const speciality = isWorker?.workers_specialities?.[0];
        if (!date || !shift_type || !speciality?.speciality_id) {
            setInvalidParams(true);
            return;
        }
        setInvalidParams(false);
    }, [date, shift_type, isWorker]);

    useEffect(() => {
        if (!loadingWorker && invalidParams) {
            navigation.navigate('Calendar');
        }
    }, [invalidParams, loadingWorker]);

    const handleSubmit = async () => {
        try {
            const token = await getToken();
            const formToSend = {
                date,
                shift_type,
                speciality_id: specialityId,
                shift_comments: comments,
            };
            const success = await createShift(formToSend, token);

            /* trackEvent(EVENTS.PUBLISH_SHIFT_BUTTON_CLICKED, {
              date: form.date,
              shiftType: form.shift_type,
              specialityId: form.speciality_id,
              hasComments: !!form.shift_comments,
              commentsLength: form.shift_comments.length,
            }); */

            if (success) {
                showSuccess('Turno publicado correctamente');
                setTimeout(() => navigation.navigate('Calendar'), 1000);
            } else {
                showError('Error al publicar el turno');
            }
        } catch (err) {
            console.error('❌ Error creando turno:', err.message);
            showError('Error al publicar el turno');
        }
    };

    const specialityId = useMemo(() => {
        return isWorker?.workers_specialities?.[0]?.speciality_id || '';
    }, [isWorker]);

    const shiftLabel = useMemo(() => {
        if (!date || !shift_type) return '';
        return `${formatFriendlyDate(date)} de ${shiftTypeLabels[shift_type]}`;
    }, [date, shift_type]);

    const specialityLabel = useMemo(() => {
        return isWorker?.workers_specialities?.[0]?.specialities?.speciality_category || '';
    }, [isWorker]);


    if (loadingWorker) return <AppLoader onFinish={() => loadingWorker(false)} message='Cargando trabajador...' />;

    return (
        <SimpleLayout title="Publicar turno" showBackButton onBack={() => navigation.goBack()}>
            <View style={styles.page}>
                <View style={styles.container}>
                    <InputField
                        label="Turno"
                        value={shiftLabel}
                        editable={false}
                    />
                    <InputField
                        label="Servicio"
                        value={specialityLabel}
                        editable={false}
                    />
                    <InputField
                        label="Comentarios"
                        placeholder="Añade comentarios si lo deseas"
                        value={comments}
                        onChangeText={(text) => setComments(text)}
                        multiline
                    />

                    <Button
                        label="Publicar"
                        size="lg"
                        variant="primary"
                        onPress={handleSubmit}
                        loading={creatingShift}
                        disabled={creatingShift}
                    />
                </View>
            </View>
        </SimpleLayout>
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