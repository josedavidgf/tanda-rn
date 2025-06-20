import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import SimpleLayout from '@/components/layout/SimpleLayout';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import { useToast } from '@/app/hooks/useToast';
import { spacing } from '@/styles';
import { supabase } from '../../lib/supabase';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';

export default function ProfileResetPasswordScreen() {
    const { showSuccess, showError } = useToast();
    const [form, setForm] = useState({ password: '', confirm: '' });
    const [saving, setSaving] = useState(false);

    const handleChange = (key: 'password' | 'confirm', val: string) => {
        setForm((prev) => ({ ...prev, [key]: val }));
    };

    const isDisabled =
        saving ||
        form.password.length < 6 ||
        form.confirm.length < 6 ||
        form.password !== form.confirm;

    const validate = () => {
        if (form.password.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres.');
            return false;
        }
        if (form.password !== form.confirm) {
            showError('Las contraseñas no coinciden.');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        trackEvent(EVENTS.RESET_PASSWORD_SUBMITTED);
        setSaving(true);
        const { error } = await supabase.updateUser({ password: form.password });
        setSaving(false);

        if (error) {
            showError('Error al actualizar la contraseña');
            trackEvent(EVENTS.RESET_PASSWORD_FAILED, { error: error.message });
        } else {
            showSuccess('Contraseña actualizada correctamente');
            trackEvent(EVENTS.RESET_PASSWORD_SUCCESS);
        }
    };

    return (
        <SimpleLayout title="Actualizar contraseña" showBackButton>
            <ScrollView contentContainerStyle={styles.container}>
                <InputField
                    label="Nueva contraseña"
                    placeholder="Introduce tu nueva contraseña"
                    value={form.password}
                    onChangeText={(val) => handleChange('password', val)}
                    secureTextEntry
                    textContentType="password"
                />

                <InputField
                    label="Repetir contraseña"
                    placeholder="Repite tu nueva contraseña"
                    value={form.confirm}
                    onChangeText={(val) => handleChange('confirm', val)}
                    secureTextEntry
                />
                <Button
                    label="Actualizar contraseña"
                    size="lg"
                    variant="primary"
                    onPress={handleSubmit}
                    loading={saving}
                    disabled={isDisabled}
                />
            </ScrollView>
        </SimpleLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        gap: spacing.md,
    },
});
