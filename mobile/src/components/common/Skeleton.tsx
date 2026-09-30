import React, { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius } from '@/constants/theme';

export function Skeleton({
  width = '100%',
  height = 16,
  radius = Radius.md,
  style,
}: {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}) {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius: radius },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton height={160} radius={Radius.lg} />
      <Skeleton height={12} width="40%" style={{ marginTop: 12 }} />
      <Skeleton height={16} width="80%" style={{ marginTop: 8 }} />
      <Skeleton height={14} width="50%" style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: Colors.creamDeep },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 10,
  },
});
