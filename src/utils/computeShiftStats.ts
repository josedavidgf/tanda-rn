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
  const stats = {
    morning: 0,
    evening: 0,
    night: 0,
    reinforcement: 0,
    total: 0,
  };

  Object.entries(calendarMap).forEach(([date, entry]) => {
    if (!date.startsWith(targetMonth)) return;

    if (entry.shift_type && entry.source !== 'swapped_out') {
      if (stats.hasOwnProperty(entry.shift_type)) {
        stats[entry.shift_type]++;
        stats.total++;
      }
    }
  });

  return stats;
}
