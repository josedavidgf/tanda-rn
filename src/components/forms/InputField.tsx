import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import AppText from '../ui/AppText';
import { spacing, typography, colors } from '@/styles';

type Props = TextInputProps & {
  label?: string;
  errorText?: string;
  helperText?: string;
  maxLength?: number;
  showCounter?: boolean;
  disabled?: boolean;
  error?: boolean;
};

export default function InputField({
  label,
  value,
  onChangeText,
  errorText,
  helperText,
  showCounter = false,
  maxLength,
  disabled = false,
  error = false,
  ...rest
}: Props) {
  const valueStr = typeof value === 'string' ? value : '';
  const showLabel = !!label && (valueStr.length > 0 || rest.placeholder);

  return (
    <View style={styles.container}>
      {showLabel && <AppText variant="caption" style={styles.label}>{label}</AppText>}

      <TextInput
        style={[styles.input, !!errorText && styles.inputError]}
        value={valueStr}
        onChangeText={onChangeText}
        placeholderTextColor={colors.text.secondary}
        maxLength={maxLength}
        {...rest}
      />

      <View style={styles.helper}>
        {errorText ? (
          <AppText variant="caption" style={styles.errorText}>{errorText}</AppText>
        ) : helperText ? (
          <AppText variant="caption" style={styles.helperText}>{helperText}</AppText>
        ) : null}
        {showCounter && maxLength && (
          <AppText variant="caption" style={styles.charCount}>
            {valueStr.length}/{maxLength}
          </AppText>
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
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 12,
    padding: spacing.sm,
    fontSize: 16,
    fontFamily: typography.p.fontFamily,
    color: colors.text.primary,
    backgroundColor: colors.background.light,
  },
  inputError: {
    borderColor: colors.danger,
  },
  helper: {
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
  charCount: {
    color: colors.text.tertiary,
  },
});