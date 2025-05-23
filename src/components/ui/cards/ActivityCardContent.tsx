import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import { formatFriendlyDateTime } from '@/utils/useFormatFriendlyDate';
import { spacing, colors, typography } from '@/styles';

type Props = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  date: string;
};

export default function ActivityCardContent({ icon, title, description, date }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconWrapper}>{icon}</View>
        <View style={styles.details}>
          <AppText variant='h3'>{title}</AppText>
          {description && <AppText variant='p'>{description}</AppText>}
          <View style={styles.dateWrapper}>
            <AppText variant='p' style={styles.date}>{formatFriendlyDateTime(date)}</AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    gap: 2,
  },
  date: {
    color: colors.muted,
  },
  dateWrapper: {
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  }
});
