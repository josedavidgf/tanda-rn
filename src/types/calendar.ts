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
  offered_date: string;
  offered_type: ShiftType;
  offered_label?: string;
  swap_comments?: string;
  swap_type: 'regular' | 'no_return';
  status: 'accepted' | 'proposed' | 'rejected' | 'cancelled';
  created_at: string;

  shift: {
    shift_id: string;
    date: string;
    shift_type: string;
    shift_label?: string;
    shift_comments?: string;
    worker: {
      worker_id: string;
      name: string;
      surname: string;
      mobile_country_code: string;
      mobile_phone: string;
    };
  };

  requester: {
    worker_id: string;
    name: string;
    surname: string;
    mobile_country_code: string;
    mobile_phone: string;
  };
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
  id: string;
};

export type ShiftEntry = {
  id: string;
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