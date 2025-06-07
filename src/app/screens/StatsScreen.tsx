import React, { useMemo, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import SimpleLayout from '@/components/layout/SimpleLayout';
import MonthSelector from '@/components/calendar/MonthSelector';
import StatsPanel from '@/components/ui/StatsPanel';
import { computeShiftStats } from '@/utils/computeShiftStats';
import { useAuth } from '@/contexts/AuthContext';
import { useCalendarApi } from '@/api/useCalendarApi';
import type { CalendarEntry } from '@/types/calendar';
import { endOfMonth, startOfMonth, format } from 'date-fns';
import { colors, spacing } from '@/styles';
import { useIsWorkerReady } from '@/app/hooks/useIsWorkerReady';
import AppLoader from '@/components/ui/AppLoader';
import { PaintBrush } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { getWorkerShiftHours } from '@/services/shiftHoursService';


export default function StatsScreen() {
    const { accessToken, isWorker } = useAuth();
    const navigation = useNavigation();
    const { getShiftsForMonth } = useCalendarApi();
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [calendarMap, setCalendarMap] = useState<Record<string, CalendarEntry>>({});
    const { ready } = useIsWorkerReady();
    const [loading, setLoading] = useState(true);
    const [hoursPerShift, setHoursPerShift] = useState({
        morning: 7,
        evening: 7,
        night: 10,
        reinforcement: 6,
    });

    const shiftStats = useMemo(() => computeShiftStats(calendarMap, selectedMonth), [calendarMap, selectedMonth]);

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken || !isWorker?.worker_id) return;
            setLoading(true);

            try {
                const [schedules, hours] = await Promise.all([
                    getShiftsForMonth(accessToken, isWorker.worker_id),
                    getWorkerShiftHours(accessToken, isWorker.worker_id),
                ]);
                const map: Record<string, CalendarEntry> = {};

                schedules.forEach((item) => {
                    if (item.source !== 'swapped_out') {
                        if (!map[item.date]) map[item.date] = { shifts: [] };
                        map[item.date].shifts!.push({
                            type: item.shift_type,
                            source: item.source,
                        });

                    }
                });

                setCalendarMap(map);
                setHoursPerShift(hours);

            } catch (err) {
                console.error('Error loading calendar stats:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMonth, accessToken, isWorker]);

    if (!ready || loading) return <AppLoader message="Cargando estadísticas..." />;

    return (
        <SimpleLayout
            title="Horas y turnos"
            showBackButton
            rightAction={{
                label: 'Editar',
                icon: <PaintBrush size={20} color={colors.text.primary} weight="bold" />,
                onPress: () => navigation.navigate('ShiftHoursSettings'),
            }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
                    <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />
                </View>
                <StatsPanel
                    stats={shiftStats}
                    selectedMonth={selectedMonth}
                    hoursPerShiftByType={hoursPerShift}
                />
            </ScrollView>
        </SimpleLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        gap: spacing.xs,
    },
});
