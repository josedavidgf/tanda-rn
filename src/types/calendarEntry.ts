export type ShiftType = 'morning' | 'evening' | 'night' | 'reinforcement';
export type ShiftSource = 'manual' | 'received_swap' | 'swapped_out';

export interface ShiftEntry {
  type: ShiftType;
  source: ShiftSource;
  shift_id?: string;
  isPublished?: boolean;

  /** Extra para turnos recibidos */
  related_worker_name?: string;
  related_worker_surname?: string;
  swap_id?: string;
}

export interface CalendarEntry {
  // NUEVO: lista de turnos del día
  shifts?: ShiftEntry[];

  // Intercambios recibidos
  related_worker_name?: string;
  related_worker_surname?: string;
  swap_id?: string;

  // Preferencias
  isPreference?: boolean;
  preference_types?: ShiftType[];
  preferenceIds?: Record<ShiftType, string>;

  // Comentarios
  hasComment?: boolean;
}
