import React, { useEffect, useState } from 'react';
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
import DateRangeFilter from '@/components/ui/DateRangeFilter';
import { startOfMonth, endOfMonth } from 'date-fns';
import { spacing } from '@/styles';
import FadeInView from '@/components/animations/FadeInView';

export default function MySwapScreen() {
  const { accessToken, isWorker } = useAuth();
  const { getSentSwaps, getReceivedSwaps } = useSwapApi();
  const navigation = useNavigation();
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const statusOptions = ['proposed', 'accepted', 'rejected', 'cancelled'] as const;
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });

  useEffect(() => {
    const fetchSwaps = async () => {
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

    fetchSwaps();
  }, []);

  if (loading) return <AppLoader onFinish={() => setLoading(false)} message='Cargando intercambios...' />;

  const filteredSwaps = swaps.filter((s) => {
    const inStatus = statusFilters.length > 0 ? statusFilters.includes(s.status) : true;
    const date = new Date(s.shift?.date || s.offered_date);
    const inDateRange =
      (!dateRange.startDate || date >= dateRange.startDate) &&
      (!dateRange.endDate || date <= dateRange.endDate);
    return inStatus && inDateRange;
  });


  return (
    <FadeInView>
      <AppLayout title="Tus intercambios">
        <View style={{ flex: 1 }}>
          <View style={{ padding: spacing.md }}>
            <DateRangeFilter range={dateRange} onChange={setDateRange} />
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
