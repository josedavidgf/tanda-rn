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

    createShift: (data: string, token: string) => apiCall(createShift, data, token),
    getMyShifts: (token: string) => apiCall(getMyShifts, token),
    getMyShiftsPublished: (token: string) => apiCall(getMyShiftsPublished, token),
    getShiftById: (id: string, token: string) => apiCall(getShiftById, id, token),
    updateShift: (id: string, updates: any, token: string) => apiCall(updateShift, id, updates, token),
    removeShift: (id: string, token: string) => apiCall(removeShift, id, token),
    getHospitalShifts: (token: string) => apiCall(getHospitalShifts, token),
    getShiftPreferencesByShiftId: (shiftId: string, token: string) => apiCall(getShiftPreferencesByShiftId, shiftId, token),
    updateShiftPreferences: (shiftId: string, preferences: any, token: string) => apiCall(updateShiftPreferences, shiftId, preferences, token),
    getMyAvailableShifts: (workerId: string, token: string) => apiCall(getMyAvailableShifts, workerId, token),
    loading,
    error,
  };
}