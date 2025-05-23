import React from 'react';
import { View, StyleSheet } from 'react-native';
import SelectorInput from '@/components/forms/SelectorInput';
import { formatFriendlyDate } from '@/utils/useFormatFriendlyDate';
import { shiftTypeLabels } from '@/utils/useLabelMap';
import { spacing } from '@/styles';
import CustomSelectorInput from '@/components/forms/CustomSelectorInput';

type Shift = {
    id: string;
    date: string;
    type: string;
    preferred?: boolean;
    indicator?: 'received';
};

type Props = {
    shifts: Shift[];
    selectedShiftId: string | null;
    onSelect: (shift: Shift) => void;
};

export default function ShiftSelector({ shifts, selectedShiftId, onSelect }: Props) {
    const handleChange = (value: string) => {
        const selected = shifts.find((s) => s.id === value);
        if (selected) onSelect(selected);
    };

    const options = shifts.map((s) => ({
        value: s.id,
        label: `${formatFriendlyDate(s.date)} de ${shiftTypeLabels[s.type]}${s.indicator === 'received' ? ' 🔄' : ''
            }${s.preferred ? ' 🟢' : ''}`,
    }));

    return (

        <CustomSelectorInput
            name="shift"
            label="Turno que ofreces"
            value={selectedShiftId}
            onChange={handleChange}
            options={options}
        />

    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
});
