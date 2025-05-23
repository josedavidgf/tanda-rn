import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import { CaretDown } from 'phosphor-react-native';
import { colors, spacing, typography } from '@/styles';

/**
 * SelectorInput is a stateless UI wrapper.
 * It renders a label and a value inside a styled box with a dropdown icon.
 * The actual selection logic (DatePicker, Modal, etc) is handled externally.
 *
 * Used for date fields or any controlled picker input.
 */
export default function SelectorInput({ label, value, onPress }: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.wrapper}>
      <AppText style={styles.label}>{label}</AppText>
      <TouchableOpacity onPress={onPress} style={styles.inputContainer}>
        <AppText style={styles.value}>{value}</AppText>
        <CaretDown size={16} color={colors.gray[600]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  label: {
    fontSize: typography.xs,
    color: colors.gray[600],
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  value: {
    fontSize: typography.sm,
    color: colors.text,
  },
});
