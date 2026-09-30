import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, Banknote } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { CHECKOUT_DRAFT_KEY, QUERY_KEYS } from '@/constants/storage';
import { useToast } from '@/context/ToastContext';
import { orderService } from '@/services/orderService';
import { getErrorMessage } from '@/utils/helpers';
import type { CheckoutDraft } from '@/types';

export default function CheckoutPayment() {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [method, setMethod] = useState<'Cash on Delivery' | 'Card Payment'>('Cash on Delivery');

  const createMutation = useMutation({
    mutationFn: async () => {
      const raw = await SecureStore.getItemAsync(CHECKOUT_DRAFT_KEY);
      const draft = (raw ? JSON.parse(raw) : {}) as Partial<CheckoutDraft>;
      const addressParts = [
        draft.address,
        draft.city,
        draft.province,
        draft.postalCode,
      ].filter(Boolean);
      return orderService.createOrder({
        address: addressParts.join(', '),
        phone: draft.phone ?? '',
        payment: method,
      });
    },
    onSuccess: async (order) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cart] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.orders] }),
      ]);
      try {
        await SecureStore.setItemAsync(
          CHECKOUT_DRAFT_KEY,
          JSON.stringify({ lastOrderId: order.id, paymentMethod: method }),
        );
      } catch {
        // ignore
      }
      router.replace({
        pathname: '/checkout/confirmation',
        params: { orderId: String(order.id) },
      });
    },
    onError: (error) => showToast(getErrorMessage(error, 'Unable to place order'), 'error'),
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.step}>STEP 3 OF 4</Text>
        <Text style={styles.title}>Payment</Text>

        <Pressable
          style={[styles.option, method === 'Cash on Delivery' && styles.optionActive]}
          onPress={() => setMethod('Cash on Delivery')}
        >
          <Banknote size={20} color={Colors.ink} />
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Cash on Delivery</Text>
            <Text style={styles.optionText}>Pay when your order arrives.</Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.option, method === 'Card Payment' && styles.optionActive]}
          onPress={() => setMethod('Card Payment')}
        >
          <CreditCard size={20} color={Colors.ink} />
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Card Payment</Text>
            <Text style={styles.optionText}>Mock payment for demonstration.</Text>
          </View>
        </Pressable>

        <Button
          title="Place order"
          loading={createMutation.isPending}
          onPress={() => createMutation.mutate()}
        />
        <Button title="Back" variant="ghost" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { flex: 1, padding: Spacing.xl, gap: Spacing.lg },
  step: { ...Typography.label, color: Colors.gold },
  title: { ...Typography.title, color: Colors.ink, marginBottom: Spacing.sm },
  option: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionActive: { borderColor: Colors.ink },
  optionTitle: { ...Typography.body, color: Colors.ink, fontWeight: '600' },
  optionText: { ...Typography.caption, color: Colors.inkMuted, marginTop: 2 },
});
