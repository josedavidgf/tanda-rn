import React, { useEffect, useState } from 'react';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';

import { View, StyleSheet } from 'react-native';
import AppLayout from '@/components/layout/AppLayout';
import AppLoader from '@/components/ui/AppLoader';
import MySwapsTable from '@/components/lists/MySwapsTable';
import { useAuth } from '../../contexts/AuthContext';
import { useSwapApi } from '@/api/useSwapApi';
import { useNavigation } from '@react-navigation/native';
import { swapStatusLabels } from '@/utils/useLabelMap';
import Chip from '@/components/ui/Chip';
import { ScrollView } from 'react-native';
import DateRangePicker from '@/components/ui/DataRangePicker';
import { startOfMonth, endOfMonth } from 'date-fns';
import { spacing } from '@/styles';
import FadeInView from '@/components/animations/FadeInView';
import EmptyState from '@/components/ui/EmptyState';

type MySwapScreenRouteParams = {
  filterDate?: string;
  status?: string;
};

export default function MySwapScreen() {
  const { accessToken, isWorker } = useAuth();
  const route = useRoute<RouteProp<Record<string, MySwapScreenRouteParams>, string>>();
  const { filterDate, status } = route.params ?? {};
  const { getSentSwaps, getReceivedSwaps } = useSwapApi();
  const navigation = useNavigation();
  const [statusFilters, setStatusFilters] = useState<string[]>(['proposed']);

  const statusOptions = ['proposed', 'accepted', 'rejected', 'cancelled'] as const;
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);


  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(nextMonth),
  });


  const fetchSwaps = async () => {
    setLoading(true);
    const [sent, received] = await Promise.all([
      getSentSwaps(accessToken),
      getReceivedSwaps(accessToken),
    ]);

    const markedSent = sent.map(s => ({ ...s, direction: 'sent' }));
    const markedReceived = received.map(r => ({ ...r, direction: 'received' }));

    const all = [...markedSent, ...markedReceived].sort((a, b) => {
      const dateA = new Date(a.shift?.date || a.offered_date);
      const dateB = new Date(b.shift?.date || b.offered_date);
      return dateA.getTime() - dateB.getTime();
    });


    setSwaps(all);
    setLoading(false);
  };
  useEffect(() => {
    if (filterDate) {
      const parsedDate = new Date(filterDate);
      setDateRange({
        startDate: parsedDate,
        endDate: parsedDate,
      });
    }

    if (status) {
      setStatusFilters([status]);
    }
  }, [filterDate, status]);


  useFocusEffect(
    React.useCallback(() => {
      fetchSwaps();
    }, [accessToken])
  );

  if (loading) return <AppLoader onFinish={() => setLoading(false)} message='Cargando intercambios...' />;

  const filteredSwaps = swaps.filter((s) => {
    const inStatus = statusFilters.length > 0 ? statusFilters.includes(s.status) : true;

    const shiftDate = s.shift?.date ? new Date(s.shift.date) : null;
    const offeredDate = s.offered_date ? new Date(s.offered_date) : null;

    const isShiftDateValid =
      shiftDate &&
      (!dateRange.startDate || shiftDate >= dateRange.startDate) &&
      (!dateRange.endDate || shiftDate <= dateRange.endDate);

    const isOfferedDateValid =
      offeredDate &&
      (!dateRange.startDate || offeredDate >= dateRange.startDate) &&
      (!dateRange.endDate || offeredDate <= dateRange.endDate);

    return inStatus && (isShiftDateValid || isOfferedDateValid);
  });


  if (filteredSwaps.length === 0) {
    return (
      <FadeInView>
        <AppLayout title="Tus intercambios">
          <View style={{ flex: 1, justifyContent: 'center', padding: spacing.lg }}>
            <EmptyState
              title="No hay resultados"
              description="No hay intercambios en esta búsqueda."
              ctaLabel="Limpiar filtros"
              onCtaClick={() => {
                setStatusFilters([]);
                setDateRange({
                  startDate: startOfMonth(new Date()),
                  endDate: endOfMonth(new Date()),
                });
              }}
            />
          </View>
        </AppLayout>
      </FadeInView>
    );
  }


  return (
    <FadeInView>
      <AppLayout title="Tus intercambios">
        <View style={{ flex: 1 }}>
          <View style={{ padding: spacing.md }}>
            <DateRangePicker range={dateRange} onChange={setDateRange} />
          </View>
          <View style={{ paddingHorizontal: spacing.md }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.sm }}
            >
              {statusOptions.map((status) => {
                const isSelected = statusFilters.includes(status);
                return (
                  <Chip
                    key={status}
                    label={swapStatusLabels[status]}
                    selected={isSelected}
                    onPress={() => {
                      const updated = isSelected
                        ? statusFilters.filter((s) => s !== status)
                        : [...statusFilters, status];
                      setStatusFilters(updated);
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>
          <MySwapsTable
            swaps={filteredSwaps}
            workerId={isWorker.worker_id}
            onSelect={(swapId: string) =>
              navigation.navigate('SwapDetails', { swapId })
            }
          />
        </View>
      </AppLayout>
    </FadeInView>
  );
}

const styles = StyleSheet.create({});
