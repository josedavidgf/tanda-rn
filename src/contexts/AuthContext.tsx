// contexts/AuthContext.tsx (funcional con @supabase/auth-js)
import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/lib/supabase';
import { navigationRef } from '@/app/navigation/navigationRef';
import { getMyWorkerProfile } from '@/services/workerService';
import { getPendingOnboardingStep } from '@/utils/onboarding';
import AppLoader from '@/components/ui/AppLoader';
import ErrorScreen from '@/components/ui/ErrorScreen';

interface AuthContextType {
  session: any; // no usar Session de supabase-js
  setSession: (s: any) => void;
  isWorker: any;
  setIsWorker: (w: any) => void;
  getToken: () => Promise<string>;
  logout: () => Promise<void>;
  appState: appState;
}
type appState = 'loading' | 'ready' | 'error';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [isWorker, setIsWorker] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const [appState, setAppState] = useState<appState>('loading');


  console.log('[AUTH RN] Iniciando AuthProvider...');

  const getToken = async () => {
    console.log('[AUTH RN] Obteniendo token de sesión...');
    const currentSession = await supabase.getSession();
    console.log('[AUTH RN] Sesión actual:', currentSession);
    return currentSession?.data?.session?.access_token || '';
  };

  const restoreSession = async () => {
    console.log('[AUTH RN] Restaurando sesión desde SecureStore...');
    try {
      const parsed = await SecureStore.getItemAsync('supabase.session');
      if (!parsed) {
        console.warn('[AUTH RN] No session en SecureStore');
        setAppState('ready');
        return;
      }

      console.log('[AUTH RN] Session encontrada en SecureStore:', parsed);

      let parsedSession;
      try {
        parsedSession = JSON.parse(parsed);
        console.log('[AUTH RN] Session parseada:', parsedSession);
        if (!parsedSession.access_token || !parsedSession.refresh_token) {
          console.warn('[AUTH RN] Session malformada en SecureStore');
          setAppState('ready');
          return;
        }
      } catch (err) {
        console.warn('[AUTH RN] Error parseando sesión:', err.message);
        setAppState('ready');
        return;
      }

      await supabase.setSession(parsedSession);
      console.log('[AUTH RN] Sesión restaurada correctamente en Supabase');
      const restored = await supabase.getSession();
      const token = restored?.data?.session?.access_token;
      if (!token) {
        console.warn('[AUTH RN] No access_token activo tras restaurar');
        setAppState('ready');
        return;
      }

      setSession(restored.data.session);
      const worker = await getMyWorkerProfile(token);
      setIsWorker(worker);

      console.log('isWorker AuthContext:', worker);

      const step = getPendingOnboardingStep(worker);
      const navigateToStep = () => {
        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: step ?? 'Calendar' }],
          });
        } else {
          setTimeout(navigateToStep, 100);
        }
      };

      navigateToStep();
      setAppState('ready');

    } catch (err) {
      console.warn('[AUTH RN] Error restoring session:', err.message);
      setAppState('error');
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


  if (appState === 'loading') return <AppLoader message="Cargando Tanda..." />;
  if (appState === 'error') return <ErrorScreen retry={restoreSession} />;

  return (
    <AuthContext.Provider
      value={{ session, setSession, isWorker, setIsWorker, getToken, logout, appState }}
    >
      {children} 
    </AuthContext.Provider>
  );
}
