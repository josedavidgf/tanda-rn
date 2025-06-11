import { useState } from 'react';
import { 
  getAcceptedSwaps, 
  getReceivedSwaps,
  cancelSwap,
  respondToSwap,
  proposeSwap,
  getSentSwaps,
  getSwapById,
  getSwapsByShiftId,
  getSwapNotifications,
  getAcceptedSwapsForDate,
} from '@/services/swapService';

export function useSwapApi() {
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
    getReceivedSwaps: (token) => apiCall(getReceivedSwaps, token),
    cancelSwap: (swapId, token) => apiCall(cancelSwap, swapId, token),
    respondToSwap: (swapId, status, token) => apiCall(respondToSwap, swapId, status, token),
    proposeSwap: (shiftId, data, token) => apiCall(proposeSwap, shiftId, data, token),
    getSentSwaps: (token) => apiCall(getSentSwaps, token),
    getAcceptedSwaps: (token) => apiCall(getAcceptedSwaps, token),
    getAcceptedSwapsForDate: (token, dateStr) => apiCall(getAcceptedSwapsForDate, token, dateStr),
    getSwapById: (swapId, token) => apiCall(getSwapById, swapId, token),
    getSwapsByShiftId: (shiftId, token) => apiCall(getSwapsByShiftId, shiftId, token),
    getSwapNotifications: (token, workerId, myShiftIds) => apiCall(getSwapNotifications, token, workerId, myShiftIds), loading,
    error,
  };
}