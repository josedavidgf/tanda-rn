import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ScrollView, View, StyleSheet, Alert, Dimensions } from 'react-native';
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
import { CalendarPlus, PencilLine } from 'phosphor-react-native';
import FadeInView from '@/components/animations/FadeInView';
import { relative } from 'path';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '@/styles';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';
import { getCommentsByMonth } from '@/services/calendarCommentService';
import { useToast } from '../hooks/useToast';
import CommentButton from '@/components/calendar/DayComment';
import { ScrollView as HorizontalScrollView } from 'react-native-gesture-handler'; // al principio del fichero
import { CalendarEntry, ShiftType } from '@/types/calendar';

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
    const { setShiftForDay, removeShiftForDay, updateShiftForDay } = useCalendarApi();
    const { isWorker, ready } = useIsWorkerReady();
    const [isMassiveEditMode, setIsMassiveEditMode] = useState(false);
    const [draftShiftMap, setDraftShiftMap] = useState<Record<string, OriginalCalendarEntry>>({});
    const [loadingCalendar, setLoadingCalendar] = useState(false);
    const navigation = useNavigation();
    const { showError } = useToast();
    const screenWidth = Dimensions.get('window').width;
    const [activeSlide, setActiveSlide] = useState(0);
    const scrollRef = useRef<ScrollView>(null);
    const DETAIL_WIDTH = 343;


    const selectedDayData = useMemo(() => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const entry = calendarMap[dateStr];
        return resolveDayTypeFromCalendarMap(entry, selectedDate);
    }, [selectedDate, calendarMap]);


    useEffect(() => {
        if (!isWorker?.worker_id) return;

        const loadSchedules = async () => {
            setLoadingCalendar(true);

            try {
                const [data, prefs, shift, comment] = await Promise.all([
                    getMonthlySchedules(accessToken, isWorker.worker_id, selectedMonth.getFullYear(), selectedMonth.getMonth() + 1),
                    getMySwapPreferences(isWorker.worker_id, accessToken),
                    getMyShiftsPublished(accessToken),
                    getCommentsByMonth(accessToken, isWorker.worker_id, selectedMonth.getFullYear(), selectedMonth.getMonth() + 1),
                ]);
                setSchedules(data);

                const merged = mergeCalendarData({
                    monthlySchedules: data,
                    preferences: prefs,
                    shifts: shift,
                    comments: comment,
                });

                setCalendarMap(merged);
            } catch (e) {
                showError('Error al cargar turnos');
                console.error('❌ Error al cargar calendarios:', e);
            } finally {
                setLoadingCalendar(false);
            }
        };

        loadSchedules();
    }, [isWorker, selectedMonth]);

    if (!ready) return <AppLoader message="Cargando Calendario..." />;

    function getNextValidManualShiftType(entry: CalendarEntry): ShiftType | null {
        const usedTypes = new Set(entry.shifts?.map(s => s.type));
        const manualShifts = entry.shifts?.filter(s => s.source === 'manual') ?? [];

        const shiftOrder: ShiftType[] = ['morning', 'evening', 'night', 'reinforcement'];

        // Si no hay ninguno, devuelve el primero disponible
        if (manualShifts.length === 0) {
            return shiftOrder.find(t => !usedTypes.has(t)) ?? null;
        }

        const currentIndex = shiftOrder.indexOf(manualShifts[0].type);
        if (currentIndex === -1) return null;

        // Busca siguiente tipo válido, empezando desde el actual
        for (let i = 1; i < shiftOrder.length; i++) {
            const next = shiftOrder[(currentIndex + i) % shiftOrder.length];
            if (!usedTypes.has(next)) return next;
        }

        return null;
    }



    async function toggleShift(dateStr: string) {
        const entry = calendarMap[dateStr] || {};
        const manualShifts = entry.shifts?.filter(s => s.source === 'manual') ?? [];

        if (isMassiveEditMode) {
            if (!entry.shifts || entry.shifts.length === 0) {
                const newEntry = {
                    ...entry,
                    shifts: [{ type: 'morning', source: 'manual' }],
                };

                setCalendarMap(prev => ({
                    ...prev,
                    [dateStr]: newEntry,
                }));

                await setShiftForDay(accessToken, isWorker.worker_id, dateStr, 'morning');
                return;
            }

            const allManual = entry.shifts.length === manualShifts.length;
            if (manualShifts.length === 1 && allManual) {
                const nextType = getNextValidManualShiftType(entry);
                if (nextType) {
                    const newEntry = {
                        ...entry,
                        shifts: [{ type: nextType, source: 'manual' }],
                    };

                    setCalendarMap(prev => ({
                        ...prev,
                        [dateStr]: newEntry,
                    }));

                    await updateShiftForDay(
                        accessToken,
                        isWorker.worker_id,
                        dateStr,
                        manualShifts[0].type,
                        nextType
                    );
                }
            }

            return;
        }

        if (manualShifts.length > 2) {
            console.warn('❌ Ya hay dos turnos propios este día');
            return;
        }

        const nextType = getNextValidManualShiftType(entry);

        if (!nextType) {
            console.warn('❌ No hay tipo disponible para crear o editar turno');
            return;
        }

        const updatedShifts =
            manualShifts.length === 0
                ? [...(entry.shifts ?? []), { type: nextType, source: 'manual' }]
                : entry.shifts!.map(s =>
                    s.source === 'manual' && s.type === manualShifts[0].type
                        ? { ...s, type: nextType }
                        : s
                );

        const updatedEntry = { ...entry, shifts: updatedShifts };

        setCalendarMap(prev => ({
            ...prev,
            [dateStr]: updatedEntry,
        }));

        try {
            if (manualShifts.length === 0) {
                await setShiftForDay(accessToken, isWorker.worker_id, dateStr, nextType);
            } else {
                await updateShiftForDay(
                    accessToken,
                    isWorker.worker_id,
                    dateStr,
                    manualShifts[0].type,
                    nextType
                );
            }
        } catch (err) {
            console.error('❌ Error al guardar el turno:', err.message);
        }
    }


    async function togglePreference(dateStr: string, shiftType: string) {
        const entry = calendarMap[dateStr] || {};
        const currentTypes = entry.preference_types || [];
        const currentIds = entry.preferenceIds || {};
        const alreadyExists = currentTypes.includes(shiftType);

        let updatedTypes = [...currentTypes];
        let updatedIds = { ...currentIds };

        try {
            if (alreadyExists) {
                const preferenceId = currentIds[shiftType];
                if (preferenceId) {
                    await deleteSwapPreference(preferenceId, accessToken);
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
                }, accessToken);
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
    async function handleRemoveShiftType(dateStr: string, shiftType: ShiftType) {
        const entry = calendarMap[dateStr];
        if (!entry?.shifts) return;

        const remaining = entry.shifts.filter(s => s.type !== shiftType || s.source !== 'manual');
        const updatedEntry = { ...entry, shifts: remaining };

        setCalendarMap(prev => ({
            ...prev,
            [dateStr]: updatedEntry,
        }));

        await removeShiftForDay(accessToken, isWorker.worker_id, dateStr, shiftType);
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

    function canAddSecondShift(entry: CalendarEntry): boolean {
        const shifts = entry.shifts ?? [];
        if (shifts.length === 0) return false;
        if (shifts.length === 1) return true;
        return false;
    }


    function getNextAvailableShiftType(entry: CalendarEntry): ShiftType | null {
        const used = new Set((entry.shifts ?? []).map(s => s.type));
        const order: ShiftType[] = ['morning', 'evening', 'night', 'reinforcement'];
        return order.find(t => !used.has(t)) ?? null;
    }
    async function handleAddSecondShift(dateStr: string) {
        const entry = calendarMap[dateStr];
        if (!entry || !canAddSecondShift(entry)) return;

        const nextType = getNextAvailableShiftType(entry);
        if (!nextType) return;

        const updatedShifts = [...(entry.shifts ?? []), {
            type: nextType,
            source: 'manual',
        }];

        const updatedEntry = {
            ...entry,
            shifts: updatedShifts,
        };

        setCalendarMap(prev => ({
            ...prev,
            [dateStr]: updatedEntry,
        }));

        try {
            await setShiftForDay(accessToken, isWorker.worker_id, dateStr, nextType);

            // Solo hacemos scroll si ahora hay 2 turnos en total
            if (updatedShifts.length === 2) {
                setTimeout(() => {
                    scrollRef.current?.scrollTo({
                        x: DETAIL_WIDTH + 12,
                        animated: true,
                    });
                }, 100);
            }
        } catch (err) {
            console.error('❌ Error al crear segundo turno:', err.message);
        }
    }


    function DayDetailRenderer({ date }: { date: Date }) {
        const dateStr = format(date, 'yyyy-MM-dd');
        const entry = calendarMap[dateStr];
        console.log('entry', entry);

        if (!entry) return <DayDetailEmpty dateStr={dateStr} dayLabel="Día libre" onAddShift={() => toggleShift(dateStr)} onAddPreference={() => togglePreference(dateStr, 'morning')} />;

        const shifts = entry.shifts ?? [];


        if (shifts.length === 0 && entry.isPreference) {
            return (
                <DayDetailPreference
                    dateStr={dateStr}
                    dayLabel="Día libre"
                    entry={entry}
                    onEditPreference={togglePreference}
                    onDeletePreference={handleDeletePreference}
                />
            );
        }

        if (shifts.length === 0) {
            return (
                <DayDetailEmpty
                    dateStr={dateStr}
                    dayLabel="Día libre"
                    onAddShift={() => toggleShift(dateStr)}
                    onAddPreference={() => togglePreference(dateStr, 'morning')}
                />
            );
        }

        if (shifts.length === 1 && shifts[0].source === 'received_swap') {
            return (
                <DayDetailReceived
                    dateStr={dateStr}
                    dayLabel="Turno recibido"
                    entry={shifts[0]}
                    canAddSecondShift={canAddSecondShift(entry)}
                    handleAddSecondShift={handleAddSecondShift}
                    entryFull={entry}
                />
            );
        }
        if (shifts.length === 1 && shifts[0].source === 'manual') {
            return (
                <DayDetailMyShift
                    dateStr={dateStr}
                    dayLabel="Turno propio"
                    shift={shifts[0]}
                    isPublished={!!shifts[0].isPublished}
                    onEditShift={() => toggleShift(dateStr)}
                    onDeletePublication={handleDeletePublication}
                    onRemoveShift={() => handleRemoveShiftType(dateStr, shifts[0].type)}
                    canAddSecondShift={canAddSecondShift(entry)}
                    handleAddSecondShift={handleAddSecondShift}
                    entry={entry}
                />
            );
        }
        if (shifts.length === 1 && shifts[0].source === 'swapped_out') {
            return (
                <DayDetailSwapped
                    dateStr={dateStr}
                    dayLabel="Turno intercambiado"
                    entry={data.shift}
                    onAddShift={(dateStr) => toggleShift(dateStr)}
                    onAddPreference={(dateStr) => console.log('Añadir preferencia desde swapped', dateStr)}
                    navigate={(path) => console.log('Navegar a', path)}
                />
            );
        }
        if (shifts.length > 2) {
            console.warn('❌ Más de dos turnos propios en el día, no se puede mostrar correctamente');
            return <AppText>{dateStr} - Día con múltiples turnos</AppText>;
        }


        if (shifts.length === 2) {
            return (
                <HorizontalScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    snapToAlignment="start"
                    snapToInterval={DETAIL_WIDTH + 12}
                    decelerationRate="fast"
                    contentContainerStyle={{
                        paddingLeft: 0,
                        marginLeft: 0,
                        paddingRight: screenWidth - DETAIL_WIDTH,
                        justifyContent: 'flex-start',
                        gap: spacing.sm,
                    }}
                    pagingEnabled={true}
                >
                    {
                        shifts.map((shift, index) => {
                            const key = `${shift.type}-${shift.source}-${index}`;
                            const child = shift.source === 'manual' ? (
                                <DayDetailMyShift
                                    dateStr={dateStr}
                                    dayLabel="Turno propio"
                                    shift={shift}
                                    isPublished={!!shift.isPublished}
                                    onEditShift={() => toggleShift(dateStr)}
                                    onDeletePublication={handleDeletePublication}
                                    onRemoveShift={() => handleRemoveShiftType(dateStr, shift.type)}
                                    canAddSecondShift={canAddSecondShift(entry)}
                                    handleAddSecondShift={handleAddSecondShift}
                                    entry={entry}
                                />
                            ) : (
                                <DayDetailReceived
                                    dateStr={dateStr}
                                    dayLabel="Turno recibido"
                                    entry={shift}
                                    canAddSecondShift={canAddSecondShift(entry)}
                                    handleAddSecondShift={handleAddSecondShift}
                                    entryFull={entry}
                                />
                            );

                            return (
                                <View
                                    key={key}
                                    style={{
                                        width: DETAIL_WIDTH,
                                        marginRight: 0,
                                        marginLeft: 0,
                                    }}
                                >
                                    {child}
                                </View>

                            );
                        })
                    }
                </HorizontalScrollView >

            );
        }
    }

    const rawName = isWorker?.name || 'Trabajador';
    const workerName = rawName.length > 14 ? `${rawName.slice(0, 14).trim()}...` : rawName;
    const selectedDayTitle = `${formatFriendlyDate(selectedDate)}`;
    return (
        <FadeInView>
            <AppLayout title={`Hola, ${workerName}`}>
                <ScrollView>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: spacing.md,
                        marginBottom: spacing.sm,
                    }}>
                        <MonthSelector
                            selectedMonth={selectedMonth}
                            onChange={(newMonth) => {
                                if (newMonth < selectedMonth) {
                                    trackEvent(EVENTS.PREV_MONTH_CLICKED);
                                } else {
                                    trackEvent(EVENTS.NEXT_MONTH_CLICKED);
                                }
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
                                    trackEvent(EVENTS.BULK_SHIFT_BUTTON_CLICKED);
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

                    <View style={{ position: 'relative' }}>
                        <MonthlyGridCalendar
                            calendarMap={isMassiveEditMode ? draftShiftMap : calendarMap}
                            selectedDate={selectedDate}
                            selectedMonth={selectedMonth}
                            onSelectDate={(date) => {
                                const dateStr = format(date, 'yyyy-MM-dd');
                                if (!isMassiveEditMode) {
                                    trackEvent(EVENTS.CALENDAR_DAY_CLICKED);
                                    setSelectedDate(date);
                                } else {
                                    trackEvent(EVENTS.BULK_SHIFT_DAY_TAP_CLICKED);
                                    const entry = draftShiftMap[dateStr] || {};
                                    if ((entry.shifts ?? []).some(s => s.source === 'received_swap') || entry.isPreference) return;

                                    const currentType = entry.shifts?.[0]?.type;
                                    const nextType = getNextShiftType(currentType);
                                    const newEntry = nextType
                                        ? { ...entry, shifts: [{ type: nextType, source: 'manual' }] }
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
                        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.md }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                                <AppText variant="h2" /* Eliminado marginBottom para alinear verticalmente con el botón */>{selectedDayTitle}</AppText>
                                <CommentButton dateStr={format(selectedDate, 'yyyy-MM-dd')} />
                            </View>
                            <DayDetailRenderer date={selectedDate} />
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
                                        trackEvent(EVENTS.BULK_SHIFT_CANCEL_BUTTON_CLICKED);
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
                                        trackEvent(EVENTS.BULK_SHIFT_SAVE_BUTTON_CLICKED);
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
    container: { flex: 1, padding: spacing.lg },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    scheduleItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    block: { marginTop: 24 },
});

