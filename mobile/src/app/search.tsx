import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock3, Search as SearchIcon } from 'lucide-react-native';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/common/Skeleton';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { QUERY_KEYS, RECENT_SEARCHES_KEY } from '@/constants/storage';
import { productService } from '@/services/productService';
import { debounce } from '@/utils/helpers';

const SUGGESTIONS = ['Amber', 'Floral', 'Woody', 'Gift set', 'Unisex'];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    SecureStore.getItemAsync(RECENT_SEARCHES_KEY)
      .then((value) => {
        if (value) setRecent(JSON.parse(value) as string[]);
      })
      .catch(() => undefined);
  }, []);

  const debouncedSet = useMemo(
    () =>
      debounce((value: string) => {
        setDebounced(value);
      }, 400),
    [],
  );

  useEffect(() => {
    debouncedSet(query.trim());
  }, [query, debouncedSet]);

  const resultsQuery = useQuery({
    queryKey: [QUERY_KEYS.products, 'search', debounced],
    queryFn: () => productService.getProducts({ q: debounced, size: 30 }),
    enabled: debounced.length > 0,
  });

  const saveRecent = async (value: string) => {
    const next = [value, ...recent.filter((item) => item !== value)].slice(0, 8);
    setRecent(next);
    try {
      await SecureStore.setItemAsync(RECENT_SEARCHES_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back" style={styles.back}>
          <ArrowLeft size={20} color={Colors.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search fragrances, brands..."
            autoFocus
            onClear={() => setQuery('')}
            onSubmitSearch={() => {
              if (query.trim()) void saveRecent(query.trim());
            }}
          />
        </View>
      </View>

      {!debounced ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <View style={styles.chips}>
            {SUGGESTIONS.map((item) => (
              <Pressable key={item} style={styles.chip} onPress={() => setQuery(item)}>
                <SearchIcon size={14} color={Colors.inkMuted} />
                <Text style={styles.chipText}>{item}</Text>
              </Pressable>
            ))}
          </View>
          {recent.length ? (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent searches</Text>
              {recent.map((item) => (
                <Pressable key={item} style={styles.recent} onPress={() => setQuery(item)}>
                  <Clock3 size={16} color={Colors.inkFaint} />
                  <Text style={styles.recentText}>{item}</Text>
                </Pressable>
              ))}
            </>
          ) : null}
        </View>
      ) : resultsQuery.isLoading ? (
        <View style={styles.grid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.gridItem}>
              <ProductCardSkeleton />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={resultsQuery.data?.content ?? []}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={styles.results}
          ListEmptyComponent={
            <EmptyState
              icon={<SearchIcon size={36} color={Colors.inkFaint} />}
              title="No results"
              description="Try a different fragrance name or brand."
            />
          }
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <ProductCard
                product={item}
                compact
                showAddToCart={false}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { paddingHorizontal: Spacing.lg },
  sectionTitle: { ...Typography.subtitle, color: Colors.ink, marginBottom: Spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: { ...Typography.caption, color: Colors.inkSoft },
  recent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentText: { ...Typography.body, color: Colors.ink },
  results: { padding: Spacing.lg, gap: 12, paddingBottom: 40 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: Spacing.lg,
  },
  gridItem: { flex: 1, minWidth: '45%' },
});
