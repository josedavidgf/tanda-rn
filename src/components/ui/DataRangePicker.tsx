import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import Chip from '@/components/ui/Chip';
import SelectorInput from '@/components/forms/SelectorInput';
import { spacing, colors, typography } from '@/styles';

export default function DateRangePicker({ range, onChange }: { range: { startDate: Date, endDate: Date }, onChange: (r: { startDate: Date, endDate: Date }) => void }) {
    const [internalRange, setInternalRange] = useState(range);
    const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);
    const [calendarVisible, setCalendarVisible] = useState(false);

    const handleDayPress = (day: any) => {
        const selected = new Date(day.dateString);
        if (!internalRange.startDate || (internalRange.startDate && internalRange.endDate)) {
            setInternalRange({ startDate: selected, endDate: null });
            setSelecting('end');
        } else {
            const start = selected < internalRange.startDate ? selected : internalRange.startDate;
            const end = selected >= internalRange.startDate ? selected : internalRange.startDate;
            setInternalRange({ startDate: start, endDate: end });
            setSelecting(null);
            onChange({ startDate: start, endDate: end });
            setCalendarVisible(false);
        }
    };

    const handleQuickSelect = (key: 'today' | 'week' | 'month') => {
        let startDate, endDate;
        const now = new Date();
        if (key === 'today') startDate = endDate = now;
        if (key === 'week') {
            startDate = startOfWeek(now, { weekStartsOn: 1 });
            endDate = endOfWeek(now, { weekStartsOn: 1 });
        }
        if (key === 'month') {
            startDate = startOfMonth(now);
            endDate = endOfMonth(now);
        }
        setInternalRange({ startDate, endDate });
        setSelecting(null);
        setCalendarVisible(false);
        onChange({ startDate, endDate });
    };

    const markedDates = useMemo(() => {
        const { startDate, endDate } = internalRange;
        if (!startDate) return {};
        const dates: any = {};
        let day = startDate;
        while (day <= (endDate ?? startDate)) {
            const dateStr = format(day, 'yyyy-MM-dd');
            dates[dateStr] = {
                color: colors.secondary,
                textColor: '#fff',
                startingDay: dateStr === format(startDate, 'yyyy-MM-dd'),
                endingDay: dateStr === format(endDate ?? startDate, 'yyyy-MM-dd'),
            };
            day = addDays(day, 1);
        }
        return dates;
    }, [internalRange]);

    return (
        <View style={{ gap: spacing.md }}>
            <Pressable onPress={() => setCalendarVisible(!calendarVisible)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <SelectorInput
                        label="Rango de fechas"
                        value={`${format(internalRange.startDate, 'dd/MM')} – ${format(internalRange.endDate, 'dd/MM')}`}
                        onPress={() => setCalendarVisible(!calendarVisible)}
                    />
                </View>
            </Pressable>

            {calendarVisible && (
                <View style={{ gap: spacing.md }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
                        <Chip label="Hoy" onPress={() => handleQuickSelect('today')} />
                        <Chip label="Esta semana" onPress={() => handleQuickSelect('week')} />
                        <Chip label="Este mes" onPress={() => handleQuickSelect('month')} />
                    </View>

                    <Calendar
                        markingType="period"
                        markedDates={markedDates}
                        onDayPress={handleDayPress}
                        theme={{
                            textDayFontSize: 12,
                            textDayFontFamily: 'HostGrotesk-Regular',
                            textSectionTitleFontSize: 12,
                            textSectionTitleFontFamily: 'HostGrotesk-Bold',
                            textMonthFontSize: 14,
                            textMonthFontFamily: 'HostGrotesk-Bold',
                            monthTextColor: '#1E1E1E',
                            arrowColor: colors.primary,
                            todayTextColor: colors.primary,
                            selectedDayBackgroundColor: colors.primary,
                            selectedDayTextColor: '#fff',
                        }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({});
