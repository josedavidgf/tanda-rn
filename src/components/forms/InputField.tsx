import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet, Pressable } from 'react-native';
import AppText from '../ui/AppText';
import { spacing, typography, colors } from '@/styles';
import { Controller } from 'react-hook-form';
import { Eye, EyeSlash } from 'phosphor-react-native';


type Props = TextInputProps & {
  label?: string;
  errorText?: string;
  helperText?: string;
  showCounter?: boolean;
  maxLength?: number;
  disabled?: boolean;
  error?: string | boolean;
  // For react-hook-form
  control?: any;
  name?: string;
};

export default function InputField(props: Props) {
  const {
    label,
    errorText,
    helperText,
    showCounter = false,
    maxLength,
    disabled = false,
    error = false,
    control,
    name,
    ...rest
  } = props;

  const renderInput = (fieldProps: any) => {
    const valueStr = typeof fieldProps.value === 'string' ? fieldProps.value : '';
    const showLabel = !!label && (valueStr.length > 0 || rest.placeholder);

    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = props.secureTextEntry ?? false;


    return (
      <View style={styles.container}>
        {showLabel && <AppText variant="caption" style={styles.label}>{label}</AppText>}

        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              !!errorText && styles.inputError,
              isPassword && styles.inputWithIcon
            ]}
            value={valueStr}
            onChangeText={fieldProps.onChange}
            placeholderTextColor={colors.text.secondary}
            maxLength={maxLength}
            editable={!disabled}
            secureTextEntry={isPassword && !showPassword}
          />

          {isPassword && (
            <Pressable
              onPress={() => setShowPassword(prev => !prev)}
              style={styles.iconWrapper}
              hitSlop={10}
            >
              {showPassword
                ? <EyeSlash size={20} color={colors.text.secondary} />
                : <Eye size={20} color={colors.text.secondary} />
              }
            </Pressable>
          )}
        </View>

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
  };


  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => renderInput(field)}
      />
    );
  }

  return renderInput({ value: props.value, onChange: props.onChangeText });
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
  inputWithIcon: {
    paddingRight: spacing.xl + spacing.sm,
  },
  iconWrapper: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm + 2,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },

});
