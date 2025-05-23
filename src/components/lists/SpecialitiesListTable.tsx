import React from 'react';
import { View, Pressable, StyleSheet, FlatList } from 'react-native';
import AppText from '@/components/ui/AppText';
import { colors, spacing, typography } from '@/styles';

type Speciality = {
  speciality_id: string;
  speciality_category: string;
};

type Props = {
  specialities: Speciality[];
  selectedSpeciality: string;
  setSelectedSpeciality: (id: string) => void;
};

export default function SpecialitiesGrid({ specialities, selectedSpeciality, setSelectedSpeciality }: Props) {
  return (
    <FlatList
      data={specialities}
      keyExtractor={(item) => item.speciality_id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const isSelected = item.speciality_id === selectedSpeciality;

        return (
          <Pressable
            onPress={() => setSelectedSpeciality(item.speciality_id)}
            style={[styles.card, isSelected && styles.selected]}
          >
            <AppText variant='p'>{item.speciality_category}</AppText>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  selected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
});
