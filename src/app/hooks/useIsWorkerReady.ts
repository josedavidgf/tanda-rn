import { useAuth } from '@/contexts/AuthContext';

export function useIsWorkerReady() {
  const { isWorker, loading } = useAuth();

  const ready = !loading && !!isWorker;

  return {
    isWorker,
    loading,
    ready,
  };
}
