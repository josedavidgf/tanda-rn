import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip'; // asumiendo que ya lo tienes
import { Trash } from '@/theme/icons';
import { spacing, typography, colors } from '@/styles';
import { shiftTypeLabels, shiftTypeIcons } from '@/utils/useLabelMap';
import { formatFriendlyDate } from '@/utils/useFormatFriendlyDate';
import { ScrollView } from 'react-native-gesture-handler';
import CommentButton from '@/components/calendar/DayComment';
// import { trackEvent } from '@/lib/amplitude';
// import { EVENTS } from '@/utils/amplitudeEvents';

const ALL_TYPES = ['morning', 'evening', 'night', 'reinforcement'];

type Props = {
  dateStr: string;
  dayLabel: string;
  entry: {
    preference_types: string[];
    preferenceIds: { [key: string]: string };
  };
  onEditPreference: (dateStr: string, type: string) => void;
  onDeletePreference: (dateStr: string) => void;
  loadingDeletePreference?: boolean;
};

export default function DayDetailPreference({
  dateStr,
  dayLabel,
  entry,
  onEditPreference,
  onDeletePreference,
  loadingDeletePreference,
}: Props) {
  const activeTypes = Array.isArray(entry.preference_types) ? entry.preference_types : [];
  const formattedDate = formatFriendlyDate(dateStr);
  const isToday = new Date().toISOString().split('T')[0] === dateStr;
  const isTomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0] === dateStr;
  const isPast = new Date(dateStr) < new Date();
  const isFuture = new Date(dateStr) > new Date();
  const isWeekend = new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6;
  const isDisabled = isPast || isWeekend;
  const isTodayLabel = isToday ? 'Hoy' : isTomorrow ? 'Mañana' : formattedDate;
  const isTomorrowLabel = isTomorrow ? 'Mañana' : formattedDate;
  return (
    <View style={styles.container}>
      <AppText variant="p" style={{ fontWeight: '600' }}>
        {isToday
          ? `Hoy no tienes turno. Disponibilidad marcada${activeTypes.length > 1 ? 's' : ''}:`
          : `El ${formattedDate} no tienes turno. Disponibilidad marcada${activeTypes.length > 1 ? 's' : ''}:`
        }
      </AppText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
      >
        {ALL_TYPES.map((type) => {
          const Icon = shiftTypeIcons[type];
          const isActive = activeTypes.includes(type);

          return (
            <Chip
              key={type}
              label={shiftTypeLabels[type]}
              selected={isActive}
              icon={Icon}
              onPress={() => onEditPreference(dateStr, type)}
              disabled={loadingDeletePreference}
            />
          );
        })}
      </ScrollView>


      {activeTypes.length > 0 && (
        <View style={styles.buttonGroup}>

          <Button
            label="Eliminar disponibilidades"
            variant="outline"
            size="lg"
            leftIcon={<Trash size={20} color={colors.black} />}
            onPress={() => {
              // trackEvent(EVENTS.REMOVE_ALL_AVAILABILITIES_CLICKED, { day: dateStr });
              onDeletePreference(dateStr);
            }}
            loading={loadingDeletePreference}
            disabled={loadingDeletePreference}
          />
          <CommentButton dateStr={dateStr} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(245, 246, 248, 0.8)',
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
});
