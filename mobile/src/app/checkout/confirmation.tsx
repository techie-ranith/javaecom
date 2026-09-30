import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2 } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { QUERY_KEYS } from '@/constants/storage';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/helpers';

export default function CheckoutConfirmation() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const id = Number(orderId);

  const orderQuery = useQuery({
    queryKey: [QUERY_KEYS.order, id],
    queryFn: () => orderService.getOrderById(id),
    enabled: Number.isFinite(id),
  });

  if (orderQuery.isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner full />
      </SafeAreaView>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState message="Unable to load order confirmation." onRetry={() => orderQuery.refetch()} />
      </SafeAreaView>
    );
  }

  const order = orderQuery.data;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <CheckCircle2 size={48} color={Colors.success} />
        <Text style={styles.step}>STEP 4 OF 4</Text>
        <Text style={styles.title}>Order confirmed</Text>
        <Text style={styles.subtitle}>Thank you. Your fragrance order is on its way.</Text>

        <View style={styles.card}>
          <Row label="Order number" value={`#${order.id}`} />
          <Row label="Payment" value={order.paymentMethod} />
          <Row label="Delivery address" value={order.shippingAddress} />
          <Row label="Total" value={formatCurrency(order.total)} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Products</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.itemName}>
                {item.product.name} × {item.quantity}
              </Text>
              <Text style={styles.itemPrice}>{formatCurrency(Number(item.unitPrice) * item.quantity)}</Text>
            </View>
          ))}
        </View>

        <Button title="Continue Shopping" onPress={() => router.replace('/(tabs)/shop')} />
        <Button title="View order" variant="secondary" onPress={() => router.replace(`/orders/${order.id}`)} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.xl, gap: Spacing.lg, alignItems: 'center' },
  step: { ...Typography.label, color: Colors.gold },
  title: { ...Typography.title, color: Colors.ink, textAlign: 'center' },
  subtitle: { ...Typography.body, color: Colors.inkMuted, textAlign: 'center' },
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  cardTitle: { ...Typography.subtitle, color: Colors.ink, fontSize: 16 },
  row: { gap: 4 },
  label: { ...Typography.caption, color: Colors.inkMuted },
  value: { ...Typography.body, color: Colors.ink, fontWeight: '500' },
  item: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  itemName: { ...Typography.body, color: Colors.ink, flex: 1 },
  itemPrice: { ...Typography.body, color: Colors.inkSoft },
});
