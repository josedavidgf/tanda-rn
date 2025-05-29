import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import { colors, spacing } from '@/styles';
import { ShiftStats as ShiftStatsType } from '@/utils/computeShiftStats';
import { shiftTypeIcons } from '@/utils/useLabelMap';

export default function ShiftStats({ stats }: { stats: ShiftStatsType }) {
  const shiftTypes = ['morning', 'evening', 'night', 'reinforcement'] as const;

  return (
    <View style={styles.container}>
      {shiftTypes.map((type) => {
        const Icon = shiftTypeIcons[type];
        const count = stats[type];
        if (!count) return null;

        return (
          <View key={type} style={styles.badge}>
            <Icon size={16} color={colors.primary} />
            <AppText style={styles.badgeText}>{count}</AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',

  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  badgeText: {
    color: colors.primary,
    marginLeft: 6,
  },
});
