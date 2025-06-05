import React from 'react';
import { View, StyleSheet } from 'react-native';
import InputField from '@/components/forms/InputField';
import Button from '@/components/ui/Button';
import AppText from '@/components/ui/AppText';
import { spacing } from '@/styles';
import { translateWorkerType } from '@/utils/useTranslateServices';

type Props = {
  worker: any;
  onChangeSpeciality: () => void;
  onChangeHospital: () => void;
};

export default function ViewStep({ worker, onChangeSpeciality, onChangeHospital }: Props) {
  const hospitalName = worker?.workers_hospitals?.[0]?.hospitals?.name || '';
  console.log('worker', worker);
  const role = translateWorkerType(worker?.worker_types?.worker_type_name || '');
  console.log('role', role);
  const speciality = worker?.workers_specialities?.[0]?.specialities?.speciality_category || '';

  return (
    <View style={styles.wrapper}>
      <AppText variant="p" style={styles.description}>
        Esta es tu situación profesional actual en Tanda. Puedes actualizarla si ha cambiado.
      </AppText>

      <InputField label="Hospital" value={hospitalName} editable={false} />
      <InputField label="Profesión" value={role} editable={false} />
      <InputField label="Servicio" value={speciality} editable={false} />

      <View style={styles.buttons}>
        <Button
          label="Cambiar especialidad"
          variant="primary"
          size="lg"
          onPress={onChangeSpeciality}
        />
        <Button
          label="Cambiar hospital"
          variant="outline"
          size="lg"
          onPress={onChangeHospital}
          style={styles.secondaryButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  description: {
    marginBottom: spacing.md,
  },
  buttons: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  secondaryButton: {
    marginTop: spacing.sm,
  },
});
