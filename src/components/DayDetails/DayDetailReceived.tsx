import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { ArrowRight } from '@/theme/icons';
import { shiftTypeLabels, shiftTypeIcons } from '@/utils/useLabelMap';
import { spacing, typography, colors } from '@/styles';
import { useNavigation } from '@react-navigation/native';
import { CalendarBlank, Lightning, Trash } from 'phosphor-react-native';
import { EVENTS } from '@/utils/amplitudeEvents';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { ShiftEntry } from '@/types/calendar';


type Props = {
  dateStr: string;
  dayLabel: string;
  entry: ShiftEntry;
  canAddSecondShift?: boolean;
  isPublished: boolean;
  onDeletePublication: (shiftId: string, dateStr: string) => void;
  handleAddSecondShift?: (dateStr: string) => void;
};

export default function DayDetailReceived({
  dateStr,
  dayLabel,
  entry,
  isPublished,
  onDeletePublication,
  canAddSecondShift,
  handleAddSecondShift,
}: Props) {
  const Icon = shiftTypeIcons[entry.type];
  const fullName = [entry.related_worker_name, entry.related_worker_surname]
    .filter(Boolean)
    .join(' ');
  const navigation = useNavigation();
  const hourRange = {
    morning: 'de 8:00 a 15:00',
    evening: 'de 15:00 a 22:00',
    night: 'de 22:00 a 08:00',
    reinforcement: '',
  };

  return (
    <View style={[styles.container, styles[`shift_${entry.type}`]]}>
      <AppText variant="h2">{dayLabel}</AppText>
      <View style={styles.infoRow}>
        <AppText variant="p">
          Turno de {shiftTypeLabels[entry.type]} {hourRange[entry.type]}
        </AppText>
      </View>
      {fullName && (
        <AppText variant="p">
          Cedido por: <AppText variant="p">{fullName}</AppText>
        </AppText>
      )}
      {/* revisar si aquí se necesita un botón para editar el turno publicado y el botón de quitar publicación */}
      <View style={styles.buttonGroup}>

        {isPublished ? (
          <>
            <Button
              label="Editar publicación"
              variant="outline"
              size="lg"
              leftIcon={<Lightning size={20} color={colors.black} />}
              onPress={() => {
                navigation.navigate('EditShift', { shiftId: entry.shift_id });
              }}
            />
            <Button
              label="Quitar publicación"
              variant="outline"
              size="lg"
              leftIcon={<Trash size={20} color={colors.black} />}
              onPress={() => onDeletePublication(entry.shift_id!, dateStr)}
            />
          </>
        ) : (
          <Button
            label="Publicar turno recibido"
            variant="primary"
            size="lg"
            leftIcon={<Lightning size={20} color={colors.white} />}
            onPress={() => {
              navigation.navigate('CreateShift', {
                date: dateStr,
                shift_type: entry.type,
              });
            }}
          />
        )}


        {entry.swap_id && (

          <Button
            label="Ver intercambio"
            variant="ghost"
            size="lg"
            leftIcon={<ArrowRight size={20} color={colors.primary} />}
            onPress={() => {
              trackEvent(EVENTS.SHOW_RECEIVED_SHIFT_DETAILS_BUTTON_CLICKED, { swapId: entry.swap_id });
              navigation.navigate('SwapDetails', { swapId: entry.swap_id });
            }}
          />
        )}
        {canAddSecondShift && (
          <>
            <View style={styles.divider} />
            <Button
              label="Añadir segundo turno"
              variant="outline"
              size="lg"
              leftIcon={<CalendarBlank size={20} color={colors.black} />}
              onPress={() => {
                trackEvent(EVENTS.ADD_SECOND_SHIFT_BUTTON_CLICKED, {
                  day: dateStr,
                });
                handleAddSecondShift(dateStr);
              }} />
          </>
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
  divider: {
    height: 1,
    backgroundColor: colors.primary,
    alignSelf: 'stretch',
    marginVertical: spacing.md
  },
});