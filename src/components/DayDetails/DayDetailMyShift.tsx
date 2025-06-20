import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { Lightning, PencilSimple, Trash, CalendarBlank } from '@/theme/icons';
import { shiftTypeLabels, shiftTypeIcons } from '@/utils/useLabelMap';
import { EVENTS } from '@/utils/amplitudeEvents';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { colors } from '@/styles/utilities/colors';
import { spacing, typography } from '@/styles';
import { Schedule } from '@/types/calendar';
import { useNavigation } from '@react-navigation/native';
import { ShiftEntry } from '@/types/calendar';
import Chip from '../ui/Chip';


const ALL_TYPES = ['morning', 'evening', 'night', 'reinforcement'];

type Props = {
  dateStr: string;
  dayLabel: string;
  shift: ShiftEntry;
  isPublished: boolean;
  entry: any;
  onDeletePublication: (shiftId: string, dateStr: string) => void;
  onEditShift: (scheduleId: string, dateStr: string, type: string) => void;
  onRemoveShift: (dateStr: string) => void;
  onPublishShift: (shift: ShiftEntry) => void;
  loadingDeletePublication?: boolean;
  loadingRemoveShift: boolean;
  canAddSecondShift?: boolean;
  handleAddSecondShift?: (dateStr: string) => void;
  onOpenEditModal: (scheduleId: string, dateStr: string, currentType: ShiftType, availableTypes: ShiftType[]) => void;
};

export default function DayDetailMyShift({
  dateStr,
  dayLabel,
  shift,
  entry,
  isPublished,
  onDeletePublication,
  onEditShift,
  onRemoveShift,
  onPublishShift,
  loadingDeletePublication,
  loadingRemoveShift,
  canAddSecondShift,
  handleAddSecondShift,
  onOpenEditModal,
}: Props) {
  const hourRange = {
    morning: 'de 8:00 a 15:00',
    evening: 'de 15:00 a 22:00',
    night: 'de 22:00 a 08:00',
    reinforcement: '',
  };
  const navigation = useNavigation();

  const otherShift = entry.shifts?.find(s => s.source === 'manual' && s.type !== shift.type);
  const availableTypes = ALL_TYPES.filter(t => !otherShift || t !== otherShift.type);

  const textLine = `Tienes turno propio de ${shiftTypeLabels[shift.type]} ${hourRange[shift.type] || ''}`;

  // Validación para deshabilitar publicación si el día es anterior a hoy
  const isPastDate = new Date(dateStr) < new Date();

  return (
    <View style={[styles.container, styles[`shift_${shift.type}`]]}>
      <AppText variant="h2">{dayLabel}</AppText>

      <AppText variant="p">
        {textLine}
        {isPublished && (
          <AppText variant="p"> Tienes publicado el turno para cambiar.</AppText>
        )}
      </AppText>

      {isPublished ? (
        <>
          <View style={styles.buttonGroup}>
            <Button
              label="Editar publicación"
              variant="outline"
              size="lg"
              leftIcon={<Lightning size={20} color={colors.black} />}
              onPress={() => {
                trackEvent(EVENTS.EDIT_PUBLISH_OWN_SHIFT_BUTTON_CLICKED, {
                  shiftId: shift.shift_id,
                  day: dateStr,
                });
                navigation.navigate('EditShift', { shiftId: shift.shift_id });
              }}
            />
            <Button
              label="Quitar publicación"
              variant="outline"
              size="lg"
              leftIcon={<Trash size={20} color={colors.black} />}
              onPress={() => {
                trackEvent(EVENTS.REMOVE_PUBLISH_OWN_SHIFT_BUTTON_CLICKED, {
                  shiftId: shift.shift_id,
                  day: dateStr,
                });
                onDeletePublication(shift.shift_id, dateStr);
              }}
              loading={loadingDeletePublication}
              disabled={loadingDeletePublication}
            />
          </View>
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
                }}
              />
            </>
          )}
        </>
      ) : (
        <View style={styles.buttonGroup}>
          <Button
            label="Publicar turno"
            variant="primary"
            size="lg"
            leftIcon={<Lightning size={20} color={colors.white} />}
            onPress={() => {
              trackEvent(EVENTS.PUBLISH_OWN_SHIFT_BUTTON_CLICKED, {
                day: dateStr,
                shiftType: shift.shift_type,
              });
              navigation.navigate('CreateShift', {
                date: dateStr,
                shift_type: shift.type,
              });
            }}
            disabled={isPastDate} // Deshabilita si es una fecha pasada
          />
          <View style={styles.buttonGroupRow}>
            <Button
              label="Editar"
              size='md'
              variant="outline"
              leftIcon={<PencilSimple size={20} />}
              onPress={() => onOpenEditModal(shift.id, dateStr, shift.type, availableTypes)}
            />

            <Button
              label="Eliminar"
              variant="outline"
              size="md"
              leftIcon={<Trash size={20} color={colors.black} />}
              onPress={() => {
                trackEvent(EVENTS.DELETE_OWN_SHIFT_BUTTON_CLICKED, { day: dateStr });
                onRemoveShift(dateStr);
              }}
              loading={loadingRemoveShift}
              disabled={loadingRemoveShift}
            />
          </View>
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
                }}
              />
            </>
          )}
        </View>
      )}
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
  buttonGroupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
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