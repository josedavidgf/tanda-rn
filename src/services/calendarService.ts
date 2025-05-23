import { supabase } from '../lib/supabase';
import { endOfMonth, format } from 'date-fns';

export async function getMonthlySchedules(workerId: string, year: number, month: number) {
  const from = `${year}-${month.toString().padStart(2, '0')}-01`;
  const endDate = endOfMonth(new Date(year, month - 1));
  const to = format(endDate, 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from('monthly_schedules')
    .select('*')
    .eq('worker_id', workerId)
    .gte('date', from)
    .lte('date', to);

  if (error) throw error;
  return data;
}

export async function setShiftForDay(workerId: string, dateStr: string, shiftType: string) {
  const { error } = await supabase
    .from('monthly_schedules')
    .upsert(
      {
        worker_id: workerId,
        date: dateStr,
        shift_type: shiftType,
        source: 'manual',
      },
      { onConflict: ['worker_id', 'date'] }
    );

  if (error) throw new Error(error.message);
}

export async function removeShiftForDay(workerId: string, dateStr: string) {
  const { error } = await supabase
    .from('monthly_schedules')
    .delete()
    .eq('worker_id', workerId)
    .eq('date', dateStr);

  if (error) throw new Error(error.message);
}

// Obtener turnos del mes para un worker
export async function getShiftsForMonth(workerId) {
  try {
    const { data, error } = await supabase
      .from('monthly_schedules')
      .select(`*,
            related_worker:related_worker_id (
          name,
          surname
          )
        `)
      .eq('worker_id', workerId);

    if (error) {
      throw new Error(error.message || 'Error al cargar turnos del mes');
    }

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('❌ Error en getShiftsForMonth:', err.message);
    return [];
  }
}

// Publicar un turno directamente en la tabla de shifts
export async function publishShiftFromCalendar(workerId, shiftType, date) {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .insert([
        {
          worker_id: workerId,
          shift_type: shiftType,
          date,
          status: 'published',
          source: 'calendar',
        }
      ]);

    if (error) {
      throw new Error(error.message || 'Error al publicar turno');
    }

    return data;
  } catch (err) {
    console.error('❌ Error en publishShiftFromCalendar:', err.message);
    throw err;
  }
}

// Utilidad para offset del día
export function getDayOffset(date) {
  const day = getDay(date); // 0 (Sun) - 6 (Sat)
  return day === 0 ? 6 : day - 1;
}
