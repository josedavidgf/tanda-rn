import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { calendarStyles as styles } from '@/styles/components/calendarStyles';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { shiftTypeIcons } from '@/utils/useLabelMap';
import type { CalendarEntry } from '@/types/calendar';
import chunk from 'lodash.chunk';
import { colors } from '@/styles';

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
    const isSwappedOut = entry.source === 'swapped_out';
    const Icon = !isSwappedOut && entry.shift_type ? shiftTypeIcons[entry.shift_type] : null;
    const shiftClass = !isSwappedOut && entry.shift_type ? styles[`shift${capitalize(entry.shift_type)}`] : null;


    return (
      <View style={styles.calendarDayWrapper}>
        <Pressable
          key={dateStr}
          onPress={() => onSelectDate(day)}
          style={[
            styles.calendarDayContainer,
            shiftClass,
            isSelected && styles.selectedDay,
            isPast && styles.past,
          ]}
        >
          <Text style={styles.calendarDayNumber}>{format(day, 'd')}</Text>
          {Icon && (
            <View style={styles.calendarShiftIcon}>
              <Icon size={16} color={colors.primary} />
            </View>
          )}
          {isPreference && <View style={styles.calendarAvailabilityDot} />}
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