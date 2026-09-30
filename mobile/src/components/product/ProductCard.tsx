import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ShoppingBag } from 'lucide-react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { QUERY_KEYS } from '@/constants/storage';
import { ProductImage } from '@/components/product/ProductImage';
import { ProductRating } from '@/components/product/ProductRating';
import { PriceDisplay } from '@/components/product/PriceDisplay';
import { WishlistButton } from '@/components/product/WishlistButton';
import { useToast } from '@/context/ToastContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { cartService } from '@/services/cartService';
import { getErrorMessage } from '@/utils/helpers';
import type { Product } from '@/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  product: Product;
  showAddToCart?: boolean;
  compact?: boolean;
};

export function ProductCard({ product, showAddToCart = true, compact }: Props) {
  const router = useRouter();
  const requireAuth = useRequireAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const addMutation = useMutation({
    mutationFn: () => cartService.addToCart(product.id, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cart] });
      showToast('Added to cart', 'success');
    },
    onError: (error) => showToast(getErrorMessage(error), 'error'),
  });

  return (
    <Animated.View style={[styles.card, compact && styles.compact, animatedStyle]}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={`${product.name} by ${product.brand}`}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={() => router.push(`/product/${product.id}`)}
      >
        <View>
          <ProductImage uri={product.imageUrl} aspectRatio={compact ? 0.9 : 0.85} />
          <View style={styles.wishlist}>
            <WishlistButton productId={product.id} size={16} />
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.brand} numberOfLines={1}>
            {product.brand}
          </Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <ProductRating rating={product.rating} reviews={product.reviews} compact />
          <PriceDisplay product={product} />
        </View>
      </AnimatedPressable>
      {showAddToCart ? (
        <Pressable
          accessibilityLabel={`Add ${product.name} to cart`}
          style={styles.addButton}
          onPress={() => requireAuth(() => addMutation.mutate())}
        >
          <ShoppingBag size={14} color={Colors.ink} />
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 168,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    ...Shadows.card,
  },
  compact: { width: '100%' },
  wishlist: { position: 'absolute', top: 8, right: 8 },
  body: { gap: 6, paddingTop: Spacing.sm, paddingHorizontal: 2, paddingBottom: Spacing.sm },
  brand: { ...Typography.label, color: Colors.gold, textTransform: 'uppercase', fontSize: 10 },
  name: { ...Typography.caption, color: Colors.ink, fontWeight: '600', minHeight: 36 },
  addButton: {
    marginTop: 2,
    marginBottom: 4,
    marginLeft: 2,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.creamSoft,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addText: { ...Typography.caption, color: Colors.ink, fontWeight: '600' },
});
