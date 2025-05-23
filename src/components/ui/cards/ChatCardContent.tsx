import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import { ChatCircleText, Swap } from 'phosphor-react-native';
import { spacing, colors, typography } from '@/styles';
import { shiftTypeLabels } from '@/utils/useLabelMap';
import { getFriendlyDateParts } from '@/utils/useFormatFriendlyDate';

type Props = {
  otherPersonName: string;
  myDate: string;
  myType: string;
  otherDate: string;
  otherType: string;
};

export default function SwapCardContent({
  otherPersonName,
  myDate,
  myType,
  otherDate,
  otherType,
}: Props) {
  const my = getFriendlyDateParts(myDate);
  const other = getFriendlyDateParts(otherDate);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <ChatCircleText size={20} weight="fill" />
        <AppText variant='h3'>Chat con {otherPersonName}</AppText>
      </View>

      <View style={styles.row}>
        <Swap size={20} />
        <AppText variant='p' style={{ flex: 1 }}>
          Tú haces el {other.short} de {shiftTypeLabels[otherType]} por el {my.short} de {shiftTypeLabels[myType]}
        </AppText>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({

  iconBox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    borderColor: colors.gray[200],
    borderWidth: 1,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

});
