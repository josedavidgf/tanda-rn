import { useState } from 'react';
import { getShiftsForMonth, setShiftForDay, removeShiftForDay } from '../services/calendarService';

export function useCalendarApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (apiFunction, ...params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFunction(...params);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getShiftsForMonth: (workerId) => apiCall(getShiftsForMonth, workerId),
    setShiftForDay: (workerId, dateStr, shiftType) => apiCall(setShiftForDay, workerId, dateStr, shiftType),
    removeShiftForDay: (workerId, dateStr) => apiCall(removeShiftForDay, workerId, dateStr),
    loading,
    error,
  };
}
