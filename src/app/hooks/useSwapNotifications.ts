import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useSwapApi } from '@/api/useSwapApi';

export function useSwapNotifications() {
  const { getToken } = useAuth();
  const { getReceivedSwaps } = useSwapApi();
  const [hasPendingSwaps, setHasPendingSwaps] = useState(false);

  const fetchSwaps = useCallback(async () => {
    const token = await getToken();
    const swaps = await getReceivedSwaps(token);
    const pending = swaps.some((s) => s.status === 'proposed');
    setHasPendingSwaps(pending);
  }, [getToken, getReceivedSwaps]);

  useFocusEffect(
    useCallback(() => {
      fetchSwaps();
    }, [fetchSwaps])
  );

  return { hasPendingSwaps };
}
