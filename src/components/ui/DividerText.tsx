import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import { colors, spacing, typography } from '@/styles';

export default function DividerText({ text }: { text: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <AppText style={styles.text}>{text}</AppText>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
  },
  text: {
    marginHorizontal: spacing.sm,
    color: colors.gray[500],
    fontSize: typography.sm,
  },
});
