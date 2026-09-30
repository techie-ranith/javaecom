import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { Colors, Typography } from '@/constants/theme';

export function ProductRating({
  rating = 0,
  reviews,
  compact,
}: {
  rating?: number;
  reviews?: number;
  compact?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      <Star size={compact ? 12 : 14} color={Colors.gold} fill={Colors.gold} />
      <Text style={[styles.rating, compact && styles.compact]}>
        {rating.toFixed(1)}
        {typeof reviews === 'number' ? ` (${reviews})` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { ...Typography.caption, color: Colors.inkSoft },
  compact: { fontSize: 11 },
});
