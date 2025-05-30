// contexts/AuthContext.tsx (refactor con listener de autenticación reactivo)
import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/lib/supabase';
import { navigationRef } from '@/app/navigation/navigationRef';
import { useWorkerApi } from '@/api/useWorkerApi';
import { getPendingOnboardingStep } from '@/utils/onboarding';
import AppLoader from '@/components/ui/AppLoader';
import ErrorScreen from '@/components/ui/ErrorScreen';

interface AuthContextType {
  session: any;
  setSession: (s: any) => void;
  isWorker: any;
  setIsWorker: (w: any) => void;
  accessToken: string | null;
  user?: any;
  logout: () => Promise<void>;
  appState: appState;
}
type appState = 'loading' | 'ready' | 'error';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getMyWorkerProfile, initWorker } = useWorkerApi();
  const [session, setSession] = useState<any>(null);
  const [isWorker, setIsWorker] = useState(null);
  const [appState, setAppState] = useState<appState>('loading');

  console.log('[AUTH RN] Iniciando AuthProvider...');

  async function getOrCreateWorker(token: string) {
    try {
      return await getMyWorkerProfile(token);
    } catch (err) {
      console.warn('[AUTH RN] No existe worker, intentamos crearlo:', err.message);

      try {
        await initWorker(token);
        console.log('[AUTH RN] Worker creado');
        return await getMyWorkerProfile(token);
      } catch (err2) {
        console.warn('[AUTH RN] Error creando worker:', err2.message);
        throw err2;
      }
    }
  }

  const restoreSession = async () => {
    console.log('[AUTH RN] Restaurando sesión desde SecureStore...');
    try {
      const parsed = await SecureStore.getItemAsync('supabase.session');
      if (!parsed) {
        console.warn('[AUTH RN] No session en SecureStore');
        setAppState('ready');
        return;
      }

      let parsedSession;
      try {
        parsedSession = JSON.parse(parsed);
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
      const restored = await supabase.getSession();
      const token = restored?.data?.session?.access_token;
      if (!token) {
        console.warn('[AUTH RN] No access_token activo tras restaurar');
        setAppState('ready');
        return;
      }

      setSession(restored.data.session);
      const worker = await getOrCreateWorker(token);
      setIsWorker(worker);

      const step = getPendingOnboardingStep(worker);
      const navigateToStep = () => {
        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: step ?? 'Calendar' }],
          });
        } else {
          setTimeout(navigateToStep, 50);
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

    const { data: listener } = supabase.onAuthStateChange(async (event, session) => {
      console.log('[AUTH RN] Evento Supabase:', event);

      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        await SecureStore.setItemAsync('supabase.session', JSON.stringify(session));

        try {
          const token = session.access_token;
          console.log('[AUTH RN] Sesión iniciada con token:', token);
          const worker = await getOrCreateWorker(token);
          console.log('[AUTH RN] Worker obtenido:', worker);
          setIsWorker(worker);

          const step = getPendingOnboardingStep(worker);
          if (navigationRef.isReady()) {
            navigationRef.reset({
              index: 0,
              routes: [{ name: step ?? 'Calendar' }],
            });
          }

          setAppState('ready');
        } catch (err) {
          console.warn('[AUTH RN] Error obteniendo worker tras login:', err.message);
          setAppState('ready');
        }
      }

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setIsWorker(null);
        setAppState('ready');
        await SecureStore.deleteItemAsync('supabase.session');
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    console.log('[AUTH RN] Cerrar sesión');
    try {
      console.log('[AUTH RN] Llamando a supabase.signOut()');
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
      value={{
        session,
        setSession,
        isWorker,
        setIsWorker,
        accessToken: session?.access_token,
        user: session?.user,
        logout,
        appState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
