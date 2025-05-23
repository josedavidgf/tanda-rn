import { supabase } from '@/lib/supabase';

export const getMySwapPreferences = async (workerId: string) => {
  const { data, error } = await supabase
    .from('swap_preferences')
    .select('*')
    .eq('worker_id', workerId)
    .order('date', { ascending: true });

  if (error) throw new Error(error.message || 'Error al cargar preferencias');
  return data;
};

// Crear preferencia
export async function createSwapPreference(preferenceData) {
  try {
    const { data, error } = await supabase
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
export async function deleteSwapPreference(preferenceId) {
  try {
    const { error } = await supabase
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
export async function updateSwapPreference(preferenceId, preferenceType) {
  try {
    const { data, error } = await supabase
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
