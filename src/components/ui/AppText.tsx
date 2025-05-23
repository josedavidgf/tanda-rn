// components/ui/AppText.tsx

import React from 'react';
import { Text as NativeText, TextProps, StyleSheet } from 'react-native';
import { typography } from '../../styles/base/typography';

type Variant = keyof typeof typography;

interface Props extends TextProps {
  children: React.ReactNode;
  variant?: Variant;
  style?: any;
}

export default function AppText({ children, variant = 'p', style, ...rest }: Props) {
  const baseStyle = typography[variant] ?? typography.p;

  return (
    <NativeText style={StyleSheet.flatten([baseStyle, style])} {...rest}>
      {children}
    </NativeText>
  );
}
