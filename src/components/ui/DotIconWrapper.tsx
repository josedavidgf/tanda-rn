import React from 'react';
import { View, StyleSheet } from 'react-native';

export function DotIconWrapper({ children, showDot }: { children: React.ReactNode; showDot: boolean }) {
  return (
    <View style={styles.wrapper}>
      {children}
      {showDot && <View style={styles.dot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    zIndex: 10,
  },
});
