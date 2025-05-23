// components/HospitalShiftsTable.tsx
import React from 'react';
import { FlatList, Pressable, StyleSheet, View, Alert } from 'react-native';
import ShiftCardContent from '@/components/ui/cards/ShiftCardContent';
import AppText from '@/components/ui/AppText';
import { spacing } from '@/styles';

interface Props {
  shifts: any[];
  workerId: string;
  sentSwapShiftIds: string[];
  onSelect: (shiftId: string) => void;
}

export default function HospitalShiftsTable({ shifts, workerId, sentSwapShiftIds, onSelect }: Props) {
  if (!shifts.length) {
    return (
      <View style={styles.emptyContainer}>
        <AppText>No hay turnos publicados en este servicio.</AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={shifts}
      keyExtractor={(item) => item.shift_id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const isMine = item.worker_id === workerId;
        const alreadyProposed = sentSwapShiftIds.includes(item.shift_id);
        const isDisabled = isMine || item.state !== 'published' || alreadyProposed;

        return (
          <View style={styles.cardWrapper}>
            <Pressable
              onPress={() => {
                if (isDisabled) {
                  Alert.alert(
                    'No disponible',
                    isMine
                      ? 'Este turno es tuyo.'
                      : alreadyProposed
                        ? 'Ya has propuesto un intercambio para este turno.'
                        : 'Este turno no está disponible.'
                  );
                } else {
                  console.log('Selected shift:', item.shift_id);
                  onSelect(item.shift_id);
                }
              }}
              style={{ opacity: isDisabled ? 0.5 : 1 }}
            >
              <ShiftCardContent
                date={item.date}
                type={item.shift_type}
                workerName={`${item.worker?.name ?? ''} ${item.worker?.surname ?? ''}`}
                swapsAccepted={item.worker?.swapsAcceptedAsPublisher ?? 0}
              />
            </Pressable>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    padding: spacing.md,
  },
  emptyContainer: {
    padding: spacing.md,
  },
  cardWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#eee',
  }

});