import axios from 'axios';
import { getShiftsForMonth } from './calendarService';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.94:4000';

const handleError = (error: any, defaultMessage = 'Error en la operación') => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

const authHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});
// Crear turno
export const createShift = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/shifts`, data, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al crear turno'));
  }
};

// Obtener mis turnos
export const getMyShifts = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/shifts/mine`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar mis turnos'));
  }
};

// Obtener mis turnos publicados
export const getMyShiftsPublished = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/shifts/mine-published`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar mis turnos publicados'));
  }
};

// Obtener turno por ID -- PUEDE DEPRECARSE
export const getShiftById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/shifts/${id}`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar el turno'));
  }
};

// Actualizar turno --- PUEDE DEPRECARSE
export const updateShift = async (id, updates, token) => {
  try {
    const response = await axios.patch(`${API_URL}/api/shifts/${id}`, updates, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al actualizar turno'));
  }
};

// Eliminar turno (soft delete)
export const removeShift = async (id, token) => {
  try {
    const response = await axios.patch(`${API_URL}/api/shifts/${id}/remove`, null, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al eliminar turno'));
  }
};

// Obtener turnos del hospital
export const getHospitalShifts = async (token) => {
  try {
    const res = await axios.get(
      `${API_URL}/api/shifts/hospital`,
      authHeaders(token)
    );
    return res.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar turnos'));
  }
};



// Obtener preferencias de un turno --- PUEDE DEPRECARSE
export const getShiftPreferencesByShiftId = async (shiftId, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/shifts/${shiftId}/preferences`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar preferencias del turno'));
  }
};

// Actualizar preferencias de un turno
export const updateShiftPreferences = async (shiftId: string, preferences: string[], token: string) => {
  try {
    const response = await axios.put(`${API_URL}/api/shifts/${shiftId}/preferences`, { preferences }, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al actualizar preferencias del turno'));
  }
};

export const getMyAvailableShifts = async (workerId: string) => {
  try {
    const now = new Date();
    const allShifts = await getShiftsForMonth(token, workerId);

    const ownShifts = (allShifts || [])
      .filter(s => new Date(s.date) >= now && s.source === 'manual')
      .map(s => ({
        id: `${s.date}_${s.shift_type}`,
        date: s.date,
        type: s.shift_type,
        label: s.shift_label || 'regular',
      }));

    const receivedShifts = (allShifts || [])
      .filter(s => new Date(s.date) >= now && s.source === 'received_swap')
      .map(s => ({
        id: `${s.date}_${s.shift_type}`,
        date: s.date,
        type: s.shift_type,
        label: s.shift_label || 'received',
        indicator: 'received',
      }));

    return [...ownShifts, ...receivedShifts];
  } catch (error) {
    throw new Error('Error al cargar turnos disponibles');
  }
};

