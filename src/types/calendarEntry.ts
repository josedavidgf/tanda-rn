import {Schedule} from './schedule';

export type CalendarEntry = {
  shift_type?: Schedule['shift_type'];
  source?: Schedule['source'];
  related_worker_id?: string;
  related_worker?: { name?: string; surname?: string };
  related_worker_name?: string;
  related_worker_surname?: string;
  swap_id?: string;
  isPublished?: boolean;
  shift_id?: string;
  worker_id?: string;
  isPreference?: boolean;
  preference_types?: string[];
  preferenceIds?: Record<string, string>;
  hasComment?: boolean;
  comment?: string;
  comment_id?: string | null;
};