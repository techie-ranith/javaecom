import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { QUERY_KEYS } from '@/constants/storage';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { categoryFromSlug } from '@/utils/helpers';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const categoryName = categoryFromSlug(slug ?? '');
  const [sort, setSort] = useState('newest');

  const categoriesQuery = useQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: categoryService.getCategories,
  });

  const productsQuery = useQuery({
    queryKey: [QUERY_KEYS.products, 'category', categoryName, sort],
    queryFn: () =>
      productService.getProducts({
        category: categoryName,
        gender: ['Men', 'Women', 'Unisex'].includes(categoryName) ? categoryName : undefined,
        sort,
        size: 50,
      }),
  });

  const category = useMemo(
    () => categoriesQuery.data?.find((item) => item.name.toLowerCase() === categoryName.toLowerCase()),
    [categoriesQuery.data, categoryName],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ProductGrid
        products={productsQuery.data?.content ?? []}
        loading={productsQuery.isLoading}
        onRefresh={() => productsQuery.refetch()}
        refreshing={productsQuery.isRefetching}
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.back} accessibilityLabel="Go back">
              <ArrowLeft size={20} color={Colors.ink} />
            </Pressable>
            <Text style={styles.eyebrow}>CATEGORY</Text>
            <Text style={styles.title}>{category?.name ?? categoryName}</Text>
            <Text style={styles.description}>
              {category?.description ?? 'Explore fragrances curated for this collection.'}
            </Text>
            <View style={styles.chips}>
              {[
                ['newest', 'Newest'],
                ['priceAsc', 'Price ↑'],
                ['priceDesc', 'Price ↓'],
                ['popular', 'Popular'],
              ].map(([value, label]) => (
                <Pressable
                  key={value}
                  onPress={() => setSort(value)}
                  style={[styles.chip, sort === value && styles.chipActive]}
                >
                  <Text style={[styles.chipText, sort === value && styles.chipTextActive]}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { gap: Spacing.sm, marginBottom: Spacing.md },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  eyebrow: { ...Typography.label, color: Colors.gold },
  title: { ...Typography.title, color: Colors.ink },
  description: { ...Typography.body, color: Colors.inkMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.ink },
  chipText: { ...Typography.caption, color: Colors.inkSoft },
  chipTextActive: { color: '#fff' },
});
