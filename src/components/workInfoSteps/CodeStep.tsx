import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import AccessCodeInput from '@/components/forms/AccessCodeInput';
import { spacing } from '@/styles';

type Props = {
  code: string;
  setCode: (val: string) => void;
  onValidate: () => void;
};

export default function CodeStep({ code, setCode, onValidate }: Props) {
  return (
    <View style={styles.wrapper}>
      <AppText variant="h3" style={styles.title}>Introduce el código de invitación</AppText>
      <AppText variant="p" style={styles.description}>
        Pregunta a tus compañeros por el código de invitación. Así aseguramos mayor privacidad.
      </AppText>

      <AccessCodeInput code={code} setCode={setCode} />

      <Button
        label="Validar"
        size="lg"
        variant="primary"
        onPress={onValidate}
        disabled={code.length !== 4}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  description: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.lg,
  },
});
