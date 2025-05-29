import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import AppLoader from '@/components/ui/AppLoader';
import AppText from '@/components/ui/AppText';
import SimpleLayout from '@/components/layout/SimpleLayout';
import ActivityListTable from '@/components/lists/ActivityListTable';
import { useUserEventsApi } from '@/api/useUserEventsApi';
import { useAuth } from '@/contexts/AuthContext';
import { spacing } from '@/styles';
import FadeInView from '@/components/animations/FadeInView';
import { useFocusEffect } from '@react-navigation/native'; // NUEVO
import EmptyState from '@/components/ui/EmptyState'; // NUEVO
import { useNavigation } from '@react-navigation/native';

export default function ActivityListScreen() {
  const { getToken } = useAuth();
  const { getUserEvents, markUserEventsAsSeen } = useUserEventsApi(); // markUserEventsAsSeen
  const navigation = useNavigation();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = await getToken();
      const data = await getUserEvents(token);
      setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const markSeen = async () => {
        const token = await getToken();
        await markUserEventsAsSeen(token);
      };
      markSeen();
    }, [])
  );

  if (loading) return <AppLoader onFinish={() => setLoading(false)} message='Cargando actividad...' />;

  return (
    <FadeInView>
      <SimpleLayout title="Tu actividad" showBackButton>
        {events.length === 0 ? (
          <EmptyState
            title="No hay actividad"
            description="Aquí aparecerán las notificaciones de tu actividad."
            ctaLabel="Volver al calendario"
            onCtaClick={() => navigation.navigate('Calendar')}
          />
        ) : (
          <ActivityListTable events={events} />
        )}
      </SimpleLayout>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  empty: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});
