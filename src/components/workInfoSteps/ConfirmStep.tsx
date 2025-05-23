import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { spacing } from '@/styles';

type Props = {
  hospitalName: string;
  workerTypeName: string;
  onConfirm: () => void;
  onBack: () => void;
};

export default function ConfirmStep({ hospitalName, workerTypeName, onConfirm }: Props) {
  return (
    <View style={styles.wrapper}>
      <AppText variant="h3" style={styles.title}>
        El código que has introducido te habilita como
      </AppText>

      <AppText variant="h2" style={styles.highlight}>
        {workerTypeName} en {hospitalName}
      </AppText>

      <Button
        label="Confirmar cambio"
        size="lg"
        variant="primary"
        onPress={onConfirm}
        style={styles.button}
      />
      <Button
        label="Volver"
        variant="outline"
        size="lg"
        onPress={onBack}
        style={{ marginTop: spacing.sm }}
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
  highlight: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.lg,
  },
});
