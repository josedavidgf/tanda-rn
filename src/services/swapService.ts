// src/services/swapService.js
import axios from 'axios';
import { getDbWithAuth } from '@/lib/supabase';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.92:4000';


const authHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getAcceptedSwaps = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/swaps/accepted`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    console.error('[swapService] Error getAcceptedSwaps:', error);
    throw new Error(handleError(error, 'Error al cargar swaps aceptados'));
  }
};


// Utilidad interna para capturar errores de Axios
const handleError = (error, defaultMessage = 'Error en la operación') => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

// Obtener swaps recibidos
export const getReceivedSwaps = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/swaps/received`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar swaps recibidos'));
  }
};

// Anular un swap
export const cancelSwap = async (swapId, token) => {
  try {
    const response = await axios.patch(`${API_URL}/api/swaps/${swapId}/cancel`, {}, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al anular intercambio'));
  }
};

// Responder a un swap (aceptar/rechazar)
export const respondToSwap = async (swapId, status, token) => {
  try {
    const response = await axios.patch(`${API_URL}/api/swaps/${swapId}/respond`, { status }, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al responder al intercambio'));
  }
};

// Proponer un nuevo swap
export const proposeSwap = async (shiftId, data, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/swaps`, { shift_id: shiftId, ...data }, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al proponer intercambio'));
  }
};

// Obtener swaps enviados
export const getSentSwaps = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/swaps/sent`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar swaps enviados'));
  }
};

// Obtener un swap por ID
export const getSwapById = async (swapId, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/swaps/${swapId}`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar detalles del intercambio'));
  }
};

// Obtener swaps asociados a un shift -- PUEDE DEPRECARSE
export const getSwapsByShiftId = async (shiftId, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/swaps/by-shift/${shiftId}`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar intercambios del turno'));
  }
};

// Obtener notificaciones de swaps (consultando directamente en Supabase)  --- SE USA EN EL DASHBOARD - PUEDE DEPRECARSE
export const getSwapNotifications = async (token, workerId, myShiftIds) => {
  const db = await getDbWithAuth(token);
  try {
    if (!workerId || !Array.isArray(myShiftIds) || myShiftIds.length === 0) {
      return { incomingCount: 0, updatesCount: 0 };
    }

    const { data: incoming, error: errorIncoming } = await db
      .from('swaps')
      .select('swap_id')
      .eq('status', 'proposed')
      .in('shift_id', myShiftIds);

    const { data: updates, error: errorUpdates } = await db
      .from('swaps')
      .select('swap_id, status')
      .eq('requester_id', workerId)
      .in('status', ['accepted', 'rejected']);

    if (errorIncoming || errorUpdates) {
      console.error('❌ Error fetching swap notifications');
      return { incomingCount: 0, updatesCount: 0 };
    }

    return {
      incomingCount: incoming?.length || 0,
      updatesCount: updates?.length || 0,
    };
  } catch (error) {
    console.error('❌ Error en getSwapNotifications:', error.message);
    return { incomingCount: 0, updatesCount: 0 };
  }
};
