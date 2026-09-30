import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { CouponInput } from '@/components/cart/CouponInput';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { Button } from '@/components/common/Button';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/common/Skeleton';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { QUERY_KEYS } from '@/constants/storage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useCartQuery } from '@/hooks/useStoreQueries';
import { cartService } from '@/services/cartService';
import { calcDeliveryFee, getErrorMessage } from '@/utils/helpers';

export default function CartScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const cartQuery = useCartQuery();
  const [discount, setDiscount] = useState(0);

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartService.updateItem(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cart] }),
    onError: (error) => showToast(getErrorMessage(error), 'error'),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => cartService.removeItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cart] }),
    onError: (error) => showToast(getErrorMessage(error), 'error'),
  });

  const summary = useMemo(() => {
    const subtotal = cartQuery.data?.total ?? 0;
    const discounted = Math.max(0, subtotal - discount);
    const delivery = calcDeliveryFee(discounted);
    return {
      subtotal,
      discount,
      delivery,
      total: discounted + delivery,
    };
  }, [cartQuery.data?.total, discount]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyCart />
        <View style={styles.guestCta}>
          <Button title="Sign in to sync cart" onPress={() => router.push('/(auth)/login')} />
        </View>
      </SafeAreaView>
    );
  }

  if (cartQuery.isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping bag</Text>
        </View>
        <View style={{ padding: 16, gap: 12 }}>
          <Skeleton height={110} />
          <Skeleton height={110} />
          <Skeleton height={160} />
        </View>
      </SafeAreaView>
    );
  }

  if (cartQuery.isError) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState
          message="Unable to load cart. Please try again."
          onRetry={() => cartQuery.refetch()}
        />
      </SafeAreaView>
    );
  }

  const items = cartQuery.data?.items ?? [];
  if (!items.length) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyCart />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>YOUR SELECTION</Text>
          <Text style={styles.title}>Shopping bag</Text>
        </View>
        <View style={styles.list}>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdate={(quantity) => updateMutation.mutate({ id: item.id, quantity })}
              onRemove={() => removeMutation.mutate(item.id)}
            />
          ))}
        </View>
        <CouponInput
          onApply={(code) => {
            if (!code) {
              showToast('Enter a coupon code', 'info');
              return;
            }
            if (code.toUpperCase() === 'WELCOME10') {
              setDiscount(Math.round(summary.subtotal * 0.1));
              showToast('Coupon applied', 'success');
            } else {
              showToast('Coupon not found', 'error');
            }
          }}
        />
        <CartSummary {...summary} />
        <Button title="Proceed to Checkout" onPress={() => router.push('/checkout')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 120 },
  header: { gap: 4 },
  eyebrow: { ...Typography.label, color: Colors.gold },
  title: { ...Typography.title, color: Colors.ink },
  list: { gap: Spacing.md },
  guestCta: { paddingHorizontal: Spacing.lg },
});
