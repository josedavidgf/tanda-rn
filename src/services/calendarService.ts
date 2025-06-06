import { getDbWithAuth } from '@/lib/supabase';
import { endOfMonth, format } from 'date-fns';

type MonthlySchedule = {
  worker_id: string;
  date: string;
  shift_type: string;
  source?: string;
};

export async function getMonthlySchedules(token: string, workerId: string, year: number, month: number) {
  const db = getDbWithAuth(token);
  const from = `${year}-${month.toString().padStart(2, '0')}-01`;
  const endDate = endOfMonth(new Date(year, month - 1));
  const to = format(endDate, 'yyyy-MM-dd');

  const { data, error } = await db
    .from('monthly_schedules')
    .select('*')
    .eq('worker_id', workerId)
    .gte('date', from)
    .lte('date', to);


  if (error) throw new Error(error.message);
  return data;
}

export async function setShiftForDay(token: string, workerId: string, dateStr: string, shiftType: string) {
  const db = getDbWithAuth(token);

  const { error } = await db
    .from('monthly_schedules')
    .upsert(
      {
        worker_id: workerId,
        date: dateStr,
        shift_type: shiftType,
        source: 'manual',
      },
    );

  if (error) throw new Error(error.message);
}
export async function updateShiftForDay(
  token: string,
  workerId: string,
  dateStr: string,
  originalType: string,
  newType: string
) {
  const db = getDbWithAuth(token);

  const { error } = await db
    .from('monthly_schedules')
    .update({ shift_type: newType })
    .eq('worker_id', workerId)
    .eq('date', dateStr)
    .eq('shift_type', originalType)
    .eq('source', 'manual');

  if (error) throw new Error(error.message);
}


export async function removeShiftForDay(token: string, workerId: string, dateStr: string, shiftType: string) {
  const db = getDbWithAuth(token);

  const { error } = await db
    .from('monthly_schedules')
    .delete()
    .eq('worker_id', workerId)
    .eq('date', dateStr)
    .eq('shift_type', shiftType);

  if (error) throw new Error(error.message);
}

// Obtener turnos del mes para un worker
export async function getShiftsForMonth(token: string, workerId: string) {
  const db = getDbWithAuth(token);

  try {
    const { data, error } = await db
      .from('monthly_schedules')
      .select('*')
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
export async function publishShiftFromCalendar(token: string, workerId: string, shiftType: string, date: string) {
  try {
    const db = getDbWithAuth(token);
    const { data, error } = await db
      .from('shifts')
      .insert([
        {
          worker_id: workerId,
          shift_type: shiftType,
          date,
          status: 'published',
          source: 'manual',
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
