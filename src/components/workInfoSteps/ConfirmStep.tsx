import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { spacing, colors } from '@/styles';

type Props = {
  hospitalName: string;
  workerTypeName: string;
  onConfirm: () => void;
};

export default function ConfirmStep({ hospitalName, workerTypeName, onConfirm }: Props) {
  return (
    <View style={styles.wrapper}>
      <AppText variant="h2" style={styles.title}>
        El código que has introducido te habilita Tanda como{' '}
        <AppText variant="h2" style={styles.highlight}>{workerTypeName}</AppText> en{' '}
        <AppText variant="h2" style={styles.highlight}>{hospitalName}</AppText>
      </AppText>


      <Button
        label="Confirmar cambio"
        size="lg"
        variant="primary"
        onPress={onConfirm}
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
  highlight: {
    color: colors.secondary, // o el que corresponda a tu diseño
  },
  button: {
    marginTop: spacing.lg,
  },
});
