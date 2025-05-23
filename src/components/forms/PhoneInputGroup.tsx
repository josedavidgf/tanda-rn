import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomSelectorInput from '@/components/forms/CustomSelectorInput';
import InputField from '@/components/forms/InputField';
import { spacing } from '@/styles';
import { phonePrefixes } from '@/utils/usePhonePrefix';

type Props = {
  prefix: string;
  phone: string;
  onChange: (value: { prefix: string; phone: string }) => void;
  error?: boolean;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
};

export default function PhoneInputGroup({
  prefix,
  phone,
  onChange,
  error = false,
  helperText,
  errorText,
  disabled = false,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.prefix}>
        <CustomSelectorInput
          label="Prefijo"
          name="prefix"
          value={prefix}
          onChange={(val) => onChange({ prefix: val, phone })}
          options={phonePrefixes}
          disabled={disabled}
        />
      </View>
      <View style={styles.number}>
        <InputField
          label="Teléfono"
          value={phone}
          onChangeText={(val) => onChange({ prefix, phone: val })}
          keyboardType="phone-pad"
          disabled={disabled}
          error={error}
          helperText={helperText}
          errorText={errorText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  prefix: {
    flex: 1.2,
  },
  number: {
    flex: 3,
  },
});
