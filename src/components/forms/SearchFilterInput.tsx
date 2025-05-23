import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '@/components/ui/Button';
import InputField from '@/components/forms/InputField';
import { spacing } from '@/styles';

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export default function SearchFilterInput({ value, onChange, placeholder = 'Busca tu especialidad...' }: Props) {
  return (
    <View style={styles.wrapper}>
      <InputField
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        label="Especialidad"
      />

      {value.length > 0 && (
        <Button
          label="Limpiar filtros"
          variant="outline"
          size="lg"
          onPress={() => onChange('')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.sm,
  },
});
