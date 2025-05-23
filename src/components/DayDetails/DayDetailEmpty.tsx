import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { CalendarPlus, Lightbulb } from '@/theme/icons';
//import { trackEvent } from '@/lib/amplitude';
import { EVENTS } from '@/utils/amplitudeEvents';
import { spacing, typography } from '@/styles';
import { colors } from '@/styles/utilities/colors';
import { formatFriendlyDate } from '@/utils/useFormatFriendlyDate';

type Props = {
  dateStr: string; // 'YYYY-MM-DD'
  dayLabel: string; // Ej: 'Hoy, 14/05'
  onAddShift: (dateStr: string) => void;
  onAddPreference: (dateStr: string) => void;
};

export default function DayDetailEmpty({
  dateStr,
  dayLabel,
  onAddShift,
  onAddPreference,
}: Props) {
  return (
    <View style={styles.container}>
      <AppText variant="h2">{dayLabel} - Día libre</AppText>
      <AppText variant="p">
        Hoy no tienes turno ni lo tienes seleccionado como disponible para trabajar.
      </AppText>

      <View style={styles.buttonGroup}>
        <Button
          label="Añadir turno"
          variant="primary"
          size="lg"
          leftIcon={<CalendarPlus size={20} color={colors.white} />}
          onPress={() => {
            //trackEvent(EVENTS.ADD_SINGLE_SHIFT_BUTTON_CLICKED, { day: dateStr });
            onAddShift(dateStr);
          }}
        />
        <Button
          label="Añadir disponibilidad"
          variant="secondary"
          size="lg"
          leftIcon={<Lightbulb size={20} color={colors.white} />}
          onPress={() => {
            //trackEvent(EVENTS.ADD_SINGLE_AVAILABILITY_BUTTON_CLICKED, { day: dateStr });
            onAddPreference(dateStr);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(245, 246, 248, 0.8)',
    borderRadius: 12,
    padding: spacing.md,
    width: '100%',
  },
  buttonGroup: {
    gap: spacing.sm,
    width: '100%',
    marginTop: spacing.sm,
  },
});