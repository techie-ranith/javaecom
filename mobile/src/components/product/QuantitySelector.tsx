import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityLabel="Decrease quantity"
        style={styles.button}
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus size={16} color={Colors.ink} />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        accessibilityLabel="Increase quantity"
        style={styles.button}
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus size={16} color={Colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.creamSoft,
  },
  value: {
    ...Typography.body,
    minWidth: 40,
    textAlign: 'center',
    color: Colors.ink,
    fontWeight: '600',
    paddingHorizontal: Spacing.sm,
  },
});
