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

export default function ProfileContactScreen() {
    const navigation = useNavigation();
    const { getToken } = useAuth();
    const { showSuccess, showError } = useToast();
    const { sendSupportContact } = useSupportApi();

    const [form, setForm] = useState({
        title: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);

    const isValid = form.title.trim() && form.description.trim();

    const handleSubmit = async () => {
        if (!isValid) return;
        setLoading(true);

        try {
            await sendSupportContact(form.title.trim(), form.description.trim());
            showSuccess('Mensaje enviado con éxito');
            setForm({ title: '', description: '' });
            navigation.navigate('ProfileMenu');
        } catch {
            showError('No se pudo enviar el mensaje. Intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SimpleLayout title="Contacto" showBackButton>
            <ScrollView contentContainerStyle={styles.container}>
                <AppText variant="h2">¿Tienes algún problema?</AppText>
                <AppText style={styles.paragraph}>
                    Cuéntanos brevemente qué ha pasado y te responderemos lo antes posible.
                </AppText>

                <InputField
                    name="title"
                    label="Título del mensaje"
                    placeholder="Por ejemplo: Error al publicar turno"
                    value={form.title}
                    onChangeText={(val) => setForm((prev) => ({ ...prev, title: val }))}
                    required
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
