import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

type FadeInViewProps = {
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export default function FadeInView({
  duration = 500,
  delay = 0,
  style,
  children,
}: FadeInViewProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ flex: 1, opacity: fadeAnim }, style]}>
      {children}
    </Animated.View>
  );
}
