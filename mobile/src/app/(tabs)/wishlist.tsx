import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Trash2 } from 'lucide-react-native';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ProductImage } from '@/components/product/ProductImage';
import { PriceDisplay } from '@/components/product/PriceDisplay';
import { Button } from '@/components/common/Button';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { QUERY_KEYS } from '@/constants/storage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useWishlistQuery } from '@/hooks/useStoreQueries';
import { cartService } from '@/services/cartService';
import { wishlistService } from '@/services/wishlistService';
import { getErrorMessage } from '@/utils/helpers';

export default function WishlistScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const wishlistQuery = useWishlistQuery();

  const removeMutation = useMutation({
    mutationFn: (productId: number) => wishlistService.remove(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.wishlist] }),
    onError: (error) => showToast(getErrorMessage(error), 'error'),
  });

  const addMutation = useMutation({
    mutationFn: (productId: number) => cartService.addToCart(productId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cart] });
      showToast('Added to cart', 'success');
    },
    onError: (error) => showToast(getErrorMessage(error), 'error'),
  });

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState
          icon={<Heart size={40} color={Colors.inkFaint} />}
          title="Sign in to view wishlist"
          description="Save your favourite fragrances and find them here."
          actionLabel="Sign in"
          onAction={() => router.push('/(auth)/login')}
        />
      </SafeAreaView>
    );
  }

  if (wishlistQuery.isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner full />
      </SafeAreaView>
    );
  }

  if (wishlistQuery.isError) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState
          message="Unable to load wishlist. Please try again."
          onRetry={() => wishlistQuery.refetch()}
        />
      </SafeAreaView>
    );
  }

  const items = wishlistQuery.data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SAVED</Text>
        <Text style={styles.title}>Wishlist</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon={<Heart size={40} color={Colors.inkFaint} />}
            title="No saved scents yet"
            description="Tap the heart on any product to save it here."
            actionLabel="Browse shop"
            onAction={() => router.push('/(tabs)/shop')}
          />
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/product/${item.product.id}`)}>
            <View style={styles.image}>
              <ProductImage uri={item.product.imageUrl} aspectRatio={1} />
            </View>
            <View style={styles.body}>
              <Text style={styles.brand}>{item.product.brand}</Text>
              <Text style={styles.name}>{item.product.name}</Text>
              <PriceDisplay product={item.product} />
              <View style={styles.actions}>
                <Button
                  title="Add to cart"
                  fullWidth={false}
                  style={styles.cartButton}
                  onPress={() => addMutation.mutate(item.product.id)}
                />
                <Pressable
                  accessibilityLabel="Remove from wishlist"
                  onPress={() => removeMutation.mutate(item.product.id)}
                >
                  <Trash2 size={18} color={Colors.inkMuted} />
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  eyebrow: { ...Typography.label, color: Colors.gold },
  title: { ...Typography.title, color: Colors.ink },
  list: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 120 },
  card: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  image: { width: 96 },
  body: { flex: 1, gap: 6 },
  brand: { ...Typography.label, color: Colors.gold, fontSize: 10 },
  name: { ...Typography.body, color: Colors.ink, fontWeight: '600' },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartButton: { minWidth: 120, minHeight: 40, paddingHorizontal: 14 },
});
