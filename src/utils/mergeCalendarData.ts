import type {
  MergeCalendarParams,
  CalendarMap,
  ShiftEntry,
  CalendarEntry,
} from '@/types/calendar';

export function mergeCalendarData({
  monthlySchedules,
  preferences,
  shifts, // solo publicados
  comments,
}: MergeCalendarParams): CalendarMap {
  const map: CalendarMap = {};

  // 1. Mapeo de turnos publicados
  const publishedMap = new Map<string, string>();
  for (const shift of shifts) {
    const key = `${shift.date}_${shift.shift_type}`;
    publishedMap.set(key, shift.shift_id);
  }

  // 2. Procesar monthlySchedules como base
  for (const schedule of monthlySchedules) {
    const date = schedule.date;
    const key = `${date}_${schedule.shift_type}`;
    const source = schedule.source;

    const shiftEntry: ShiftEntry = {
      id: schedule.id,
      type: schedule.shift_type,
      source: schedule.source,
      shift_id: publishedMap.get(key) || null,
      isPublished: publishedMap.has(key),
    };

    shiftEntry.related_worker_name = schedule.related_worker_name ?? null;
    shiftEntry.related_worker_surname = schedule.related_worker_surname ?? null
    shiftEntry.swap_id = schedule.swap_id ?? null;



    if (!map[date]) map[date] = {};
    if (!map[date].shifts) map[date].shifts = [];

    map[date].shifts!.push(shiftEntry);
  }

  // 3. Procesar preferencias
  for (const p of preferences) {
    if (!p.date || !p.preference_type || !p.preference_id) continue;

    const prevTypes = map[p.date]?.preference_types ?? [];
    const prevIds = map[p.date]?.preferenceIds ?? {};

    map[p.date] = {
      ...map[p.date],
      isPreference: true,
      preference_types: Array.from(new Set([...prevTypes, p.preference_type])),
      preferenceIds: {
        ...prevIds,
        [p.preference_type]: p.preference_id,
      },
    };
  }

  // 4. Procesar comentarios
  if (comments && Array.isArray(comments)) {
    for (const c of comments) {
      if (!c.date) continue;
      map[c.date] = {
        ...map[c.date],
        hasComment: !!c.comment?.trim(),
        comment: c.comment || '',
        comment_id: c.comment_id || null,
      };
    }
  }

  return map;
}
