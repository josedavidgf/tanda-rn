import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '@/styles';

type Props = {
  code: string;
  setCode: (val: string) => void;
  error?: boolean;
};

export default function AccessCodeInput({ code, setCode, error = false }: Props) {
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = code.split('');
    newCode[index] = value;
    const final = newCode.join('').padEnd(4, '').slice(0, 4);
    setCode(final);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        {Array(4).fill(null).map((_, idx) => (
          <TextInput
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            style={[styles.input, error && styles.errorBorder]}
            keyboardType="number-pad"
            maxLength={1}
            value={code[idx] || ''}
            onChangeText={(val) => handleChange(val, idx)}
            onKeyPress={(e) => handleKeyPress(e, idx)}
            textAlign="center"
            returnKeyType="default"      // 👈 oculta el botón del teclado
          />
        ))}
      </View>
      {error && <Text style={styles.errorText}>Código incorrecto</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    gap: spacing.sm,
  },
  inputs: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  input: {
    width: 32,
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 4,
    color: colors.primary,
    backgroundColor: colors.white,
  },
  errorBorder: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
