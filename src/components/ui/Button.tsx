import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, radius, typography } from '@/styles';

type Variant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress: () => void;
  variant: Variant;
  size: Size;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  style,
  textStyle,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        base.container,
        variants[variant],
        sizes[size],
        isDisabled && base.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <View style={base.content}>
          {leftIcon && <View style={base.icon}>{leftIcon}</View>}
          <Text
            style={[
              base.text,
              textVariants[variant],
              textSizes[size],
              textStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const base = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  text: {
    textAlign: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 6,
  },
  disabled: {
    backgroundColor: colors.button.disabledBg,
  },
});

const variants = StyleSheet.create({
  primary: {
    backgroundColor: colors.button.primary,
  },
  secondary: {
    backgroundColor: colors.button.secondary,
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.black,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});

const textVariants = StyleSheet.create({
  primary: {
    color: colors.white,
  },
  secondary: {
    color: colors.white,
  },
  outline: {
    color: colors.black,
  },
  ghost: {
    color: colors.black,
  },
  danger: {
    color: colors.danger,
    backgroundColor: 'transparent',
  },
});

const sizes = StyleSheet.create({
  sm: {
    height: 36,
    width: 'auto',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  md: {
    height: 44,
    width: '48%',
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  lg: {
    height: 48,
    width: '100%',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
  },
});

const textSizes = StyleSheet.create({
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 20 },
});