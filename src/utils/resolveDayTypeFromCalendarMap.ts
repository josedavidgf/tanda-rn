import { format } from 'date-fns';

type CalendarEntry = {
    shift_type?: string;
    source?: 'manual' | 'received_swap' | 'swapped_out';
    isPublished?: boolean;
    isPreference?: boolean;
    preference_types?: string[];
};

export function resolveDayTypeFromCalendarMap(entry: CalendarEntry | undefined, date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd');

    if (!entry) {
        return { 
            type: 'empty', 
            date: dateStr 
        };
    }

    if (entry.source === 'swapped_out') {
        return {
            type: 'swapped',
            date: dateStr,
            shift: entry,
        };
    }

    if (entry.source === 'received_swap') {
        return {
            type: 'received',
            date: dateStr,
            shift: entry,
        };

    }

    if (entry.isPreference && !entry.shift_type) {
        return {
            type: 'preference',
            date: dateStr,
            preference: {
                preference_types: entry.preference_types || []
            }
        };

    }

    if (entry.shift_type) {
        return {
            type: 'my_shift',
            date: dateStr,
            shift: entry,
            isPublished: entry.isPublished || false,
        };
    }


    return { type: 'empty', date: dateStr };
}