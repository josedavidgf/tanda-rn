import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/lib/supabase';
import { getMyWorkerProfile } from '@/services/workerService';
import AppLoader from '@/components/ui/AppLoader';

type AuthContextType = {
  session: any;
  isWorker: any;
  loading: boolean;
  getToken: () => Promise<string | null>;
  setIsWorker: (w: any) => void;
};


const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<any>(null);
  const [isWorker, setIsWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  const restoreSession = async () => {
    try {
      const stored = await SecureStore.getItemAsync('supabaseSession');
      if (stored) {
        const parsed = JSON.parse(stored);
        const { data, error } = await supabase.auth.setSession(parsed);
        if (!error && data?.session) {
          setSession(data.session);
          const token = data.session.access_token;
          const workerProfile = await getMyWorkerProfile(token);
          setIsWorker(workerProfile || null);
        }
      }
    } catch (e) {
      console.warn('[RESTORE] Error restoring session', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWorkerIfNeeded = async () => {
      if (!isWorker && session?.access_token) {
        try {
          const workerProfile = await getMyWorkerProfile(session.access_token);
          if (workerProfile) {
            console.log('[AUTH RN] Worker cargado por fallback');
            setIsWorker(workerProfile);
          }
        } catch (err) {
          console.warn('[AUTH RN] Error cargando worker por fallback', err.message);
        }
      }
    };

    fetchWorkerIfNeeded();
  }, [session, isWorker]);

  useEffect(() => {
    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          setSession(session);
          const { access_token, refresh_token } = session;
          await SecureStore.setItemAsync(
            'supabaseSession',
            JSON.stringify({ access_token, refresh_token })
          );
          const workerProfile = await getMyWorkerProfile(access_token);
          setIsWorker(workerProfile || null);
        } else {
          setSession(null);
          setIsWorker(null);
          await SecureStore.deleteItemAsync('supabaseSession');
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const getToken = async (): Promise<string | null> => {
    const session = supabase.auth.session();
    return session?.access_token || null;
  };


  return (
    <AuthContext.Provider value={{ session, isWorker, loading, getToken, setIsWorker }}>
      {children}
    </AuthContext.Provider>
  );
};
