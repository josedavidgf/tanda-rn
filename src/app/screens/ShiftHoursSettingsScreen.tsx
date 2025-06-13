import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import SimpleLayout from '@/components/layout/SimpleLayout';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { getWorkerShiftHours, setWorkerShiftHours } from '@/services/shiftHoursService';
import { shiftTypeLabels } from '@/utils/useLabelMap';
import { colors, spacing } from '@/styles';
import { useToast } from '@/app/hooks/useToast';
import { useNavigation } from '@react-navigation/native';


export default function ShiftHoursSettings() {
    const { isWorker, accessToken } = useAuth();
    const shiftTypes = ['morning', 'evening', 'night', 'reinforcement'] as const;
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<null | Record<typeof shiftTypes[number], string>>(null);
    const { showSuccess } = useToast();
    const navigation = useNavigation();

    useEffect(() => {
        const fetch = async () => {
            const data = await getWorkerShiftHours(accessToken, isWorker.worker_id);
            setForm({
                morning: data.morning.toString(),
                evening: data.evening.toString(),
                night: data.night.toString(),
                reinforcement: data.reinforcement.toString(),
            });
            setLoading(false);
        };
        fetch();
    }, []);

    const handleSave = async () => {
        await setWorkerShiftHours(
            accessToken,
            isWorker.worker_id,
            {
                morning: parseInt(form.morning),
                evening: parseInt(form.evening),
                night: parseInt(form.night),
                reinforcement: parseInt(form.reinforcement),
            }
        );
        showSuccess('Tus horas por turno se han actualizado');
        setTimeout(() => navigation.navigate('Stats'), 500);

    };

    return (
        <SimpleLayout
            title="Editar horas por turno"
            showBackButton
        >
            <ScrollView contentContainerStyle={styles.container}>
                {form !== null && !loading && shiftTypes.map((type) => (
                    <InputField
                        key={type}
                        label={`Horas - ${shiftTypeLabels[type]}`}
                        keyboardType="numeric"
                        value={form[type]}
                        onChangeText={(value) => setForm((f) => ({ ...f, [type]: value }))}
                    />
                ))}


                {form !== null && (
                    <Button
                        label="Guardar"
                        size="lg"
                        variant="primary"
                        disabled={loading}
                        onPress={handleSave}
                    />
                )}
            </ScrollView>
        </SimpleLayout>

    );
}
const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        gap: spacing.sm,
    },
});