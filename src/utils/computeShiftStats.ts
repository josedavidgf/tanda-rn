import { format } from 'date-fns';
import type { CalendarEntry } from '@/types/calendar';

export type ShiftStats = {
  total: number;
  morning: number;
  evening: number;
  night: number;
  reinforcement: number;
};

export function computeShiftStats(
  calendarMap: Record<string, CalendarEntry>,
  selectedMonth: Date
): ShiftStats {
  const targetMonth = format(selectedMonth, 'yyyy-MM');
  const stats: ShiftStats = {
    morning: 0,
    evening: 0,
    night: 0,
    reinforcement: 0,
    total: 0,
  };

  Object.entries(calendarMap).forEach(([date, entry]) => {
    if (!date.startsWith(targetMonth)) return;

    const shifts = entry.shifts ?? [];

    for (const shift of shifts) {
      if (shift.source === 'swapped_out') continue;

      if (stats.hasOwnProperty(shift.type)) {
        stats[shift.type]++;
        stats.total++;
      }
    }
  });

  return stats;
}
