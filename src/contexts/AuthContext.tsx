// contexts/AuthContext.tsx (funcional con @supabase/auth-js)
import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/lib/supabase';
import { navigationRef } from '@/app/navigation/navigationRef';
import { getMyWorkerProfile } from '@/services/workerService';
import { getPendingOnboardingStep } from '@/utils/onboarding';
import AppLoader from '@/components/ui/AppLoader';

interface AuthContextType {
  session: any; // no usar Session de supabase-js
  setSession: (s: any) => void;
  isWorker: any;
  setIsWorker: (w: any) => void;
  getToken: () => Promise<string>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [isWorker, setIsWorker] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);

  const getToken = async () => {
    const currentSession = await supabase.getSession();
    return currentSession?.data?.session?.access_token || '';
  };

  const restoreSession = async () => {
    try {
      const parsed = await SecureStore.getItemAsync('supabase.session');
      if (!parsed) return;

      let parsedSession;
      try {
        parsedSession = JSON.parse(parsed);
        if (!parsedSession.access_token || !parsedSession.refresh_token) {
          console.warn('[AUTH RN] Session malformada en SecureStore');
          return;
        }
      } catch (err) {
        console.warn('[AUTH RN] Error parseando session:', err.message);
        return;
      }

      await supabase.setSession(parsedSession);

      const restored = await supabase.getSession(); // ✅ ahora sí es el objeto
      const token = restored?.data?.session?.access_token;
      if (!token) {
        console.warn('[AUTH RN] No hay access_token activo');
      } else {
        setSession(restored.data.session);
        const worker = await getMyWorkerProfile(token);
        setIsWorker(worker);
        console.log('[AUTH RN] Sesión restaurada correctamente:', worker);
        const step = getPendingOnboardingStep(worker);
        console.log('[AUTH RN] Paso pendiente de onboarding:', step);

        const navigateToStep = () => {
          if (navigationRef.isReady()) {
            console.log('[AUTH RN] NavigationRef is ready, resetting...');
            navigationRef.reset({
              index: 0,
              routes: [{ name: step ?? 'Calendar' }],
            });
          } else {
            console.warn('[AUTH RN] Navigation not ready yet. Retrying...');
            setTimeout(navigateToStep, 100); // Reintenta hasta que esté listo
          }
        };

        navigateToStep();

      }
      setIsAppReady(true);

    } catch (err) {
      console.warn('[AUTH RN] Error restoring session:', err.message);
      setIsAppReady(true);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const logout = async () => {
    try {
      await supabase.signOut();
      await SecureStore.deleteItemAsync('supabase.session');
    } catch (err) {
      console.warn('Error during logout:', err.message);
    } finally {
      setSession(null);
      setIsWorker(null);
    }
  };


  if (!isAppReady) return <AppLoader onFinish={() => setIsAppReady(true)} />;

  return (
    <AuthContext.Provider
      value={{ session, setSession, isWorker, setIsWorker, getToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
