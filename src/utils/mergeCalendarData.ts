import type { CalendarMap, MergeCalendarParams} from '@/types/calendar';

export function mergeCalendarData({
  monthlySchedules,
  preferences,
  shifts, // SOLO publicados
  swaps,
  comments,
}: MergeCalendarParams): CalendarMap {
  const map: CalendarMap = {};

  // 1. Construimos el publishedMap
  const publishedMap = new Map();
  for (const shift of shifts) {
    const key = `${shift.date}_${shift.shift_type}`;
    publishedMap.set(key, shift.shift_id);
  }

  // 2. Metemos los schedules como base
  for (const s of monthlySchedules) {
    const key = `${s.date}_${s.shift_type}`;
    const hasRelated = !!s.related_worker_id && s.related_worker;

    map[s.date] = {
      shift_type: s.shift_type,
      source: s.source,
      related_worker_id: s.related_worker_id,
      related_worker: s.related_worker || null,
      related_worker_name: hasRelated ? s.related_worker.name : null,
      related_worker_surname: hasRelated ? s.related_worker.surname : null,
      swap_id: s.swap_id,
      isPublished: publishedMap.has(key),
      shift_id: publishedMap.get(key) || null,
      worker_id: s.worker_id,
    };
  }

  // 3. Acumulamos las preferencias
  for (const p of preferences) {
    if (!p.date || !p.preference_type || !p.preference_id) continue;

    const prevTypes = map[p.date]?.preference_types || [];
    const prevIds = map[p.date]?.preferenceIds || {};

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

  // 4. (Opcional) procesar swaps si los quieres integrar aquí
  // 5. Añadir los comentarios
  if (comments && Array.isArray(comments)) {
    for (const c of comments) {
      if (!c.date) continue;
      map[c.date] = {
        ...map[c.date],
        hasComment: !!c.comment && c.comment.trim() !== '',
        comment: c.comment || '',
        comment_id: c.comment_id || null,
      };
    }
  }

  return map;
}
