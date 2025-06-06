import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '@/components/ui/Button';
import InputField from '@/components/forms/InputField';
import { spacing } from '@/styles';

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string; // Nuevo prop opcional para el label
};

export default function SearchFilterInput({ value, onChange, placeholder = 'Busca tu especialidad...', label = 'Especialidad' }: Props) {
  return (
    <View style={styles.wrapper}>
      <InputField
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        label={label} // Usar el nuevo prop label
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
