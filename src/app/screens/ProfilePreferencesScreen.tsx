import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import SimpleLayout from '@/components/layout/SimpleLayout';
import AppLoader from '@/components/ui/AppLoader';
import ToggleSwitch from '@/components/ui/ToogleSwitch';
import { spacing } from '@/styles';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/app/hooks/useToast';
import { useUserApi } from '@/api/useUserApi';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';
import AppText from '@/components/ui/AppText';

export default function ProfilePreferencesScreen() {
  const { accessToken } = useAuth();
  const { showSuccess, showError } = useToast();
  const { getUserPreferences, updateUserPreferences } = useUserApi();

  const [prefs, setPrefs] = useState({
    receive_emails_swap: true,
    receive_emails_reminders: true,
    receive_push_shift_published: true,
    receive_push_swap_proposed: true,
    receive_push_swap_responded: true,
    receive_push_daily_reminder: true,
  });

  const [loading, setLoading] = useState(true);
  const [loadingKeys, setLoadingKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const result = await getUserPreferences(accessToken);
        setPrefs(prev => ({ ...prev, ...result }));
      } catch {
        showError('No se pudieron cargar las preferencias');
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleToggle = async (key: keyof typeof prefs, newValue: boolean) => {
    trackEvent(EVENTS.COMM_PREF_TOGGLED, { key, value: newValue });
    setLoadingKeys(prev => [...prev, key]);

    try {
      await updateUserPreferences({ [key]: newValue }, accessToken);
      setPrefs(prev => ({ ...prev, [key]: newValue }));
      showSuccess('Preferencias actualizadas');
      trackEvent(EVENTS.COMM_PREF_SAVE_SUCCESS, { key, value: newValue });
    } catch {
      showError('No se pudo guardar la preferencia');
      trackEvent(EVENTS.COMM_PREF_SAVE_FAILED, { key, value: newValue });
    } finally {
      setLoadingKeys(prev => prev.filter(k => k !== key));
    }
  };

  if (loading) return <AppLoader onFinish={() => setLoading(false)} message="Cargando preferencias..." />;

  return (
    <SimpleLayout title="Preferencias" showBackButton>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText variant='h3' style={styles.sectionTitle}>Emails</AppText>
        <ToggleSwitch
          label="Intercambio propuesto"
          value={prefs.receive_emails_swap}
          onChange={val => handleToggle('receive_emails_swap', val)}
          disabled={loadingKeys.includes('receive_emails_swap')}
        />
        <ToggleSwitch
          label="Recordatorio de mis turnos"
          value={prefs.receive_emails_reminders}
          onChange={val => handleToggle('receive_emails_reminders', val)}
          disabled={loadingKeys.includes('receive_emails_reminders')}
        />

        <AppText variant='h3' style={styles.sectionTitle}>Notificaciones en tu móvil</AppText>
        <ToggleSwitch
          label="Nuevo turno publicado"
          value={prefs.receive_push_shift_published}
          onChange={val => handleToggle('receive_push_shift_published', val)}
          disabled={loadingKeys.includes('receive_push_shift_published')}
        />
        <ToggleSwitch
          label="Intercambio propuesto"
          value={prefs.receive_push_swap_proposed}
          onChange={val => handleToggle('receive_push_swap_proposed', val)}
          disabled={loadingKeys.includes('receive_push_swap_proposed')}
        />
        <ToggleSwitch
          label="Intercambio respondido"
          value={prefs.receive_push_swap_responded}
          onChange={val => handleToggle('receive_push_swap_responded', val)}
          disabled={loadingKeys.includes('receive_push_swap_responded')}
        />
        <ToggleSwitch
          label="Recordatorio de mis turnos"
          value={prefs.receive_push_daily_reminder}
          onChange={val => handleToggle('receive_push_daily_reminder', val)}
          disabled={loadingKeys.includes('receive_push_daily_reminder')}
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
  sectionTitle: {
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
});
