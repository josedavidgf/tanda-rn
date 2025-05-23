import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { format, addMonths, subMonths } from 'date-fns';
import es from 'date-fns/locale/es';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { spacing } from '@/styles';
import AppText from '@/components/ui/AppText';

type Props = {
  selectedMonth: Date;
  onChange: (newMonth: Date) => void;
};

export default function MonthSelector({ selectedMonth, onChange }: Props) {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const goToPreviousMonth = () => {
    const newDate = subMonths(selectedMonth, 1);
    onChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = addMonths(selectedMonth, 1);
    onChange(newDate);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={goToPreviousMonth} style={styles.arrowButton}>
        <CaretLeft size={24} weight="bold" />
      </Pressable>

      <AppText variant="h3" style={styles.label}>
        {capitalize(format(selectedMonth, 'MMMM yyyy', { locale: es }))}
      </AppText>

      <Pressable onPress={goToNextMonth} style={styles.arrowButton}>
        <CaretRight size={24} weight="bold" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  arrowButton: {
    padding: spacing.xs,
  },
  label: {
    fontWeight: '700',
  },
});
