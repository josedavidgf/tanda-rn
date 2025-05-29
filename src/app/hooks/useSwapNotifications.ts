import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useSwapApi } from '@/api/useSwapApi';

export function useSwapNotifications() {
  const { accessToken } = useAuth();
  const { getReceivedSwaps } = useSwapApi();
  const [hasPendingSwaps, setHasPendingSwaps] = useState(false);

  const fetchSwaps = useCallback(async () => {
    const swaps = await getReceivedSwaps(accessToken);
    const pending = swaps.some((s) => s.status === 'proposed');
    setHasPendingSwaps(pending);
  }, [accessToken, getReceivedSwaps]);

  useFocusEffect(
    useCallback(() => {
      fetchSwaps();
    }, [fetchSwaps])
  );

  return { hasPendingSwaps };
}
