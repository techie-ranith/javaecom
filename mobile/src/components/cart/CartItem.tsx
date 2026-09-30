import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { ProductImage } from '@/components/product/ProductImage';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { formatCurrency, getEffectivePrice } from '@/utils/helpers';
import type { CartItem as CartItemType } from '@/types';

type Props = {
  item: CartItemType;
  onUpdate: (quantity: number) => void;
  onRemove: () => void;
};

export function CartItem({ item, onUpdate, onRemove }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.image}>
        <ProductImage uri={item.product.imageUrl} aspectRatio={1} />
      </View>
      <View style={styles.body}>
        <Text style={styles.brand}>{item.product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.meta}>{item.product.size ?? '50 ml'}</Text>
        <Text style={styles.price}>{formatCurrency(getEffectivePrice(item.product))}</Text>
        <View style={styles.footer}>
          <QuantitySelector value={item.quantity} onChange={onUpdate} max={item.product.stock} />
          <Pressable accessibilityLabel="Remove item" onPress={onRemove} hitSlop={8}>
            <Trash2 size={18} color={Colors.inkMuted} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  image: { width: 88 },
  body: { flex: 1, gap: 4 },
  brand: { ...Typography.label, color: Colors.gold, fontSize: 10, textTransform: 'uppercase' },
  name: { ...Typography.body, color: Colors.ink, fontWeight: '600' },
  meta: { ...Typography.caption, color: Colors.inkMuted },
  price: { ...Typography.price, color: Colors.ink, marginTop: 2 },
  footer: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
