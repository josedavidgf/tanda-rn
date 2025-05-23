import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import { shiftTypeLabels, shiftTypeIcons } from '@/utils/useLabelMap';
import { UserFocus, Swap } from 'phosphor-react-native';
import { getFriendlyDateParts } from '@/utils/useFormatFriendlyDate';
import { spacing, colors, typography } from '@/styles';

type ShiftType = 'morning' | 'evening' | 'night' | 'reinforcement';

type Props = {
  date: string;
  type: ShiftType;
  workerName: string;
  swapsAccepted: number;
};

export default function ShiftCardContent({ date, type, workerName, swapsAccepted }: Props) {
  const Icon = type ? shiftTypeIcons[type] : null;
  const { label, short } = getFriendlyDateParts(date);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dateWrapper}>
          {Icon ? (
            <View style={[styles.icon, { backgroundColor: colors.shift[type] }]}>
              <Icon size={24} weight="fill" color="#fff" />
            </View>
          ) : (
            <View style={[styles.icon, { backgroundColor: colors.gray[200] }]} />
          )}

          <View style={styles.dateText}>
            <AppText variant='h3' style={styles.dateLabel}>{label}</AppText>
            <AppText variant='p' style={styles.dateShort}>{short}</AppText>
          </View>
        </View>
        <AppText variant='h3' style={styles.shiftType}>{shiftTypeLabels[type]}</AppText>
      </View>

      {/* Meta - Persona */}
      <View style={styles.metaRow}>
        <UserFocus size={20} weight="fill" color={colors.text} />
        <AppText variant='p'>{workerName}</AppText>
      </View>

      {/* Meta - Swaps */}
      <View style={styles.metaRow}>
        <Swap size={20} weight="fill" color={colors.text} />
        <AppText variant='p'>Cambios aceptados: {swapsAccepted}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  dateText: {
    alignContent: 'flex-start',
    justifyContent: 'center',
  },
  dateLabel: {
    fontWeight: '600',
  },
  dateShort: {
    marginTop: -4,
    fontWeight: '600',
  },
  shiftType: {
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
