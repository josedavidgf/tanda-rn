// src/services/messagesService.js
import {supabase} from '@/lib/supabase';


// Obtener mensajes de un swap
export const getMessagesBySwap = async (swapId) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('swap_id', swapId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(error.message || 'Error al cargar mensajes');
    }

    return data;
  } catch (err) {
    console.error('❌ Error en getMessagesBySwap:', err.message);
    throw err;
  }
};

// Enviar un mensaje en un swap
export const sendMessage = async ({ swap_id, sender_id, recipient_id, content }) => {
  console.log('Sending message:', { swap_id, sender_id, recipient_id, content });
  try {
    if (!content || !content.trim()) {
      throw new Error('Mensaje vacío');
    }

    const { error } = await supabase
      .from('messages')
      .insert([{ swap_id, sender_id, recipient_id, content }]);

    if (error) {
      throw new Error(error.message || 'Error al enviar mensaje');
    }
  } catch (err) {
    console.error('❌ Error en sendMessage:', err.message);
    throw err;
  }
};