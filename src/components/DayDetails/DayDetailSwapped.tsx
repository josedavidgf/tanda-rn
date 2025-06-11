import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import { Lightning, Lightbulb, Eye } from '@/theme/icons';
import { spacing, typography, colors } from '@/styles';
import { EVENTS } from '@/utils/amplitudeEvents';
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { useNavigation } from '@react-navigation/native';
import { translateShiftType } from '@/utils/useTranslateServices';
import { Swap } from '@/types/calendar';
import { useIsWorkerReady } from '@/app/hooks/useIsWorkerReady';

type Props = {
  dateStr: any;
  /* dayLabel: string; */
  swaps: Swap[]; // sacados de getAcceptedSwaps(date)
  /* entry: {
    shift_type: 'morning' | 'evening' | 'night';
    requester_id: string;
    worker_id: string;
    related_worker_name?: string;
    related_worker_surname?: string;
    swap_id?: string;
  };
  onOpenAddShiftModal: (dateStr: string) => void;
  onAddPreference: (dateStr: string) => void; */
  navigate: (path: string) => void;
};

export default function DayDetailSwappedSimplified({
  dateStr,
  swaps,
  /* dayLabel,
  entry,
  onOpenAddShiftModal,
  onAddPreference, */
  navigate,
}: Props) {
  /* const fullName = [entry.shifts[0].related_worker_name, entry.shifts[0].related_worker_surname]
    .filter(Boolean)
    .join(' ');

  const isRequester = entry.requester_id === entry.worker_id; */
  const navigation = useNavigation();
  const { isWorker } = useIsWorkerReady();

  const hourRange = {
    morning: 'de 8:00 a 15:00',
    evening: 'de 15:00 a 22:00',
    night: 'de 22:00 a 08:00',
  };
  /* const description = isRequester
    ? `Tenías turno de ${translateShiftType(entry.shifts[0].type)} ${hourRange[entry.shifts[0].type]}. Te lo ha cambiado ${fullName || 'otro trabajador'}.`
    : `Le cambiaste el turno a ${fullName || 'otro trabajador'}. Hoy no tienes turno ni disponibilidad marcada.`;
 */
  return (
    <View style={styles.container}>
      <AppText variant="h2">Intercambios del día</AppText>
      {swaps.map((swap) => {
        const isRequester = swap.requester_id === isWorker.worker_id;
        const type = isRequester ? swap.offered_type : swap.shift?.shift_type;
        const hour = type ? hourRange[type] : '';
        const translatedType = translateShiftType(type);
        const fullName = isRequester
          ? `${swap.shift?.worker?.name ?? ''} ${swap.shift?.worker?.surname ?? ''}`.trim()
          : `${swap.requester?.name ?? ''} ${swap.requester?.surname ?? ''}`.trim();

        const description = isRequester
          ? `Tenías turno de ${translatedType} ${hour}. Te lo ha cambiado ${fullName || 'otro trabajador'}.`
          : `Le cambiaste el turno de ${translatedType} ${hour} a ${fullName || 'otro trabajador'}.`;

        return (
          <AppText key={swap.swap_id} variant="p">
            {description}
          </AppText>
        );
      })}


      <Button
        label="Ver detalles"
        variant="ghost"
        size="lg"
        leftIcon={<Eye size={20} color={colors.black} />}
        onPress={() => {
          trackEvent(EVENTS.SHOW_SWAPPED_SHIFT_DETAILS_BUTTON_CLICKED);
          navigation.navigate('MySwaps', {
            filterDate: dateStr,
            status: 'accepted',
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(245, 246, 248, 0.8)',
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
});