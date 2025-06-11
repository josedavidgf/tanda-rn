import { useState } from 'react';
import { 
  getShiftsForMonth, 
  setShiftForDay, 
  removeShiftForDay, 
  updateShiftForDay, 
  clearSwappedOutShift,
  getShiftForDay,
  updateShiftSource
 } from '../services/calendarService';

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
    getShiftsForMonth: (token:string, workerId:string) => apiCall(getShiftsForMonth, token, workerId),
    setShiftForDay: (token:string, workerId:string, dateStr:string, shiftType:string) => apiCall(setShiftForDay, token, workerId, dateStr, shiftType),
    updateShiftForDay: (token:string, scheduleId:string, newType:string) => apiCall(updateShiftForDay, token, scheduleId, newType),
    removeShiftForDay: (token:string, workerId:string, dateStr:string, shiftType:string) => apiCall(removeShiftForDay, token, workerId, dateStr, shiftType),
    clearSwappedOutShift: (token:string, workerId:string, dateStr:string) => apiCall(clearSwappedOutShift, token, workerId, dateStr),
    getShiftForDay:(token:string, workerId:string, dateStr:string, shiftType:string) => apiCall(getShiftForDay, token, workerId, dateStr, shiftType),
    updateShiftSource:(token:string, scheduleId:string, newSource:string) => apiCall(updateShiftSource, token, scheduleId, newSource),
    loading,
    error,
  };
}
