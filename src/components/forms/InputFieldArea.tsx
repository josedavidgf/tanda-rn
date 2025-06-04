import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import AppText from '@/components/ui/AppText';
import { spacing, typography, colors } from '@/styles';

interface Props extends TextInputProps {
  label?: string;
  errorText?: string;
  helperText?: string;
  disabled?: boolean;
  showCounter?: boolean;
  maxLength?: number;
}

export default function InputFieldArea({
  label,
  errorText,
  helperText,
  disabled = false,
  showCounter = false,
  maxLength,
  value,
  onChangeText,
  ...rest
}: Props) {
  const valueStr = typeof value === 'string' ? value : '';
  const showLabel = !!label && (valueStr.length > 0 || rest.placeholder);

  return (
    <View style={styles.container}>
      {showLabel && <AppText variant="caption" style={styles.label}>{label}</AppText>}

      <TextInput
        style={[ 
          styles.textArea,
          disabled && styles.disabled,
          !!errorText && styles.error
        ]}
        value={valueStr}
        onChangeText={onChangeText}
        multiline
        editable={!disabled}
        numberOfLines={4}
        textAlignVertical="top"
        placeholderTextColor={colors.text.secondary}
        showSoftInputOnFocus={!disabled}
        maxLength={maxLength}
        {...rest}
      />

      <View style={styles.helperRow}>
        {!!helperText && !errorText && (
          <AppText variant="caption" style={styles.helperText}>{helperText}</AppText>
        )}
        {!!errorText && (
          <AppText variant="caption" style={styles.errorText}>{errorText}</AppText>
        )}
        {showCounter && maxLength && (
          <AppText variant="caption" style={styles.counter}>{valueStr.length}/{maxLength}</AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.text.primary,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 12,
    padding: spacing.sm,
    fontSize: 16,
    fontFamily: typography.p.fontFamily,
    color: colors.text.primary,
    backgroundColor: colors.background.light,
    minHeight: 120,
  },
  disabled: {
    backgroundColor: colors.gray[100],
    color: colors.text.tertiary,
  },
  error: {
    borderColor: colors.danger,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  helperText: {
    color: colors.text.secondary,
  },
  errorText: {
    color: colors.danger,
  },
  counter: {
    color: colors.text.tertiary,
  },
});
