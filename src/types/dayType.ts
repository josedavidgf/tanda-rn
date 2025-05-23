import type { CalendarEntry } from './calendarEntry';
import type { Preference } from './preference';

export type DayType =
  | { type: 'my_shift'; date: Date; shift: CalendarEntry }
  | { type: 'received'; date: Date; shift: CalendarEntry }
  | { type: 'swapped'; date: Date; shift: CalendarEntry }
  | { type: 'preference'; date: Date; preference: Preference }
  | { type: 'empty'; date: Date };
