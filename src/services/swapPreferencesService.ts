import { getDbWithAuth } from '@/lib/supabase';

export async function getMySwapPreferences(workerId: string, token: string) {
  const db = await getDbWithAuth(token);
  console.log('workerId de service', workerId);
  console.log('token', token);
  const { data, error } = await db
    .from('swap_preferences')
    .select('*')
    .eq('worker_id', workerId)
    .order('date', { ascending: true });

    console.log('data', data);

  if (error) throw new Error(error.message || 'Error al cargar preferencias');
  return data;
};

// Crear preferencia
export async function createSwapPreference(preferenceData: {
  workerId: string;
  date: string;
  preferenceType: string;
  hospitalId: string;
  specialtyId: string;
}, token: string) {
  const db = await getDbWithAuth(token);
  try {
    const { data, error } = await db
      .from('swap_preferences')
      .insert([preferenceData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Error al crear preferencia');
    }

    return data;
  } catch (err) {
    console.error('❌ Error en createSwapPreference:', err.message);
    throw err;
  }
}

// Borrar preferencia
export async function deleteSwapPreference(preferenceId: string, token: string) {
  const db = await getDbWithAuth(token);
  try {
    const { error } = await db
      .from('swap_preferences')
      .delete()
      .eq('preference_id', preferenceId);

    if (error) {
      throw new Error(error.message || 'Error al eliminar preferencia');
    }
  } catch (err) {
    console.error('❌ Error en deleteSwapPreference:', err.message);
    throw err;
  }
}

// Actualizar preferencia existente
export async function updateSwapPreference(preferenceId: string, preferenceType: string, token: string) {
  const db = await getDbWithAuth(token);
  try {
    const { data, error } = await db
      .from('swap_preferences')
      .update({ preference_type: preferenceType })
      .eq('preference_id', preferenceId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Error al actualizar preferencia');
    }

    return data;
  } catch (err) {
    console.error('❌ Error en updateSwapPreference:', err.message);
    throw err;
  }
}
