import React from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import { spacing, colors, typography } from '@/styles';
import AppText from './AppText';

type Props = {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
};

export default function ToggleSwitch({ label, value, onChange, disabled }: Props) {
  return (
    <View style={styles.container}>
      <AppText variant='p'>{label}</AppText>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.gray[300], true: colors.primary }}
        thumbColor={value ? colors.white : colors.gray[100]}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: colors.gray[200],
    borderBottomWidth: 1,
  },
});
