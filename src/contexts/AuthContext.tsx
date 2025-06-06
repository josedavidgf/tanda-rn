// contexts/AuthContext.tsx (simplificado confiando en Supabase para persistencia y refresh)
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { navigationRef } from '@/app/navigation/navigationRef';
import { useWorkerApi } from '@/api/useWorkerApi';
import { getPendingOnboardingStep } from '@/utils/onboarding';
import AppLoader from '@/components/ui/AppLoader';
import ErrorScreen from '@/components/ui/ErrorScreen';
import AmplitudeService from '@/lib/amplitude';
import { registerForPushNotificationsAsync } from '@/lib/registerForPushNotifications';


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

let isAmplitudeInitialized = false; // 👈 fuera del componente


export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getMyWorkerProfile, initWorker } = useWorkerApi();
  const [session, setSession] = useState<any>(null);
  const [isWorker, setIsWorker] = useState(null);
  const [appState, setAppState] = useState<appState>('loading');

  console.log('[AUTH RN] Iniciando AuthProvider...');

  async function getOrCreateWorker(token: string) {
    console.log('[AUTH RN] Obteniendo o creando worker con token:');

    try {
      const worker = await getMyWorkerProfile(token);

      if (!worker) {
        console.warn('[AUTH RN] Worker es null. Lo creamos...');
        await initWorker(token);

        const newWorker = await getMyWorkerProfile(token);
        if (!newWorker) {
          throw new Error('[AUTH RN] Worker sigue siendo null tras crearlo.');
        }

        console.log('[AUTH RN] Worker creado:', newWorker);
        return newWorker;
      }

      console.log('[AUTH RN] Worker ya existía:', worker);
      return worker;
    } catch (err: any) {
      console.error('[AUTH RN] Error inesperado en getOrCreateWorker:', err.message);
      throw err;
    }
  }

  useEffect(() => {
    supabase.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        const token = data.session.access_token;

        if (!isAmplitudeInitialized) {
          try {
            AmplitudeService.init();
            isAmplitudeInitialized = true;
          } catch (err: any) {
            console.warn('[AUTH RN] Error iniciando Amplitude:', err.message);
          }
        }

        (async () => {
          try {
            const worker = await getOrCreateWorker(token);
            setIsWorker(worker);
            AmplitudeService.identify(worker);

            try {
              await registerForPushNotificationsAsync(data.session.user.id, token);
            } catch (err) {
              console.warn('[PUSH RN] No se pudo registrar token:', err.message);
            }

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
            console.warn('[AUTH RN] Error en getOrCreateWorker inicial:', err.message);
            setAppState('error');
          }
        })();
      } else {
        setAppState('ready');
      }
    });

    const { data: listener } = supabase.onAuthStateChange(async (event, session) => {
      console.log('[AUTH RN] Evento Supabase:', event);

      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        try {
          const token = session.access_token;
          const worker = await getOrCreateWorker(token);
          setIsWorker(worker);
          AmplitudeService.identify(worker); // ✅ añade esto

          // 🔔 Registrar token push
          try {
            await registerForPushNotificationsAsync(session.user.id, token);
          } catch (err) {
            console.warn('[PUSH RN] No se pudo registrar token:', err.message);
          }
          
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
        AmplitudeService.reset();
        setAppState('ready');
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
    } catch (err) {
      console.warn('Error during logout:', err.message);
    } finally {
      setSession(null);
      setIsWorker(null);
      AmplitudeService.reset();
    }
  };

  if (appState === 'loading') return <AppLoader message="Cargando Tanda..." />;
  if (appState === 'error') return <ErrorScreen retry={() => setAppState('loading')} />;

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