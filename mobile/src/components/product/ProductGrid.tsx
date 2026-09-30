import React from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Spacing } from '@/constants/theme';
import type { Product } from '@/types';

type Props = {
  products: Product[];
  loading?: boolean;
  onEndReached?: () => void;
  ListHeaderComponent?: React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function ProductGrid({
  products,
  loading,
  onEndReached,
  ListHeaderComponent,
  refreshing,
  onRefresh,
}: Props) {
  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <View style={styles.item}>
      <ProductCard product={item} compact />
    </View>
  );

  if (loading && !products.length) {
    return (
      <View style={styles.skeletonGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.item}>
            <ProductCardSkeleton />
          </View>
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      renderItem={renderItem}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        <EmptyState title="No fragrances found" description="Try adjusting your filters or search." />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120, paddingHorizontal: Spacing.lg, gap: Spacing.md },
  row: { gap: Spacing.md },
  item: { flex: 1 },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
});
