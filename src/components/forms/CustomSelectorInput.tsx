import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import { spacing, colors, typography } from '@/styles';
import AppText from '../ui/AppText';

export type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label?: string;
  value: string | null;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
};

export default function CustomSelectorInput({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);

  const current = options.find((o) => o.value === value);

  return (
    <View style={styles.container}>
      {label && (
        <AppText variant='caption' style={styles.label}>
          {label}
          {required && <AppText style={styles.required}> *</AppText>}
        </AppText>
      )}

      <Pressable
        onPress={() => !disabled && setOpen(true)}
        style={[styles.selector, disabled && styles.disabled]}
      >
        <AppText variant='p' style={styles.selectedText}>
          {current?.label || 'Selecciona una opción'}
        </AppText>
      </Pressable>

      <Modal visible={open} animationType="slide" transparent>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={styles.option}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
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
  required: {
    color: colors.danger,
  },
  selector: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 12,
    backgroundColor: colors.background.light,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  disabled: {
    backgroundColor: colors.gray[100],
  },
  selectedText: {
    color: colors.text.primary,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: typography.p.fontFamily,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  option: {
    paddingVertical: spacing.sm,
  },
  optionText: {
    color: colors.gray[900],
  },
});
