import { useEffect, useState, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useUserEventsApi } from '@/api/useUserEventsApi';
import { useAuth } from '@/contexts/AuthContext';

export function useUserEventsDot() {
  const { accessToken } = useAuth();
  const { getUserEvents } = useUserEventsApi();
  const [hasUnseen, setHasUnseen] = useState(false);
  const isFocused = useIsFocused();

  const fetchEvents = useCallback(async () => {
    const events = await getUserEvents(accessToken);
    setHasUnseen(events.some((e) => !e.seen));
  }, [accessToken, getUserEvents]);

  useEffect(() => {
    if (isFocused) {
      fetchEvents();
    }
  }, [isFocused, fetchEvents]);

  return hasUnseen;
}
