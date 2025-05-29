import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { getMonthlySchedules } from '../../services/calendarService';
import { useAuth } from '../../contexts/AuthContext';
import MonthlyGridCalendar from '../../components/calendar/MonthlyGridCalendar';
import type { Schedule, CalendarEntry as OriginalCalendarEntry } from '@/types/calendar';

import AppLayout from '../../components/layout/AppLayout';
import DayDetailMyShift from '../../components/DayDetails/DayDetailMyShift';
import DayDetailEmpty from '@/components/DayDetails/DayDetailEmpty';
import DayDetailReceived from '@/components/DayDetails/DayDetailReceived';
import DayDetailSwapped from '@/components/DayDetails/DayDetailSwapped';
import DayDetailPreference from '@/components/DayDetails/DayDetailPreference';
import type { DayType } from '@/types/dayType';
import { mergeCalendarData } from '@/utils/mergeCalendarData';
import { useSwapApi } from '@/api/useSwapApi';
import { useSwapPreferencesApi } from '@/api/useSwapPreferencesApi';
import { useShiftApi } from '@/api/useShiftApi';
import { useCalendarApi } from '@/api/useCalendarApi';
import { resolveDayTypeFromCalendarMap } from '@/utils/resolveDayTypeFromCalendarMap';
import { format } from 'date-fns'
import AppLoader from '@/components/ui/AppLoader';
import { getNextShiftType } from '@/utils/getNextShiftType';
import { formatFriendlyDate } from '@/utils/useFormatFriendlyDate';
import { useIsWorkerReady } from '../hooks/useIsWorkerReady';
import MonthSelector from '@/components/calendar/MonthSelector';
import ShiftStats from '@/components/calendar/ShiftStats';
import { computeShiftStats } from '@/utils/computeShiftStats';
import Button from '@/components/ui/Button';
import AppText from '@/components/ui/AppText';
import { colors } from '@/styles/utilities/colors';
import { CalendarPlus } from 'phosphor-react-native';
import FadeInView from '@/components/animations/FadeInView';
import { relative } from 'path';

export default function CalendarScreen() {

    const { session } = useAuth();
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { getAcceptedSwaps } = useSwapApi();
    const { getMySwapPreferences, deleteSwapPreference, updateSwapPreference, createSwapPreference } = useSwapPreferencesApi();
    const { getMyShiftsPublished, removeShift } = useShiftApi();
    const { accessToken } = useAuth();
    const [calendarMap, setCalendarMap] = useState<Record<string, OriginalCalendarEntry>>({});
    const { setShiftForDay, removeShiftForDay } = useCalendarApi();
    const { isWorker, ready } = useIsWorkerReady();
    const shiftStats = useMemo(() => computeShiftStats(calendarMap, selectedMonth), [calendarMap, selectedMonth]);
    const [isMassiveEditMode, setIsMassiveEditMode] = useState(false);
    const [draftShiftMap, setDraftShiftMap] = useState<Record<string, OriginalCalendarEntry>>({});
    const [loadingCalendar, setLoadingCalendar] = useState(false);


    const selectedDayData = useMemo(() => {
        console.log('selectedDate', selectedDate);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const entry = calendarMap[dateStr];
        return resolveDayTypeFromCalendarMap(entry, selectedDate);
    }, [selectedDate, calendarMap]);


    useEffect(() => {
        if (!isWorker?.worker_id) return;

        const loadSchedules = async () => {
            setLoadingCalendar(true);

            try {
                const [data, prefs, sws, shift] = await Promise.all([
                    getMonthlySchedules(accessToken, isWorker.worker_id, selectedMonth.getFullYear(), selectedMonth.getMonth() + 1),
                    getMySwapPreferences(isWorker.worker_id, accessToken),
                    getAcceptedSwaps(accessToken),
                    getMyShiftsPublished(accessToken),
                ]);
                setSchedules(data);

                const merged = mergeCalendarData({
                    monthlySchedules: data,
                    preferences: prefs,
                    shifts: shift,
                    swaps: sws,
                });

                setCalendarMap(merged);
            } catch (e) {
                console.log('Aqui error', e);
                Alert.alert('Error al cargar turnos', e.message);
            } finally {
                setLoadingCalendar(false);
            }
        };

        loadSchedules();
    }, [isWorker, selectedMonth]);
    console.log('[CALENDAR] Flags', { ready });

    if (!ready) return <AppLoader message="Cargando Calendario..." />;

    async function toggleShift(dateStr: string) {
        const entry = calendarMap[dateStr] || {};
        const current = entry.shift_type;
        const newType = getNextShiftType(current);

        const updated = {
            ...entry,
            shift_type: newType,
            source: newType ? 'manual' : undefined,
        };

        setCalendarMap(prev => ({
            ...prev,
            [dateStr]: updated,
        }));
        try {
            if (newType) {
                await setShiftForDay(accessToken, isWorker.worker_id, dateStr, newType);
            } else {
                await removeShiftForDay(accessToken, isWorker.worker_id, dateStr);
            }
        } catch (err) {
            console.error('❌ Error al guardar el turno:', err.message);
        }
    }
    async function togglePreference(dateStr: string, shiftType: string) {
        const entry = calendarMap[dateStr] || {};
        const currentTypes = entry.preference_types || [];
        const currentIds = entry.preferenceIds || {};

        console.log('currentTypes', currentTypes);
        console.log('currentIds', currentIds);
        console.log('shiftType', shiftType);
        const alreadyExists = currentTypes.includes(shiftType);
        console.log('alreadyExists', alreadyExists);

        let updatedTypes = [...currentTypes];
        let updatedIds = { ...currentIds };

        try {
            if (alreadyExists) {
                const preferenceId = currentIds[shiftType];
                if (preferenceId) {
                    await deleteSwapPreference(preferenceId, token);
                    updatedTypes = updatedTypes.filter(t => t !== shiftType);
                    delete updatedIds[shiftType];
                }
            } else {
                const res = await createSwapPreference({
                    worker_id: isWorker.worker_id,
                    date: dateStr,
                    preference_type: shiftType,
                    hospital_id: isWorker.workers_hospitals?.[0]?.hospital_id,
                    speciality_id: isWorker.workers_specialities?.[0]?.speciality_id,
                }, token);
                updatedTypes.push(shiftType);
                updatedIds[shiftType] = res.preference_id;
            }

            const updatedEntry = {
                ...entry,
                isPreference: updatedTypes.length > 0,
                preference_types: updatedTypes,
                preferenceIds: updatedIds,
            };

            setCalendarMap(prev => ({
                ...prev,
                [dateStr]: updatedEntry,
            }));
        } catch (error) {
            console.error('❌ Error al hacer toggle de preferencia:', error.message);
        }
    }
    async function handleDeletePreference(dateStr: string) {
        const entry = calendarMap[dateStr];
        const preferenceIds = entry?.preferenceIds;

        if (!preferenceIds || Object.keys(preferenceIds).length === 0) {
            console.warn('❌ No hay preferencias que eliminar.');
            return;
        }
        try {
            await Promise.all(
                Object.values(preferenceIds).map((id) => deleteSwapPreference(id, accessToken))
            );

            const updatedEntry = { ...entry };
            delete updatedEntry.isPreference;
            delete updatedEntry.preference_types;
            delete updatedEntry.preferenceIds;

            setCalendarMap(prev => ({
                ...prev,
                [dateStr]: updatedEntry,
            }));
        } catch (error) {
            console.error('❌ Error al eliminar todas las preferencias:', error.message);
        }
    }
    async function handleRemoveShiftForDay(dateStr: string) {
        const entry = calendarMap[dateStr];

        if (!entry?.shift_type) {
            console.warn('No hay turno asignado en esta fecha');
            return;
        }
        try {
            await removeShiftForDay(accessToken, isWorker.worker_id, dateStr);

            const updatedEntry = { ...entry };
            delete updatedEntry.shift_type;
            delete updatedEntry.source;

            setCalendarMap(prev => ({
                ...prev,
                [dateStr]: updatedEntry,
            }));

            setSelectedDate(new Date(dateStr)); // refrescar selección si aplica
        } catch (error) {
            console.error('❌ Error al eliminar turno del día:', error.message);
        }
    }
    async function handleDeletePublication(shiftId: string, dateStr: string) {
        if (!shiftId) {
            console.warn('❌ No se encontró el shift_id para eliminar la publicación.');
            return;
        }

        try {
            const success = await removeShift(shiftId, accessToken);

            if (success) {
                const original = calendarMap[dateStr];
                if (!original) {
                    console.warn(`❌ No existe calendarMap para ${dateStr}`);
                    return;
                }

                const { isPublished, shift_id, ...cleanedEntry } = original;

                setCalendarMap(prev => ({
                    ...prev,
                    [dateStr]: cleanedEntry,
                }));

                setSelectedDate(new Date(dateStr)); // fuerza el re-render

            } else {
                console.warn('❌ El servidor no confirmó la eliminación del turno publicado.');
            }
        } catch (error) {
            console.error('❌ Error al eliminar turno publicado:', error.message);
        }
    }

    function DayDetailRenderer({ data }: { data: DayType }) {
        if (!data) return null;

        console.log('Rendering DayDetailRenderer con data:', data);

        switch (data.type) {
            case 'my_shift':
                return (
                    <DayDetailMyShift
                        dateStr={data.date}
                        dayLabel={`${formatFriendlyDate(data.date)} - Turno propio`} // puedes mejorar esto luego
                        shift={data.shift}
                        isPublished={!!data.shift.isPublished}
                        onEditShift={(dateStr) => { toggleShift(dateStr) }}
                        onDeletePublication={handleDeletePublication}
                        onRemoveShift={handleRemoveShiftForDay}
                    />
                );
            case 'received':
                return (
                    <DayDetailReceived
                        dateStr={typeof data.date === 'string' ? data.date : format(data.date, 'yyyy-MM-dd')}
                        dayLabel={`Turno recibido para ${formatFriendlyDate(data.date)}`} // puedes mejorar esto luego
                        entry={data.shift}
                    />
                );

            case 'swapped':
                return (
                    <DayDetailSwapped
                        dateStr={typeof data.date === 'string' ? data.date : format(data.date, 'yyyy-MM-dd')}
                        dayLabel={`Turno intercambiado para ${formatFriendlyDate(data.date)}`} // puedes mejorar esto luego
                        entry={data.shift}
                        onAddShift={(dateStr) => { toggleShift(dateStr) }} // ✅ ahora está definido
                        onAddPreference={(dateStr) => {
                            console.log('Añadir preferencia desde swapped', dateStr);
                        }}
                        navigate={(path) => {
                            console.log('Navegar a', path);
                        }}
                    />
                );
            case 'preference':
                return (
                    <DayDetailPreference
                        dateStr={typeof data.date === 'string' ? data.date : format(data.date, 'yyyy-MM-dd')}
                        dayLabel={`${formatFriendlyDate(data.date)} - Día libre`} // puedes ajustar si tienes otra lógica
                        entry={data.preference}
                        onEditPreference={(dateStr, type) => {
                            togglePreference(dateStr, type); // Cambia 'morning' por el tipo de preferencia que necesites
                            // Implementar lógica de edición}
                        }}
                        onDeletePreference={(dateStr) => {
                            handleDeletePreference(dateStr);
                        }}
                    // Implementar lógica de eliminación
                    />
                );
            case 'empty':
                return (
                    <DayDetailEmpty
                        dateStr={typeof data.date === 'string' ? data.date : format(data.date, 'yyyy-MM-dd')}
                        dayLabel={`${formatFriendlyDate(data.date)} - Día libre`} // puedes mejorar el formato
                        onAddShift={(dateStr) => toggleShift(dateStr)} // ✅ ahora está definido
                        onAddPreference={(dateStr) => {
                            console.log('Añadir preferencia desde empty', dateStr);
                            togglePreference(dateStr, 'morning'); // Cambia 'morning' por el tipo de preferencia que necesites
                        }} // ✅ ahora está definido
                    />
                );
            default:
                return null;
        }
    }


    return (
        <FadeInView>
            <AppLayout title="Tus turnos">

                <ScrollView>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        marginBottom: 8,
                    }}>
                        <MonthSelector
                            selectedMonth={selectedMonth}
                            onChange={(newMonth) => {
                                setSelectedMonth(newMonth);
                                setSelectedDate(new Date(newMonth.getFullYear(), newMonth.getMonth(), 1));
                            }}
                        />
                        {!isMassiveEditMode && !loadingCalendar && (
                            <Button
                                label="Añadir turnos"
                                size="sm"
                                leftIcon={<CalendarPlus size={20} color={colors.black} />}
                                variant="outline"
                                style={{ margin: 0 }}
                                onPress={() => {
                                    setDraftShiftMap({ ...calendarMap });
                                    setIsMassiveEditMode(true);
                                }}
                            />
                        )}
                    </View>

                    {isMassiveEditMode && (
                        <AppText style={{ textAlign: 'center', padding: 8 }}>
                            Toca varios días para asignar turnos: mañana → tarde → noche → refuerzo → vacío.
                        </AppText>
                    )}


                    {!isMassiveEditMode && !loadingCalendar && <ShiftStats stats={shiftStats} />}
                    <View style={{ position: 'relative' }}>
                        <MonthlyGridCalendar
                            calendarMap={isMassiveEditMode ? draftShiftMap : calendarMap}
                            selectedDate={selectedDate}
                            selectedMonth={selectedMonth}
                            onSelectDate={(date) => {
                                const dateStr = format(date, 'yyyy-MM-dd');
                                if (!isMassiveEditMode) {
                                    setSelectedDate(date);
                                } else {
                                    const entry = draftShiftMap[dateStr] || {};
                                    if (entry.source === 'received_swap' || entry.isPreference) return;

                                    const nextType = getNextShiftType(entry.shift_type);
                                    const newEntry = nextType
                                        ? { ...entry, shift_type: nextType, source: 'manual' }
                                        : {};
                                    setDraftShiftMap((prev) => ({
                                        ...prev,
                                        [dateStr]: newEntry,
                                    }));
                                }
                            }}
                        />
                        {loadingCalendar && (
                            <View style={{
                                ...StyleSheet.absoluteFillObject,
                            }}>
                                <AppLoader message="Cargando mes..." />
                            </View>
                        )}
                    </View>
                    {!isMassiveEditMode && !loadingCalendar && (
                        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                            <DayDetailRenderer data={selectedDayData} />
                        </View>
                    )}
                    {isMassiveEditMode && !loadingCalendar && (
                        <View style={{ padding: 16 }}>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <Button
                                    label="Cancelar"
                                    size="md"
                                    variant="outline"
                                    onPress={() => {
                                        setDraftShiftMap({});
                                        setIsMassiveEditMode(false);
                                    }}
                                    style={{ flex: 1 }}
                                />
                                <Button
                                    label="Guardar cambios"
                                    size="md"
                                    variant="primary"
                                    onPress={async () => {
                                        const updates = Object.entries(draftShiftMap).map(([dateStr, entry]) =>
                                            entry.shift_type
                                                ? setShiftForDay(accessToken, isWorker.worker_id, dateStr, entry.shift_type)
                                                : removeShiftForDay(accessToken, isWorker.worker_id, dateStr)
                                        );
                                        await Promise.all(updates);
                                        setCalendarMap(draftShiftMap);
                                        setDraftShiftMap({});
                                        setIsMassiveEditMode(false);
                                    }}
                                    style={{ flex: 1 }}
                                />
                            </View>
                        </View>
                    )}

                </ScrollView>
            </AppLayout>
        </FadeInView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    scheduleItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    block: { marginTop: 24 },
});

