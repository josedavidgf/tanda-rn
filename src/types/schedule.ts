export type Schedule = {
  date: string;
  shift_type: 'morning' | 'evening' | 'night' | 'reinforcement';
  source: 'manual' | 'received_swap' | 'swapped_out';
  related_worker_id?: string;
  related_worker?: {
    name?: string;
    surname?: string;
  };
  swap_id?: string;
  worker_id: string;
  shift: {
    shift_id: string;
    date: string;
    shift_type: 'morning' | 'evening' | 'night' | 'reinforcement';
  };
  isPublished?: boolean;
  shift_id?: string;
};