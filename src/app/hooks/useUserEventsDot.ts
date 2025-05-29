import { useEffect, useState, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useUserEventsApi } from '@/api/useUserEventsApi';
import { useAuth } from '@/contexts/AuthContext';

export function useUserEventsDot() {
  const { getToken } = useAuth();
  const { getUserEvents } = useUserEventsApi();
  const [hasUnseen, setHasUnseen] = useState(false);
  const isFocused = useIsFocused();

  const fetchEvents = useCallback(async () => {
    const token = await getToken();
    const events = await getUserEvents(token);
    setHasUnseen(events.some((e) => !e.seen));
  }, [getToken, getUserEvents]);

  useEffect(() => {
    if (isFocused) {
      fetchEvents();
    }
  }, [isFocused, fetchEvents]);

  return hasUnseen;
}
