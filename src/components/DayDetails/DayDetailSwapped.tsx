import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { Lightning, Lightbulb, Eye } from '@/theme/icons';
import { spacing, typography, colors } from '@/styles';
import { EVENTS } from '@/utils/amplitudeEvents';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { useNavigation } from '@react-navigation/native';

type Props = {
  dateStr: string;
  dayLabel: string;
  entry: {
    shift_type: 'morning' | 'evening' | 'night';
    requester_id: string;
    worker_id: string;
    related_worker_name?: string;
    related_worker_surname?: string;
    swap_id?: string;
  };
  onAddShift: (dateStr: string) => void;
  onAddPreference: (dateStr: string) => void;
  navigate: (path: string) => void;
};

export default function DayDetailSwapped({
  dateStr,
  dayLabel,
  entry,
  onAddShift,
  onAddPreference,
  navigate,
}: Props) {
  const fullName = [entry.related_worker_name, entry.related_worker_surname]
    .filter(Boolean)
    .join(' ');

  const isRequester = entry.requester_id === entry.worker_id;
  const navigation = useNavigation();

  const hourRange = {
    morning: 'de 8:00 a 15:00',
    evening: 'de 15:00 a 22:00',
    night: 'de 22:00 a 08:00',
  };

  const description = isRequester
    ? `Tenías turno de ${entry.shift_type} ${hourRange[entry.shift_type]}. Te lo ha cambiado ${fullName || 'otro trabajador'}.`
    : `Le cambiaste el turno a ${fullName || 'otro trabajador'}. Hoy no tienes turno ni disponibilidad marcada.`;

  return (
    <View style={styles.container}>
      <AppText variant="h2">{dayLabel} - Día libre</AppText>
      <AppText variant="p">{description}</AppText>

      <View style={styles.buttonGroup}>
        <Button
          label="Añadir turno"
          variant="primary"
          size="lg"
          leftIcon={<Lightning size={20} color={colors.white} />}
          onPress={() => {
            trackEvent(EVENTS.ADD_SINGLE_SHIFT_BUTTON_CLICKED, { day: dateStr });
            onAddShift(dateStr);
          }}
        />
        <Button
          label="Añadir disponibilidad"
          variant="secondary"
          size="lg"
          leftIcon={<Lightbulb size={20} color={colors.white} />}
          onPress={() => {
            trackEvent(EVENTS.ADD_SINGLE_AVAILABILITY_BUTTON_CLICKED, { day: dateStr });
            onAddPreference(dateStr);
          }}
        />
        {entry.swap_id && (
          <Button
            label="Ver detalles"
            variant="ghost"
            size="lg"
            leftIcon={<Eye size={20} color={colors.black} />}
            onPress={() => {
              trackEvent(EVENTS.SHOW_SWAPPED_SHIFT_DETAILS_BUTTON_CLICKED, { swapId: entry.swap_id });
              navigation.navigate('SwapDetails', { swapId: entry.swap_id });
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(245, 246, 248, 0.8)',
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
});