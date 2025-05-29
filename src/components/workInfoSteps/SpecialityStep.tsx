import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import SearchFilterInput from '@/components/forms/SearchFilterInput';
import SpecialitiesGrid from '@/components/lists/SpecialitiesListTable';
import Button from '@/components/ui/Button';
import { spacing } from '@/styles';

type Speciality = {
  speciality_id: string;
  speciality_category: string;
};

type Props = {
  specialities: Speciality[];
  selectedSpeciality: string;
  setSelectedSpeciality: (id: string) => void;
  onConfirm: () => void;
  loading: boolean;
};

export default function SpecialityStep({
  specialities,
  selectedSpeciality,
  setSelectedSpeciality,
  onConfirm,
  loading,
}: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (query.length < 3) return specialities;
    return specialities.filter((s) =>
      s.speciality_category.toLowerCase().includes(query.toLowerCase())
    );
  }, [specialities, query]);

  return (
  <View style={styles.wrapper}>
    <AppText variant="h3" style={styles.title}>
      Selecciona el servicio en el que trabajas
    </AppText>

    <SearchFilterInput value={query} onChange={setQuery} />

    <View style={styles.scrollContainer}>
      <SpecialitiesGrid
        specialities={filtered}
        selectedSpeciality={selectedSpeciality}
        setSelectedSpeciality={setSelectedSpeciality}
      />
    </View>

    <Button
      label="Guardar cambios"
      size="lg"
      variant="primary"
      onPress={onConfirm}
      disabled={!selectedSpeciality || loading}
      loading={loading}
    />
  </View>
);


}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
  },
  scrollContainer: {
    flex: 1,
    marginVertical: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
});

