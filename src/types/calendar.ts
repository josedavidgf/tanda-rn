export type PreferenceType = 'morning' | 'evening' | 'night' | 'reinforcement';
export type ShiftType = 'morning' | 'evening' | 'night' | 'reinforcement';

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
  worker: {
    name: string;
    surname: string;
  };
  related_worker_id: string;
  related_worker_name: string;
  related_worker_surname: string;
  swap_id: string;
  worker_id: string;
};

export type ShiftEntry = {
  type: 'morning' | 'evening' | 'night' | 'reinforcement';
  source: 'manual' | 'received_swap' | 'swapped_out';
  shift_id?: string;
  isPublished?: boolean;
  related_worker_name?: string;
  related_worker_surname?: string;
  swap_id?: string;
};

export type CalendarEntry = {
  shifts?: ShiftEntry[];
  isPreference?: boolean;
  preference_types?: string[];
  preferenceIds?: Record<string, string>;
  hasComment?: boolean;
  comment?: string;
  comment_id?: string | null;
};

export type CalendarMap = Record<string, CalendarEntry>;

export type MergeCalendarParams = {
  monthlySchedules: Schedule[];
  preferences: Preference[];
  shifts: PublishedShift[];
  comments?: Array<{ comment_id: string; comment: string; date: string }>;
};

export type PublishedShift = {
  shift_id: string;
  date: string;
  shift_type: 'morning' | 'evening' | 'night' | 'reinforcement';
};