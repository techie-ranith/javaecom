import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/common/Skeleton';
import { PriceDisplay } from '@/components/product/PriceDisplay';
import { ProductRating } from '@/components/product/ProductRating';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { WishlistButton } from '@/components/product/WishlistButton';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { QUERY_KEYS } from '@/constants/storage';
import { useToast } from '@/context/ToastContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { cartService } from '@/services/cartService';
import { productService } from '@/services/productService';
import { getErrorMessage } from '@/utils/helpers';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const requireAuth = useRequireAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [openSection, setOpenSection] = useState<'description' | 'details' | 'reviews'>('description');

  const productQuery = useQuery({
    queryKey: [QUERY_KEYS.product, productId],
    queryFn: () => productService.getProductById(productId),
    enabled: Number.isFinite(productId),
  });

  const reviewsQuery = useQuery({
    queryKey: [QUERY_KEYS.reviews, productId],
    queryFn: () => productService.getReviews(productId),
    enabled: Number.isFinite(productId),
  });

  const addMutation = useMutation({
    mutationFn: () => cartService.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cart] });
      showToast('Added to cart', 'success');
    },
    onError: (error) => showToast(getErrorMessage(error), 'error'),
  });

  const images = useMemo(() => {
    const product = productQuery.data;
    if (!product) return [];
    return product.images?.length ? product.images : [product.imageUrl];
  }, [productQuery.data]);

  if (productQuery.isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Skeleton height={width * 0.9} radius={0} />
        <View style={{ padding: 20, gap: 12 }}>
          <Skeleton height={18} width="40%" />
          <Skeleton height={28} width="80%" />
          <Skeleton height={20} width="50%" />
          <Skeleton height={52} />
        </View>
      </SafeAreaView>
    );
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState
          message="Unable to load product. Please try again."
          onRetry={() => productQuery.refetch()}
        />
      </SafeAreaView>
    );
  }

  const product = productQuery.data;
  const inStock = product.stock > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View>
          <Image
            source={{ uri: images[imageIndex] }}
            style={{ width, height: width * 0.95 }}
            contentFit="cover"
          />
          <View style={styles.topActions}>
            <Pressable style={styles.iconBtn} onPress={() => router.back()} accessibilityLabel="Go back">
              <ArrowLeft size={20} color={Colors.ink} />
            </Pressable>
            <WishlistButton productId={product.id} />
          </View>
          {images.length > 1 ? (
            <View style={styles.dots}>
              {images.map((_, index) => (
                <Pressable
                  key={index}
                  style={[styles.dot, index === imageIndex && styles.dotActive]}
                  onPress={() => setImageIndex(index)}
                />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <ProductRating rating={product.rating} reviews={reviewsQuery.data?.length ?? product.reviews} />
          <PriceDisplay product={product} large />
          <Text style={[styles.stock, !inStock && { color: Colors.danger }]}>
            {inStock ? `In stock · ${product.stock} available` : 'Out of stock'}
          </Text>
          <Text style={styles.size}>Size · {product.size ?? '50 ml'}</Text>

          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            max={Math.max(1, product.stock)}
          />

          <Section
            title="Description"
            open={openSection === 'description'}
            onToggle={() => setOpenSection('description')}
          >
            <Text style={styles.copy}>{product.description}</Text>
          </Section>
          <Section
            title="Product details"
            open={openSection === 'details'}
            onToggle={() => setOpenSection('details')}
          >
            <Text style={styles.copy}>Brand: {product.brand}</Text>
            <Text style={styles.copy}>Category: {product.categoryName ?? product.gender}</Text>
            <Text style={styles.copy}>Gender: {product.gender}</Text>
            <Text style={styles.copy}>Size: {product.size ?? '50 ml'}</Text>
          </Section>
          <Section
            title="Reviews"
            open={openSection === 'reviews'}
            onToggle={() => setOpenSection('reviews')}
          >
            {(reviewsQuery.data ?? []).length ? (
              reviewsQuery.data?.map((review) => (
                <View key={review.id} style={styles.review}>
                  <Text style={styles.reviewName}>
                    {review.customerName} · {'★'.repeat(review.rating)}
                  </Text>
                  <Text style={styles.copy}>{review.comment}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.copy}>No reviews yet.</Text>
            )}
          </Section>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add to Cart"
          variant="secondary"
          fullWidth={false}
          style={styles.footerBtn}
          disabled={!inStock}
          loading={addMutation.isPending}
          onPress={() => requireAuth(() => addMutation.mutate())}
        />
        <Button
          title="Buy Now"
          fullWidth={false}
          style={styles.footerBtn}
          disabled={!inStock}
          onPress={() =>
            requireAuth(async () => {
              await addMutation.mutateAsync();
              router.push('/checkout');
            })
          }
        />
      </View>
    </SafeAreaView>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Pressable style={styles.sectionHeader} onPress={onToggle}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {open ? <ChevronUp size={18} color={Colors.ink} /> : <ChevronDown size={18} color={Colors.ink} />}
      </Pressable>
      {open ? <View style={{ gap: 8 }}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  topActions: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: { backgroundColor: '#fff' },
  body: { padding: Spacing.xl, gap: Spacing.md },
  brand: { ...Typography.label, color: Colors.gold },
  name: { ...Typography.title, color: Colors.ink },
  stock: { ...Typography.caption, color: Colors.success },
  size: { ...Typography.body, color: Colors.inkSoft },
  section: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: { ...Typography.subtitle, color: Colors.ink, fontSize: 16 },
  copy: { ...Typography.body, color: Colors.inkMuted },
  review: { gap: 4, marginBottom: 8 },
  reviewName: { ...Typography.caption, color: Colors.ink, fontWeight: '600' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerBtn: { flex: 1 },
});
