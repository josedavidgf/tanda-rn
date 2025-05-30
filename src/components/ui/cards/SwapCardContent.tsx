import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import { UserFocus, Swap } from 'phosphor-react-native';
import { spacing, colors, typography } from '@/styles';
import { shiftTypeLabels } from '@/utils/useLabelMap';
import { getFriendlyDateParts } from '@/utils/useFormatFriendlyDate';
import { swapStatusLabels } from '@/utils/useLabelMap';

type Props = {
  otherPersonName: string;
  myDate: string;
  myType: string;
  otherDate: string;
  otherType: string;
  statusLabel: string; // 'pending', 'accepted', etc.
  swapType: string;
};

export default function SwapCardContent({
  otherPersonName,
  myDate,
  myType,
  otherDate,
  otherType,
  statusLabel,
  swapType,
}: Props) {
  const my = getFriendlyDateParts(myDate);
  const other = getFriendlyDateParts(otherDate);
  const statusText = swapStatusLabels[statusLabel];

  return (
    <View style={styles.container}>
      {/* Estado */}
      <View style={[styles.statusTag, styles[`tag_${statusLabel}`]]}>
        <AppText style={styles.statusLabel}>{statusText}</AppText>
      </View>

      {/* Persona */}
      <View style={styles.row}>
        <UserFocus size={20} weight="fill" color={colors.gray[900]} />
        <AppText variant='p' style={{ flex: 1 }}>Cambio con {otherPersonName}</AppText>
      </View>

      {/* Descripción */}
      {/* Descripción */}
      <View style={styles.row}>
        <Swap size={20} weight="fill" color={colors.gray[900]} />
        <AppText variant='p' style={{ flex: 1 }}>
          {swapType === 'no_return' && myDate && myType
            ? `Te proponen ceder tu turno del ${getFriendlyDateParts(myDate).short} de ${shiftTypeLabels[myType]}`
            : swapType === 'no_return'
              ? `Propones hacer el turno de ${getFriendlyDateParts(otherDate).short} de ${shiftTypeLabels[otherType]}`
              : `Tú haces el ${getFriendlyDateParts(otherDate).short} de ${shiftTypeLabels[otherType]} por el ${getFriendlyDateParts(myDate).short} de ${shiftTypeLabels[myType]}`
          }
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: 12,
    gap: spacing.sm,
  },
  statusTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusLabel: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colors.gray[900],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  // Estilos por estado (colores de fondo)
  tag_proposed: {
    backgroundColor: colors.gray[100],
  },
  tag_accepted: {
    backgroundColor: colors.success,
  },
  tag_rejected: {
    backgroundColor: colors.danger,
  },
  tag_cancelled: {
    backgroundColor: colors.danger,
  },
});
