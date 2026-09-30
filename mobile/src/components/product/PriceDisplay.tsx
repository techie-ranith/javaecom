import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '@/constants/theme';
import { formatCurrency, getDiscountPercent, getEffectivePrice } from '@/utils/helpers';
import type { Product } from '@/types';

export function PriceDisplay({ product, large }: { product: Product; large?: boolean }) {
  const effective = getEffectivePrice(product);
  const discount = getDiscountPercent(product);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.price, large && styles.large]}>{formatCurrency(effective)}</Text>
      {discount ? (
        <>
          <Text style={styles.original}>{formatCurrency(product.price)}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>-{discount}%</Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  price: { ...Typography.price, color: Colors.ink },
  large: { fontSize: 22 },
  original: {
    ...Typography.caption,
    color: Colors.inkFaint,
    textDecorationLine: 'line-through',
  },
  badge: {
    backgroundColor: Colors.creamSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { ...Typography.caption, color: Colors.goldDeep, fontWeight: '600' },
});
