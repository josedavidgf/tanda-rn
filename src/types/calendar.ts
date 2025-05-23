

export type PreferenceType = 'morning' | 'evening' | 'night' | 'reinforcement';

export type Preference = {
  preference_id: string;
  worker_id: string;
  date: string; // ISO string: 'YYYY-MM-DD'
  preference_type: PreferenceType;
  created_at: string; // ISO timestamp
};

export type SwapStatus = 'proposed' | 'accepted' | 'rejected' | 'cancelled';

export type Swap = {
  swap_id: string;
  shift_id: string;
  requester_id: string;
  receiver_id: string;
  status: SwapStatus;
  created_at: string; // ISO timestamp
};

export type Schedule = {
  date: string;
  shift_type: 'morning' | 'evening' | 'night' | 'reinforcement';
  source: 'manual' | 'received_swap' | 'swapped_out';
  related_worker_id: string;
  related_worker: {
    name: string;
    surname: string;
  };
  swap_id: string;
  worker_id: string;
  shift: {
    shift_id: string;
    date: string;
    shift_type: 'morning' | 'evening' | 'night' | 'reinforcement';
  };
  isPublished: boolean;
  shift_id: string;
};

export type CalendarEntry = {
  shift_type: Schedule['shift_type'];
  source: Schedule['source'];
  related_worker_id: string;
  related_worker: { name: string; surname: string };
  related_worker_name: string;
  related_worker_surname: string;
  swap_id: string;
  isPublished: boolean;
  shift_id: string;
  worker_id: string;
  isPreference: boolean;
  preference_types: string[];
  preferenceIds: Record<string, string>;
};

export type CalendarMap = Record<string, CalendarEntry>;

export type MergeCalendarParams = {
  monthlySchedules: Schedule[];
  preferences: Preference[];
  shifts: PublishedShift[];
  swaps?: any[];
};

export type PublishedShift = {
  shift_id: string;
  date: string;
  shift_type: 'morning' | 'evening' | 'night' | 'reinforcement';
};