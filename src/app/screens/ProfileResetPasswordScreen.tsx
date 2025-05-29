import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import SimpleLayout from '@/components/layout/SimpleLayout';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import { useToast } from '@/app/hooks/useToast';
import { spacing } from '@/styles';
import { supabase } from '../../lib/supabase';

export default function ProfileResetPasswordScreen() {
    const { showSuccess, showError } = useToast();
    const [form, setForm] = useState({ password: '', confirm: '' });
    const [saving, setSaving] = useState(false);

    const handleChange = (key: 'password' | 'confirm', val: string) => {
        setForm({ ...form, [key]: val });
    };

    const validate = () => {
        if (form.password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
            return false;
        }
        if (form.password !== form.confirm) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSaving(true);
        const { error } = await supabase.updateUser({ password: form.password });
        setSaving(false);

        if (error) {
            showError('Error al actualizar la contraseña');
        } else {
            showSuccess('Contraseña actualizada correctamente');
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
                    size='lg'
                    variant="primary"
                    onPress={handleSubmit}
                    loading={saving}
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
