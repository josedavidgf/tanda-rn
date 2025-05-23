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
    getMySwapPreferences: (workerId: string) => apiCall(getMySwapPreferences, workerId),
    createSwapPreference: (preferenceData: any) => apiCall(createSwapPreference, preferenceData),
    deleteSwapPreference: (preferenceId: string) => apiCall(deleteSwapPreference, preferenceId),
    updateSwapPreference: (preferenceId: string, preferenceType: string) => apiCall(updateSwapPreference, preferenceId, preferenceType),
    loading,
    error,
  };
}