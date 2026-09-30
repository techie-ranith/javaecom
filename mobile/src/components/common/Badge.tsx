import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export function Badge({
  count,
  style,
}: {
  count: number;
  style?: ViewStyle;
}) {
  if (!count) return null;
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: Radius.full,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
