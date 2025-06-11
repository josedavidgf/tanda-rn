import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import SimpleLayout from '@/components/layout/SimpleLayout';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import { spacing } from '@/styles';
import AppText from '@/components/ui/AppText';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/app/hooks/useToast';
import { useNavigation } from '@react-navigation/native';
import { useSupportApi } from '@/api/useSupportApi'; // Asegúrate de tener esta función
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';

export default function ProfileDeleteAccountScreen() {
    const navigation = useNavigation();
    const { showSuccess, showError } = useToast();
    const { sendSupportContact } = useSupportApi();

    const [form, setForm] = useState({
        description: '',
    });
    const [loading, setLoading] = useState(false);

    const isValid = form.description.trim();

    const handleSubmit = async () => {
        if (!isValid) return;
        setLoading(true);

        trackEvent(EVENTS.DELETE_ACCOUNT_SUBMITTED, {});

        try {
            await sendSupportContact('Borrar cuenta', form.description.trim());
            showSuccess('Mensaje enviado con éxito');
            trackEvent(EVENTS.DELETE_ACCOUNT_SUCCESS, {});
            setForm({ description: '' });
            navigation.navigate('ProfileMenu');
        } catch (err) {
            showError('No se pudo enviar el mensaje. Intenta más tarde.');
            trackEvent(EVENTS.DELETE_ACCOUNT_FAILED, {
                error: err?.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SimpleLayout title="Borrar cuenta" showBackButton>
            <ScrollView contentContainerStyle={styles.container}>
                <AppText variant="h2">Quieres borrar tu cuenta?</AppText>
                <AppText style={styles.paragraph}>
                    Escríbenos a través de este formulario y procederemos con el borrado.
                </AppText>

                <InputField
                    name="title"
                    label="Título del mensaje"
                    value="Borrar cuenta"
                    editable={false}
                    disabled
                />

                <View style={styles.textareaWrapper}>
                    <AppText variant="p">Descripción</AppText>
                    <TextInput
                        style={styles.textarea}
                        value={form.description}
                        onChangeText={(val) => setForm((prev) => ({ ...prev, description: val }))}
                        placeholder="Describe el problema que has tenido..."
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                    />
                </View>

                <Button
                    label="Enviar mensaje"
                    size='lg'
                    variant="primary"
                    onPress={handleSubmit}
                    disabled={!isValid}
                    loading={loading}
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
    paragraph: {
        color: '#666',
        marginBottom: spacing.sm,
    },
    textareaWrapper: {
        gap: spacing.xs,
    },
    textarea: {
        minHeight: 120,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: spacing.sm,
        fontSize: 16,
        backgroundColor: '#fff',
    },
});
