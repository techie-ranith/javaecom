import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/common/Skeleton';
import { Spacing } from '@/constants/theme';
import type { Product } from '@/types';

export function ProductCarousel({
  products,
  loading,
}: {
  products: Product[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <View style={styles.row}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={styles.skeleton}>
            <ProductCardSkeleton />
          </View>
        ))}
      </View>
    );
  }

  return (
    <FlatList
      horizontal
      data={products}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <ProductCard product={item} showAddToCart={false} />}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.lg },
  row: { flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.lg },
  skeleton: { width: 168 },
});
