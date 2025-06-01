import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import SimpleLayout from '@/components/layout/SimpleLayout';
import AppLoader from '@/components/ui/AppLoader';
import ToggleSwitch from '@/components/ui/ToogleSwitch';
import { spacing } from '@/styles';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/app/hooks/useToast';
import { useUserApi } from '@/api/useUserApi'; // crea si hace falta
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';

export default function ProfilePreferencesScreen() {
  const { accessToken } = useAuth();
  const { showSuccess, showError } = useToast();
  const { getUserPreferences, updateUserPreferences } = useUserApi();

  const [swapEmails, setSwapEmails] = useState(true);
  const [reminderEmails, setReminderEmails] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingSwap, setLoadingSwap] = useState(false);
  const [loadingReminder, setLoadingReminder] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const prefs = await getUserPreferences(accessToken);
        setSwapEmails(prefs?.receive_emails_swap ?? true);
        setReminderEmails(prefs?.receive_emails_reminders ?? true);
      } catch {
        showError('No se pudieron cargar las preferencias');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleToggle = async (
    key: 'receive_emails_swap' | 'receive_emails_reminders',
    newValue: boolean
  ) => {
    trackEvent(EVENTS.COMM_PREF_TOGGLED, { key, value: newValue });

    if (key === 'receive_emails_swap') setLoadingSwap(true);
    else setLoadingReminder(true);

    try {
      await updateUserPreferences({ [key]: newValue }, accessToken);
      key === 'receive_emails_swap'
        ? setSwapEmails(newValue)
        : setReminderEmails(newValue);
      showSuccess('Preferencias actualizadas');
      trackEvent(EVENTS.COMM_PREF_SAVE_SUCCESS, { key, value: newValue });
    } catch {
      showError('No se pudo guardar la preferencia');
      trackEvent(EVENTS.COMM_PREF_SAVE_FAILED, { key, value: newValue });
    } finally {
      key === 'receive_emails_swap'
        ? setLoadingSwap(false)
        : setLoadingReminder(false);
    }
  };

  if (loading) return <AppLoader onFinish={() => setLoading(false)} message='Cargando preferencias...' />;

  return (
    <SimpleLayout title="Preferencias de comunicación" showBackButton>
      <ScrollView contentContainerStyle={styles.container}>
        <ToggleSwitch
          label="Recibir emails sobre actividad de swaps"
          value={swapEmails}
          onChange={(val) => handleToggle('receive_emails_swap', val)}
          disabled={loadingSwap}
        />
        <ToggleSwitch
          label="Recibir recordatorios de turnos por email"
          value={reminderEmails}
          onChange={(val) => handleToggle('receive_emails_reminders', val)}
          disabled={loadingReminder}
        />
      </ScrollView>
    </SimpleLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
});
