import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { calendarStyles as styles } from '@/styles/components/calendarStyles';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { shiftTypeIcons } from '@/utils/useLabelMap';
import type { CalendarEntry } from '@/types/calendar';
import chunk from 'lodash.chunk';
import { colors } from '@/styles';
import { PencilLine } from 'phosphor-react-native';
import type { ShiftType } from '@/types/calendar';


type Props = {
  calendarMap: Record<string, CalendarEntry>;
  selectedDate: Date;
  selectedMonth: Date;
  onSelectDate: (date: Date) => void;
};

export default function MonthlyGridCalendar({
  calendarMap,
  selectedDate,
  selectedMonth,
  onSelectDate,
}: Props) {
  const SHIFT_ORDER = ['morning', 'evening', 'night', 'reinforcement'] as const;
  const today = new Date();
  const firstDay = startOfMonth(selectedMonth);
  const lastDay = endOfMonth(selectedMonth);
  const allDays = eachDayOfInterval({ start: firstDay, end: lastDay });
  const offset = (getDay(firstDay) + 6) % 7;
  const paddedDays = Array(offset).fill(null).concat(allDays);
  const weeks = chunk(paddedDays, 7);


  const renderDay = (day: Date | null, index: number) => {
    if (!day) {
      return (
        <View key={`empty-${index}`} style={styles.calendarDayWrapper}>
          <View style={[styles.calendarDayContainer, { backgroundColor: 'transparent' }]} />
        </View>
      );
    }

    const dateStr = format(day, 'yyyy-MM-dd');
    const entry = calendarMap[dateStr] || {};
    const isSelected = dateStr === format(selectedDate, 'yyyy-MM-dd');
    const isPast = day < today;
    const isPreference = entry.isPreference;
    const shifts = entry.shifts ?? (entry.type ? [{
      type: entry.type,
      source: entry.source,
    }] : []);

    const orderedShifts = [...(entry.shifts ?? [])].sort((a, b) => {
      const order: ShiftType[] = ['morning', 'evening', 'night', 'reinforcement'];
      return order.indexOf(a.type) - order.indexOf(b.type);
    });

    const colorsByShift = colors.shift;

    let Icon = null;
    if (orderedShifts.length === 1) {
      Icon = shiftTypeIcons[orderedShifts[0].type];
    } else if (orderedShifts.length === 2) {
      const manual = orderedShifts.find(s => s.source === 'manual');
      Icon = shiftTypeIcons[(manual ?? orderedShifts[0]).type];
    }



    const shiftIcons = orderedShifts.map(s => shiftTypeIcons[s.type]);



    return (
      <View style={styles.calendarDayWrapper} key={dateStr}>
        <Pressable onPress={() => onSelectDate(day)} style={[styles.calendarDayContainer, isSelected && styles.selectedDay, isPast && styles.past]}>
          {orderedShifts.length === 2 ? (
            <>
              <View style={StyleSheet.absoluteFill}>
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  backgroundColor: colorsByShift[orderedShifts[0].type],
                }} />
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  backgroundColor: colorsByShift[orderedShifts[1].type],
                }} />
              </View>
            </>
          ) : orderedShifts.length === 1 ? (
            <View style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: colorsByShift[orderedShifts[0].type],
            }} />
          ) : null}

          <Text style={styles.calendarDayNumber}>{format(day, 'd')}</Text>
          {/* 1 solo turno */}
          {orderedShifts.length === 1 && (
            <View style={styles.calendarShiftIcon}>
              {React.createElement(shiftTypeIcons[orderedShifts[0].type], {
                size: 16,
                color: colors.primary,
              })}
            </View>
          )}

          {orderedShifts.length === 2 && (
            <>
              <View style={styles.calendarShiftIconUpperHalf}>
                {React.createElement(shiftTypeIcons[orderedShifts[0].type], {
                  size: 12,
                  color: colors.primary,
                })}
              </View>
              <View style={styles.calendarShiftIconLowerHalf}>
                {React.createElement(shiftTypeIcons[orderedShifts[1].type], {
                  size: 12,
                  color: colors.primary,
                })}
              </View>
            </>
          )}
          {isPreference && <View style={styles.calendarAvailabilityDot} />}
          {entry.hasComment && (
            <View style={{ position: 'absolute', bottom: 4, left: 4 }}>
              <PencilLine size={12} weight="regular" color={colors.primary} />
            </View>
          )}
        </Pressable>

      </View>
    );
  };


  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeaderRow}>
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((label, i) => (
          <Text key={`label-${i}`} style={styles.calendarHeaderDayText}>
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.weekRow}>
          {week.map((day, i) => renderDay(day, weekIndex * 7 + i))}
        </View>
      ))}
    </View>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}