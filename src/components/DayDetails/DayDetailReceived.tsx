import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { ArrowRight } from '@/theme/icons';
import { shiftTypeLabels, shiftTypeIcons } from '@/utils/useLabelMap';
import { spacing, typography, colors } from '@/styles';
import { useNavigation } from '@react-navigation/native';
import { Lightning } from 'phosphor-react-native';
import { EVENTS } from '@/utils/amplitudeEvents';
import { trackEvent } from '@/app/hooks/useTrackPageView';


type Props = {
  dateStr: string;
  dayLabel: string;
  entry: {
    shift_type: 'morning' | 'evening' | 'night' | 'reinforcement';
    related_worker_name?: string;
    related_worker_surname?: string;
    swap_id?: string;
  };
};

export default function DayDetailReceived({
  dateStr,
  dayLabel,
  entry,
}: Props) {
  const Icon = shiftTypeIcons[entry.shift_type];
  const fullName = [entry.related_worker_name, entry.related_worker_surname]
    .filter(Boolean)
    .join(' ');
  const navigation = useNavigation();
  console.log('entry', entry);
  console.log('trabajador', fullName);
  const hourRange = {
    morning: 'de 8:00 a 15:00',
    evening: 'de 15:00 a 22:00',
    night: 'de 22:00 a 08:00',
    reinforcement: '',
  };

  return (
    <View style={[styles.container, styles[`shift_${entry.shift_type}`]]}>
      <AppText variant="h2">{dayLabel}</AppText>
      <View style={styles.infoRow}>
        {Icon && <Icon size={20} weight="fill" color={colors.white} />}
        <AppText variant="p">
          Turno de {shiftTypeLabels[entry.shift_type]} {hourRange[entry.shift_type]}
        </AppText>
      </View>
      {fullName && (
        <AppText variant="p">
          Cedido por: <AppText variant="p">{fullName}</AppText>
        </AppText>
      )}
      {/* revisar si aquí se necesita un botón para editar el turno publicado y el botón de quitar publicación */}
      <View style={styles.buttonGroup}>

        <Button
          label="Publicar turno recibido"
          variant="primary"
          size="lg"
          leftIcon={<Lightning size={20} color={colors.white} />}
          onPress={() => {
            trackEvent(EVENTS.PUBLISH_RECEIVED_SHIFT_BUTTON_CLICKED, { day: dateStr, shiftType: entry.shift_type });
            navigation.navigate('CreateShift', {
              date: dateStr,
              shift_type: entry.shift_type,
            });
          }}
        />

        {entry.swap_id && (

          <Button
            label="Ver intercambio"
            variant="ghost"
            size="lg"
            leftIcon={<ArrowRight size={20} color={colors.white} />}
            onPress={() => {
              trackEvent(EVENTS.SHOW_RECEIVED_SHIFT_DETAILS_BUTTON_CLICKED, { swapId: entry.swap_id });
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
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
  infoRow: {
    gap: spacing.xs,
  },
  shift_morning: { backgroundColor: 'rgba(255, 249, 219, 0.6)' },
  shift_evening: { backgroundColor: 'rgba(255, 226, 235, 0.6)' },
  shift_night: { backgroundColor: 'rgba(229, 234, 255, 0.6)' },
  shift_reinforcement: { backgroundColor: 'rgba(252, 224, 210, 0.6)' },
});