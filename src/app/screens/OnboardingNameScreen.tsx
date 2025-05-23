import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useUserApi } from '@/api/useUserApi';
import { useToast } from '@/app/hooks/useToast';
import { useOnboardingGuard } from '@/app/hooks/useOnboardingGuard';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import SimpleLayout from '@/components/layout/SimpleLayout';
import { spacing } from '@/styles';

export default function OnboardingNameScreen() {
  const navigation = useNavigation();
  const { isWorker, getToken, setIsWorker } = useAuth();
  const { updateWorkerInfo, getFullWorkerProfile } = useUserApi();
  const { showError, showSuccess } = useToast();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [saving, setSaving] = useState(false);

  useOnboardingGuard({ currentStep: 'OnboardingName' });

  const capitalizeWords = (str: string) =>
    str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const handleSubmit = async () => {
    if (!name.trim() || !surname.trim()) {
      Alert.alert('Rellena todos los campos');
      return;
    }

    try {
      setSaving(true);
      const token = await getToken();
      const formattedName = capitalizeWords(name.trim());
      const formattedSurname = capitalizeWords(surname.trim());

      await updateWorkerInfo(
        {
          workerId: isWorker?.worker_id,
          name: formattedName,
          surname: formattedSurname,
        },
        token
      );

      const updated = await getFullWorkerProfile(token);
      setIsWorker(updated);
      showSuccess('Información actualizada');
      navigation.navigate('OnboardingPhone');
    } catch (err: any) {
      console.error('❌ Error:', err.message);
      showError('Error guardando los datos.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SimpleLayout title="Tu nombre" showBackButton>
      <View style={styles.container}>
        <InputField
          label="Nombre"
          placeholder="Introduce tu nombre"
          value={name}
          onChangeText={setName}
        />

        <InputField
          label="Apellidos"
          placeholder="Introduce tus apellidos"
          value={surname}
          onChangeText={setSurname}
        />

        <Button
          label="Continuar"
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          loading={saving}
          disabled={!name || !surname || saving}
          style={{ marginTop: spacing.lg }}
        />
      </View>
    </SimpleLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
