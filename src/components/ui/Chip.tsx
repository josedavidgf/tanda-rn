import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles';
import { X } from 'phosphor-react-native';
import AppText from '@/components/ui/AppText';

type Props = {
  label: string;
  icon?: React.ComponentType<{ size?: number; weight?: string; color?: string }>;
  onPress?: () => void;
  onRemove?: () => void;
  selected?: boolean;
  disabled?: boolean;
};

export default function Chip({
  label,
  icon: Icon,
  onPress,
  onRemove,
  selected = false,
  disabled = false,
}: Props) {
  const containerStyle = [
    styles.container,
    selected && styles.selected,
    disabled && styles.disabled,
    onPress && styles.clickable,
  ];

  return (
    <Pressable
      onPress={!disabled ? onPress : undefined}
      style={containerStyle}
    >
      {Icon && (
        <View style={styles.iconWrapper}>
          <Icon size={16} weight="bold" color={selected ? '#fff' : colors.gray[900]} />
        </View>
      )}
      <AppText variant='p' style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </AppText>
      {onRemove && !disabled && (
        <Pressable onPress={(e) => { e.stopPropagation?.(); onRemove(); }} style={styles.remove}>
          <X size={12} weight="bold" color={selected ? '#fff' : colors.gray[900]} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // ✅ que no intente ocupar altura completa
    borderRadius: 16,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    margin: spacing.xs,
    minHeight: 32, // ✅ fuerza altura mínima razonable
    maxHeight: 36, // ✅ previene que crezca de más
  },

  selected: {
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.4,
  },
  clickable: {
    // opcional: sombra o cursor pointer
  },
  iconWrapper: {
    marginRight: spacing.xs,
  },
  label: {
    lineHeight: 18, // ✅ Añadido
    textAlignVertical: 'center', // ✅ Añadido
    includeFontPadding: false,
  },
  selectedLabel: {
    color: '#fff',
  },
  remove: {
    marginLeft: spacing.xs,
  },
});
