import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: Variant;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  loading,
  variant = 'primary',
  fullWidth = true,
  disabled,
  style,
  textStyle,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      onPressIn={(e) => {
        scale.value = withSpring(0.97);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1);
        onPressOut?.(e);
      }}
      style={[
        styles.base,
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        animatedStyle,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? Colors.ink : '#fff'} />
      ) : (
        <Text style={[styles.text, textStyles[variant], textStyle]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  text: { ...Typography.body, fontWeight: '600' },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: Colors.ink },
  secondary: { backgroundColor: Colors.creamSoft, borderWidth: 1, borderColor: Colors.border },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: Colors.danger },
});

const textStyles = StyleSheet.create({
  primary: { color: '#fff' },
  secondary: { color: Colors.ink },
  ghost: { color: Colors.ink },
  danger: { color: '#fff' },
});
