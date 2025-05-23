import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import AppLoader from '@/components/ui/AppLoader';
import AppText from '@/components/ui/AppText';
import SimpleLayout from '@/components/layout/SimpleLayout';
import ActivityListTable from '@/components/lists/ActivityListTable';
import { useUserEventsApi } from '@/api/useUserEventsApi';
import { useAuth } from '@/contexts/AuthContext';
import { spacing } from '@/styles';

export default function ActivityListScreen() {
  const { getToken } = useAuth();
  const { getUserEvents } = useUserEventsApi();

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

  if (loading) return <AppLoader />;

  return (
    <SimpleLayout title="Tu actividad" showBackButton>
      {events.length === 0 ? (
        <View style={styles.empty}>
          <AppText variant="p">Sin actividad todavía</AppText>
          <AppText>Aquí verás eventos cuando publiques o intercambies turnos.</AppText>
        </View>
      ) : (
        <ActivityListTable events={events} />
      )}
    </SimpleLayout>
  );
}

const styles = StyleSheet.create({
  empty: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});
