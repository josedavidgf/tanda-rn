import { useState } from 'react';
import {
  getUserEvents,
  markUserEventsAsSeen,
} from '../services/userEventsService';

export function useUserEventsApi() {
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
    getUserEvents: (token) => apiCall(getUserEvents, token),
    markUserEventsAsSeen: (token) => apiCall(markUserEventsAsSeen, token),
    loading,
    error,
  };
}
