import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { Lightning, PencilSimple, Trash } from '@/theme/icons';
import { shiftTypeLabels } from '@/utils/useLabelMap';
//import { trackEvent } from '@/lib/amplitude';
import { EVENTS } from '@/utils/amplitudeEvents';
import { colors } from '@/styles/utilities/colors';
import { spacing, typography } from '@/styles';
import { Schedule } from '@/types/calendar';
import { useNavigation } from '@react-navigation/native';
import CommentButton from '@/components/calendar/DayComment';


type Props = {
  dateStr: string;
  dayLabel: string;
  shift: Schedule;
  isPublished: boolean;
  onDeletePublication: (shiftId: string, dateStr: string) => void;
  onEditShift: (dateStr: string) => void;
  onRemoveShift: (dateStr: string) => void;
  onPublishShift: (shift: Schedule) => void;
  loadingDeletePublication?: boolean;
  loadingRemoveShift: boolean;
};

export default function DayDetailMyShift({
  dateStr,
  dayLabel,
  shift,
  isPublished,
  onDeletePublication,
  onEditShift,
  onRemoveShift,
  loadingDeletePublication,
  loadingRemoveShift,
}: Props) {
  const hourRange = {
    morning: 'de 8:00 a 15:00',
    evening: 'de 15:00 a 22:00',
    night: 'de 22:00 a 08:00',
    reinforcement: '',
  };
  const navigation = useNavigation();

  const textLine = `El ${dayLabel} tienes turno propio de ${shiftTypeLabels[shift.shift_type]} ${hourRange[shift.shift_type] || ''}`;

  console.log('🔁 Navegar a CreateShift con:', {
    date: dateStr,
    shift_type: shift.shift_type,
  });

  return (
    <View style={[styles.container, styles[`shift_${shift.shift_type}`]]}>
      <AppText variant="h2">
        {dayLabel}
      </AppText>

      <AppText variant="p">
        {textLine}
        {isPublished && (
          <AppText variant="p"> Tienes publicado el turno para cambiar.</AppText>
        )}
      </AppText>

      {isPublished ? (

        <View style={styles.buttonGroup}>
          <Button
            label="Quitar publicación"
            variant="outline"
            size="lg"
            leftIcon={<Trash size={20} color={colors.black} />}
            onPress={() => {
              //trackEvent(EVENTS.REMOVE_PUBLISH_OWN_SHIFT_BUTTON_CLICKED, { shiftId: shift.shift_id, day: dateStr });
              onDeletePublication(shift.shift_id, dateStr);
            }}
            loading={loadingDeletePublication}
            disabled={loadingDeletePublication}
          />
          <CommentButton dateStr={dateStr} />
        </View>

      ) : (
        <View style={styles.buttonGroup}>
          <Button
            label="Publicar turno"
            variant="primary"
            size="lg"
            leftIcon={<Lightning size={20} color={colors.white} />}
            onPress={() => {
              // trackEvent(EVENTS.PUBLISH_OWN_SHIFT_BUTTON_CLICKED, { day: dateStr, shiftType: shift.shift_type });
              navigation.navigate('CreateShift', {
                date: dateStr,
                shift_type: shift.shift_type,
              });
            }}
          />
          <View style={styles.buttonGroupRow}>
            <Button
              label="Editar"
              variant="outline"
              size="md"
              leftIcon={<PencilSimple size={20} color={colors.black} />}
              onPress={() => {
                //trackEvent(EVENTS.EDIT_OWN_SHIFT_BUTTON_CLICKED, { day: dateStr });
                onEditShift(dateStr);
              }}
            />
            <Button
              label="Eliminar"
              variant="outline"
              size="md"
              leftIcon={<Trash size={20} color={colors.black} />}
              onPress={() => {
                //trackEvent(EVENTS.DELETE_OWN_SHIFT_BUTTON_CLICKED, { day: dateStr });
                onRemoveShift(dateStr);
              }}
              loading={loadingRemoveShift}
              disabled={loadingRemoveShift}
            />
          </View>
          <CommentButton dateStr={dateStr} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
  buttonGroupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  shift_morning: { backgroundColor: 'rgba(255, 249, 219, 0.6)' },
  shift_evening: { backgroundColor: 'rgba(255, 226, 235, 0.6)' },
  shift_night: { backgroundColor: 'rgba(229, 234, 255, 0.6)' },
  shift_reinforcement: { backgroundColor: 'rgba(252, 224, 210, 0.6)' },
});