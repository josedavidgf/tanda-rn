import React, { useState } from 'react';
import { View } from 'react-native';
import AppText from '@/components/ui/AppText';
import Chip from '@/components/ui/Chip';
import SelectorInput from '@/components/forms/SelectorInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { startOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { spacing } from '@/styles';

const quickRanges = [
  {
    key: 'week',
    label: 'Esta semana',
    range: [startOfWeek(new Date(), { weekStartsOn: 1 }), endOfWeek(new Date(), { weekStartsOn: 1 })],
  },
  {
    key: 'month',
    label: 'Este mes',
    range: [startOfMonth(new Date()), endOfMonth(new Date())],
  },
];

export default function DateRangeFilter({ range, onChange }) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeField, setActiveField] = useState<'start' | 'end'>();

  const showPicker = (field: 'start' | 'end') => {
    setActiveField(field);
    setPickerVisible(true);
  };

  const handleConfirm = (date: Date) => {
    setPickerVisible(false);
    if (!activeField) return;
    const newRange = {
      ...range,
      [activeField === 'start' ? 'startDate' : 'endDate']: date,
    };
    onChange(newRange);
  };

  return (
    <View style={{ gap: spacing.xs }}>


      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <SelectorInput
          label="Desde"
          value={format(range.startDate, 'dd/MM')}
          onPress={() => showPicker('start')}
        />
        <SelectorInput
          label="Hasta"
          value={format(range.endDate, 'dd/MM')}
          onPress={() => showPicker('end')}
        />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm }}>
        {quickRanges.map(({ key, label, range: [start, end] }) => {
          const isActive =
            range.startDate?.toDateString() === start.toDateString() &&
            range.endDate?.toDateString() === end.toDateString();
          return (
            <Chip
              key={key}
              label={label}
              selected={isActive}
              onPress={() => onChange({ startDate: start, endDate: end })}
            />
          );
        })}
      </View>

      <DateTimePickerModal
        isVisible={pickerVisible}
        mode="date"
        date={activeField === 'start' ? range.startDate : range.endDate}
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
        display="inline"
      />
    </View>
  );
}
