import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SlidersHorizontal } from 'lucide-react-native';
import { SearchBar } from '@/components/common/SearchBar';
import { BottomSheet } from '@/components/common/BottomSheet';
import { Button } from '@/components/common/Button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { GENDERS, QUERY_KEYS, SORT_OPTIONS } from '@/constants/storage';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';

export default function ShopScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [sort, setSort] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoriesQuery = useQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: categoryService.getCategories,
  });

  const productsQuery = useInfiniteQuery({
    queryKey: [QUERY_KEYS.products, 'shop', search, gender, category, sort],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      productService.getProducts({
        q: search || undefined,
        gender,
        category,
        sort,
        page: pageParam,
        size: 8,
      }),
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  });

  const products = useMemo(
    () => productsQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [productsQuery.data],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>THE COLLECTION</Text>
        <Text style={styles.title}>Shop fragrances</Text>
        <View style={styles.toolbar}>
          <View style={styles.search}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search fragrances"
              onFocus={() => router.push('/search')}
            />
          </View>
          <Pressable
            accessibilityLabel="Open filters"
            style={styles.filterButton}
            onPress={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={18} color={Colors.ink} />
          </Pressable>
        </View>
        <View style={styles.chips}>
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[styles.chip, sort === option.value && styles.chipActive]}
              onPress={() => setSort(option.value)}
            >
              <Text style={[styles.chipText, sort === option.value && styles.chipTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ProductGrid
        products={products}
        loading={productsQuery.isLoading}
        refreshing={productsQuery.isRefetching}
        onRefresh={() => productsQuery.refetch()}
        onEndReached={() => {
          if (productsQuery.hasNextPage && !productsQuery.isFetchingNextPage) {
            productsQuery.fetchNextPage();
          }
        }}
      />

      <BottomSheet visible={filtersOpen} onClose={() => setFiltersOpen(false)}>
        <Text style={styles.sheetTitle}>Filters</Text>
        <Text style={styles.sheetLabel}>Gender</Text>
        <View style={styles.chips}>
          <Chip label="All" active={!gender} onPress={() => setGender(undefined)} />
          {GENDERS.map((item) => (
            <Chip key={item} label={item} active={gender === item} onPress={() => setGender(item)} />
          ))}
        </View>
        <Text style={styles.sheetLabel}>Category</Text>
        <View style={styles.chips}>
          <Chip label="All" active={!category} onPress={() => setCategory(undefined)} />
          {(categoriesQuery.data ?? []).map((item) => (
            <Chip
              key={item.id}
              label={item.name}
              active={category === item.name}
              onPress={() => setCategory(item.name)}
            />
          ))}
        </View>
        <Button title="Apply filters" onPress={() => setFiltersOpen(false)} style={{ marginTop: 16 }} />
      </BottomSheet>
    </SafeAreaView>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, gap: Spacing.sm },
  eyebrow: { ...Typography.label, color: Colors.gold },
  title: { ...Typography.title, color: Colors.ink },
  toolbar: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  search: { flex: 1 },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  chipText: { ...Typography.caption, color: Colors.inkSoft },
  chipTextActive: { color: '#fff' },
  sheetTitle: { ...Typography.subtitle, color: Colors.ink, marginBottom: Spacing.lg },
  sheetLabel: { ...Typography.caption, color: Colors.inkMuted, marginTop: Spacing.md, marginBottom: Spacing.sm },
});
