// src/services/messagesService.js
import { getDbWithAuth } from '@/lib/supabase';

// Get
export async function getWorkerShiftHours(token: string, workerId: string) {
  const db = getDbWithAuth(token);

  const DEFAULT_HOURS = 7;

  const { data, error } = await db
    .from('worker_shift_hours')
    .select('morning, evening, night, reinforcement')
    .eq('worker_id', workerId)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message); // PGRST116: no rows found

  return {
    morning: data?.morning ?? DEFAULT_HOURS,
    evening: data?.evening ?? DEFAULT_HOURS,
    night: data?.night ?? DEFAULT_HOURS,
    reinforcement: data?.reinforcement ?? DEFAULT_HOURS,
  };
}
    

type ShiftHours = {
  morning: number;
  evening: number;
  night: number;
  reinforcement: number;
};

export async function setWorkerShiftHours(
  token: string,
  workerId: string,
  hours: ShiftHours
) {
  const db = getDbWithAuth(token);

  const { error } = await db
    .from('worker_shift_hours')
    .upsert({
      worker_id: workerId,
      morning: hours.morning,
      evening: hours.evening,
      night: hours.night,
      reinforcement: hours.reinforcement,
      updated_at: new Date().toISOString(),
    });

  if (error) throw new Error(error.message);
}
