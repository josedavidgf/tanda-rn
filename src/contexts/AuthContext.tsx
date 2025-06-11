// contexts/AuthContext.tsx (simplificado confiando en Supabase para persistencia y refresh)
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { navigationRef } from '@/app/navigation/navigationRef';
import { useWorkerApi } from '@/api/useWorkerApi';
import { getPendingOnboardingStep } from '@/utils/onboarding';
import AppLoader from '@/components/ui/AppLoader';
import ErrorScreen from '@/components/ui/ErrorScreen';
import AmplitudeService from '@/lib/amplitude';
import { trackEvent } from '@/app/hooks/useTrackPageView';
//import { OneSignal } from 'react-native-onesignal';
import { handleDeeplinkNavigation } from '@/utils/handleDeeplinkNavigation';
import { translateWorkerType } from '@/utils/useTranslateServices';
import * as Sentry from '@sentry/react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';


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
  const isProduction = Boolean(process.env.EXPO_PUBLIC_ENV === 'production');


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

  if (isProduction) {
    useEffect(() => {
      const appId = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;

      if (!appId) return;


      OneSignal.initialize(appId);
      OneSignal.Notifications.requestPermission(true);

      OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
        const data = event.notification?.additionalData as { route?: string; params?: Record<string, any> } | undefined;
        if (data && typeof data === 'object' && 'route' in data) {
          trackEvent('push_received_foreground', {
            route: (data as any).route,
            ...(data as any).params,
          });
        }
      });

      OneSignal.Notifications.addEventListener('click', (event) => {
        const data = event.notification?.additionalData as { route?: string; params?: Record<string, any> } | undefined;;
        if (data?.route) {
          trackEvent('push_clicked', {
            route: data.route,
            ...data.params,
          });

          handleDeeplinkNavigation(data);
        }
      });
    }, []);
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
            const fullName =
              worker.name && worker.surname
                ? `${worker.name} ${worker.surname}`
                : worker.name || worker.surname || undefined;
            const workerTypeName = translateWorkerType(worker.worker_types?.worker_type_name) || '';
            try {
              Sentry.setUser({
                id: worker.worker_id,
                email: session.user.email,
                username: fullName,
              });

              Sentry.setContext('worker', {
                hospital: worker.workers_hospitals?.[0]?.hospitals?.name || '',
                speciality: worker.workers_specialities?.[0]?.specialities?.speciality_category || '',
                workerType: workerTypeName,
              });
              Sentry.setContext('device', {
                manufacturer: Device.manufacturer,
                model: Device.modelName,
                os: `${Device.osName} ${Device.osVersion}`,
                totalMemory: Device.totalMemory,
                isDevice: Device.isDevice,
                deviceName: Device.deviceName,
              });

              Sentry.setContext('app', {
                appName: Application.applicationName,
                version: Application.nativeApplicationVersion,
                build: Application.nativeBuildVersion,
              });
            } catch (err) {
              console.warn('[AUTH RN] Error configurando Sentry:', err.message);
            }
            if (isProduction) {
              if (session) {
                try {

                  await OneSignal.login(session?.user.id);
                  await OneSignal.User.addEmail(worker.email || '');

                  await OneSignal.User.addTags({
                    ...(fullName && { fullName: fullName }),
                    ...(workerTypeName && { role: workerTypeName }),
                    ...(worker.workers_hospitals?.[0]?.hospitals?.name && { hospital_name: worker.workers_hospitals?.[0]?.hospitals?.name }),
                  });
                } catch (err) {
                  console.warn('[AUTH RN] Error iniciando sesión en OneSignal:', err.message);
                }
              }
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

          const fullName =
            worker.name && worker.surname
              ? `${worker.name} ${worker.surname}`
              : worker.name || worker.surname || undefined;
          const workerTypeName = translateWorkerType(worker.worker_types?.worker_type_name) || '';
          try {
            Sentry.setUser({
              id: worker.worker_id,
              email: session.user.email,
              username: fullName,
            });

            Sentry.setContext('worker', {
              hospital: worker.workers_hospitals?.[0]?.hospitals?.name || '',
              speciality: worker.workers_specialities?.[0]?.specialities?.speciality_category || '',
              workerType: workerTypeName,
            });
            Sentry.setContext('device', {
              manufacturer: Device.manufacturer,
              model: Device.modelName,
              os: `${Device.osName} ${Device.osVersion}`,
              totalMemory: Device.totalMemory,
              isDevice: Device.isDevice,
              deviceName: Device.deviceName,
            });

            Sentry.setContext('app', {
              appName: Application.applicationName,
              version: Application.nativeApplicationVersion,
              build: Application.nativeBuildVersion,
            });
          } catch (err) {
            console.warn('[AUTH RN] Error configurando Sentry:', err.message);
          }
          if (isProduction) {
            try {
              await OneSignal.login(session?.user.id);
              await OneSignal.User.addEmail(worker.email || '');

              await OneSignal.User.addTags({
                ...(fullName && { fullName: fullName }),
                ...(workerTypeName && { role: workerTypeName }),
                ...(worker.workers_hospitals?.[0]?.hospitals?.name && { hospital_name: worker.workers_hospitals?.[0]?.hospitals?.name }),
              });
            } catch (err) {
              console.warn('[AUTH RN] Error iniciando sesión en OneSignal:', err.message);
            }
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