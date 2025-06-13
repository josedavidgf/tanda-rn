import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import SimpleLayout from '@/components/layout/SimpleLayout';
import InputField from '@/components/forms/InputField';
import PhoneInputGroup from '@/components/forms/PhoneInputGroup';
import Button from '@/components/ui/Button';
import AppText from '@/components/ui/AppText';
import { useUserApi } from '@/api/useUserApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/app/hooks/useToast';
import { spacing } from '@/styles';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';

export default function ProfilePersonalInfo() {
    const { getFullWorkerProfile, updateWorkerInfo } = useUserApi();
    const { showSuccess, showError } = useToast();
    const { accessToken } = useAuth();

    const [form, setForm] = useState({
        name: '',
        surname: '',
        prefix: '+34',
        mobile_phone: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<{ mobile_phone?: boolean }>({});

    useEffect(() => {
        const fetch = async () => {
            const data = await getFullWorkerProfile(accessToken);

            const worker = data?.worker ?? data; // fallback si no viene anidado

            setForm({
                name: worker.name || '',
                surname: worker.surname || '',
                prefix: worker.prefix || '+34',
                mobile_phone: worker.mobile_phone || '',
            });

            setLoading(false);
        };
        fetch();
    }, []);


    const validate = () => {
        const cleanPhone = form.mobile_phone.replace(/[^0-9]/g, '');
        const phoneValid = /^[0-9]{9}$/.test(cleanPhone);
        setErrors({ mobile_phone: !phoneValid });
        if (!phoneValid) {
            showError('Teléfono inválido. El número de teléfono debe tener 9 dígitos');
            return false;
        }
        if (form.name.length < 2) {
            showError('Nombre inválido. El nombre debe tener al menos 2 caracteres');
            return false;
        }
        return phoneValid;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        trackEvent(EVENTS.PERSONAL_INFO_SUBMITTED, {
            name: form.name,
            surname: form.surname,
            prefix: form.prefix,
            mobile_phone: form.mobile_phone,
        });

        try {
            setSaving(true);
            await updateWorkerInfo(form, accessToken);
            showSuccess('Datos actualizados correctamente');
            trackEvent(EVENTS.PERSONAL_INFO_SUCCESS, {
                name: form.name,
                surname: form.surname,
                prefix: form.prefix,
                mobile_phone: form.mobile_phone,
            });
        } catch (err) {
            showError('No se pudo guardar la información');
            trackEvent(EVENTS.PERSONAL_INFO_FAILED, {
                name: form.name,
                surname: form.surname,
                prefix: form.prefix,
                mobile_phone: form.mobile_phone,
                error: err?.message,
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <SimpleLayout title="Información personal" showBackButton>
            <ScrollView contentContainerStyle={styles.container}>
                <InputField
                    label="Nombre"
                    value={form.name}
                    onChangeText={(val) => setForm({ ...form, name: val })}
                />
                <InputField
                    label="Apellidos"
                    value={form.surname}
                    onChangeText={(val) => setForm({ ...form, surname: val })}
                />
                <PhoneInputGroup
                    prefix={form.prefix}
                    phone={form.mobile_phone}
                    onChange={({ prefix, phone }) => setForm({ ...form, prefix, mobile_phone: phone })}
                />
                <Button
                    label="Guardar cambios"
                    size='lg'
                    variant="primary"
                    onPress={handleSubmit}
                    loading={saving} />
            </ScrollView>
        </SimpleLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        gap: spacing.xs,
    },
});
