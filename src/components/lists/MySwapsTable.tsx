// components/MySwapsTable.tsx
import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import SwapCardContent from '@/components/ui/cards/SwapCardContent';
import AppText from '@/components/ui/AppText';
import { spacing } from '@/styles';

interface Props {
  swaps: any[];
  workerId: string;
  onSelect: (swapId: string) => void;
}

export default function MySwapsTable({ swaps, workerId, onSelect }: Props) {
  if (!swaps.length) {
    return (
      <View style={styles.empty}>
        <AppText>No tienes intercambios aún.</AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={swaps}
      keyExtractor={(item) => item.swap_id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const iAmRequester = item.requester_id === workerId;
        const myDate = iAmRequester ? item.offered_date : item.shift?.date;
        const myType = iAmRequester ? item.offered_type : item.shift?.shift_type;
        const otherDate = iAmRequester ? item.shift?.date : item.offered_date;
        const otherType = iAmRequester ? item.shift?.shift_type : item.offered_type;
        const otherPersonName = iAmRequester
          ? `${item.shift?.worker?.name ?? ''} ${item.shift?.worker?.surname ?? ''}`
          : `${item.requester?.name ?? ''} ${item.requester?.surname ?? ''}`;

        return (
          <View style={styles.cardWrapper}>
            <Pressable onPress={() => onSelect(item.swap_id)}>
              <SwapCardContent
                otherPersonName={otherPersonName}
                myDate={myDate}
                myType={myType}
                otherDate={otherDate}
                otherType={otherType}
                statusLabel={item.status}
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
  empty: {
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