import React from 'react';
import { Modal, View, StyleSheet, Image } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { spacing, colors, typography } from '@/styles';
import illustration from '../../../assets/illustrations/illustration.png';
import { shiftTypeLabels } from '@/utils/useLabelMap';
import { formatFriendlyDate } from '@/utils/useFormatFriendlyDate';

type Props = {
  visible: boolean;
  swap: any;
  onClose: () => void;
};

export default function SwapFeedbackModal({ visible, swap, onClose }: Props) {
  if (!swap) return null;

  const isAccepted = swap.status === 'accepted';
  const isNoReturn = swap.swap_type === 'no_return';

  const shiftDate = formatFriendlyDate(swap.shift?.date);
  const shiftType = shiftTypeLabels[swap.shift?.shift_type];
  const workerName = `${swap.shift?.worker?.name ?? ''} ${swap.shift?.worker?.surname ?? ''}`;

  // Solo si es un swap regular
  const offeredDate = swap.offered_date ? formatFriendlyDate(swap.offered_date) : null;
  const offeredType = swap.offered_type ? shiftTypeLabels[swap.offered_type] : null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Image source={illustration} style={styles.image} resizeMode="contain" />
          <AppText variant='h2' style={styles.title}>
            {isAccepted
              ? `Turno aceptado con ${workerName}`
              : `Turno propuesto a ${workerName}`}
          </AppText>

          <AppText variant='p' style={styles.description}>
            {isNoReturn ? (
              <>Has ofrecido tu turno sin esperar devolución por el del {shiftDate} de {shiftType}.</>
            ) : (
              <>Has propuesto cambiar tu turno del {offeredDate} de {offeredType} por el del {shiftDate} de {shiftType}.</>
            )}
          </AppText>

          <AppText variant='p' style={styles.description}>
            {isAccepted
              ? `El intercambio se ha realizado automáticamente.`
              : `Ya hemos avisado a ${workerName}. Podrás ver el estado en “Mis cambios”.`}
          </AppText>

          <Button
            label="Genial"
            size='lg'
            variant='primary'
            style={{ marginTop: spacing.md }}
            onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 16,
    width: '90%',
    gap: spacing.md,
  },
  image: {
    width: '100%',
    height: 120,
  },
  title: {
  },
  description: {
  },
});
