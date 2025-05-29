import { useState } from 'react';
import { getMySwapPreferences,
  createSwapPreference, deleteSwapPreference, updateSwapPreference } from '@/services/swapPreferencesService';

export function useSwapPreferencesApi() {
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
    getMySwapPreferences: (workerId: string, token: string) => apiCall(getMySwapPreferences, workerId, token),
    createSwapPreference: (preferenceData: any, token: string) => apiCall(createSwapPreference, preferenceData, token),
    deleteSwapPreference: (preferenceId: string, token:string) => apiCall(deleteSwapPreference, preferenceId, token),
    updateSwapPreference: (preferenceId: string, preferenceType: string, token: string) => apiCall(updateSwapPreference, preferenceId, preferenceType, token),
    loading,
    error,
  };
}