import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Bell } from 'phosphor-react-native';
import { useUserEventsDot } from '@/app/hooks/useUserEventsDot';
import { colors } from '@/styles';

export default function NotificationDotIcon() {
  const hasUnseen = useUserEventsDot();

  return (
    <View style={styles.wrapper}>
      <Bell size={24} weight="regular" color={colors.gray[800]} />
      {hasUnseen && <View style={styles.dot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});
