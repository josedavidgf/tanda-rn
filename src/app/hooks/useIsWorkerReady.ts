import { useAuth } from '@/contexts/AuthContext';

export const useIsWorkerReady = () => {
  const { isWorker, appState } = useAuth();
  const ready = appState === 'ready' && !!isWorker;

  return { isWorker, ready };
};