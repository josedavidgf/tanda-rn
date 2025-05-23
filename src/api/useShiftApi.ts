import { useState } from 'react';
import {
  createShift,
  getMyShifts,
  getMyShiftsPublished,
  getShiftById,
  updateShift,
  removeShift,
  getHospitalShifts,
  getShiftPreferencesByShiftId,
  updateShiftPreferences,
  getMyAvailableShifts,
} from '@/services/shiftService';

export function useShiftApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async <T>(fn: (...args: any[]) => Promise<T>, ...params: any[]): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fn(...params);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {

    createShift: (data, token) => apiCall(createShift, data, token),
    getMyShifts: (token) => apiCall(getMyShifts, token),
    getMyShiftsPublished: (token) => apiCall(getMyShiftsPublished, token),
    getShiftById: (id, token) => apiCall(getShiftById, id, token),
    updateShift: (id, updates, token) => apiCall(updateShift, id, updates, token),
    removeShift: (id, token) => apiCall(removeShift, id, token),
    getHospitalShifts: (token) => apiCall(getHospitalShifts, token),
    getShiftPreferencesByShiftId: (shiftId, token) => apiCall(getShiftPreferencesByShiftId, shiftId, token),
    updateShiftPreferences: (shiftId, preferences, token) => apiCall(updateShiftPreferences, shiftId, preferences, token),
    getMyAvailableShifts: (workerId, token) => apiCall(getMyAvailableShifts, workerId, token),
    loading,
    error,
  };
}