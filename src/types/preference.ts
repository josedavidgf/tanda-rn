export type PreferenceType = 'morning' | 'evening' | 'night' | 'reinforcement';

export type Preference = {
  preference_id: string;
  worker_id: string;
  date: string; // ISO string: 'YYYY-MM-DD'
  preference_type: PreferenceType;
  created_at: string; // ISO timestamp
};
