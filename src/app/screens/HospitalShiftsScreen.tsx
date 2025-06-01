import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AppLayout from '@/components/layout/AppLayout';
import AppLoader from '@/components/ui/AppLoader';
import HospitalShiftsTable from '@/components/lists/HospitalShiftsTable';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useShiftApi } from '@/api/useShiftApi';
import { useSwapApi } from '@/api/useSwapApi';
import { shiftTypeLabels, shiftTypeIcons } from '@/utils/useLabelMap';
import Chip from '@/components/ui/Chip';
import { ScrollView } from 'react-native';
//import DateRangeFilter from '@/components/ui/DateRangeFilter';
import DateRangePicker from '@/components/ui/DataRangePicker';
import { startOfMonth, endOfMonth } from 'date-fns';
import { spacing } from '@/styles';
import FadeInView from '@/components/animations/FadeInView';
import { margin } from '@/styles/utilities/spacing';
import EmptyState from '@/components/ui/EmptyState';
import { EVENTS } from '@/utils/amplitudeEvents';
import { trackEvent } from '@/app/hooks/useTrackPageView';

type ShiftType = 'morning' | 'evening' | 'night' | 'reinforcement';


export default function HospitalShiftsScreen() {
    const { accessToken, isWorker } = useAuth();
    const { getHospitalShifts } = useShiftApi();

    const { getSentSwaps } = useSwapApi();
    const navigation = useNavigation();
    const shiftTypes = ['morning', 'evening', 'night', 'reinforcement'] as const;
    const [selectedTypes, setSelectedTypes] = useState<ShiftType[]>([]);
    const [dateRange, setDateRange] = useState({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
    });
    const [shifts, setShifts] = useState<any[]>([]);
    const [sentSwapShiftIds, setSentSwapShiftIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [onlyNoReturn, setOnlyNoReturn] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [shiftData, sentSwaps] = await Promise.all([
                getHospitalShifts(accessToken),
                getSentSwaps(accessToken),
            ]);

            setShifts(shiftData);

            const proposedShiftIds = sentSwaps
                .filter((s: any) => s.status === 'proposed')
                .map((s: any) => s.shift_id);

            setSentSwapShiftIds(proposedShiftIds);
            setLoading(false);
        };

        fetchData();
    }, []);


    if (loading) return <AppLoader onFinish={() => setLoading(false)} message='Cargando turnos...' />;

    const filteredShifts = shifts.filter((s) => {
        const matchesType = selectedTypes.length > 0 ? selectedTypes.includes(s.shift_type) : true;
        const date = new Date(s.date);
        const inDateRange =
            (!dateRange.startDate || date >= dateRange.startDate) &&
            (!dateRange.endDate || date <= dateRange.endDate);
        const matchesReturn = onlyNoReturn ? s.requires_return === false : true;

        return matchesType && inDateRange && matchesReturn;
    });

    if (filteredShifts.length === 0) {
        return (
            <FadeInView>
                <AppLayout title="Turnos publicados">
                    <View style={{ flex: 1, justifyContent: 'center', padding: spacing.lg }}>
                        <EmptyState
                            title="No hay resultados"
                            description="No hay turnos publicados en esta búsqueda."
                            ctaLabel="Limpiar filtros"
                            onCtaClick={() => {
                                setDateRange({
                                    startDate: startOfMonth(new Date()),
                                    endDate: endOfMonth(new Date()),
                                });
                                setSelectedTypes([]);
                                setOnlyNoReturn(false);
                            }}
                        />
                    </View>
                </AppLayout>
            </FadeInView>
        );
    }



    return (
        <FadeInView>
            <AppLayout title="Turnos publicados">
                <View style={{ flex: 1 }}>
                    <View style={{ padding: spacing.md }}>
                        <DateRangePicker range={dateRange} onChange={setDateRange} />
                    </View>
                    <View style={{ paddingHorizontal: spacing.md }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: spacing.sm }}
                        >
                            <Chip
                                label="Sin devolución"
                                selected={onlyNoReturn}
                                onPress={() => {
                                    setOnlyNoReturn(!onlyNoReturn);
                                    trackEvent(EVENTS.HOSPITAL_SHIFTS_FILTER_NO_RETURN_TOGGLED, { enabled: !onlyNoReturn });
                                }}
                            />

                            {shiftTypes.map((type) => {
                                const isSelected = selectedTypes.includes(type);
                                const Icon = shiftTypeIcons[type];
                                return (
                                    <Chip
                                        key={type}
                                        label={shiftTypeLabels[type]}
                                        icon={Icon}
                                        selected={isSelected}
                                        onPress={() => {
                                            const updated = isSelected
                                                ? selectedTypes.filter((t) => t !== type)
                                                : [...selectedTypes, type];
                                            setSelectedTypes(updated);
                                            trackEvent(EVENTS.HOSPITAL_SHIFTS_FILTER_TYPE_TOGGLED, { type, selected: !isSelected });
                                        }}
                                    />
                                );
                            })}
                        </ScrollView>
                    </View>

                    <HospitalShiftsTable
                        shifts={filteredShifts}
                        workerId={isWorker.worker_id}
                        sentSwapShiftIds={sentSwapShiftIds}
                        onSelect={(shiftId: string) => navigation.navigate('ProposeSwap', { shiftId })}
                    />
                </View>
            </AppLayout>
        </FadeInView>
    );
}

const styles = StyleSheet.create({});
