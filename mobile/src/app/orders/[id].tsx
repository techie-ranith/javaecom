import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { OrderTimeline } from '@/components/account/OrderTimeline';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { QUERY_KEYS } from '@/constants/storage';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/helpers';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Number(id);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const orderQuery = useQuery({
    queryKey: [QUERY_KEYS.order, orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: isAuthenticated && Number.isFinite(orderId),
  });

  if (!isLoading && !isAuthenticated) {
    return <Redirect href={{ pathname: '/(auth)/login', params: { redirect: `/orders/${id}` } }} />;
  }

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
        <ErrorState message="Unable to load order details." onRetry={() => orderQuery.refetch()} />
      </SafeAreaView>
    );
  }

  const order = orderQuery.data;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityLabel="Go back">
          <ArrowLeft size={20} color={Colors.ink} />
        </Pressable>
        <Text style={styles.eyebrow}>ORDER #{order.id}</Text>
        <Text style={styles.title}>{order.status}</Text>
        <Text style={styles.meta}>{new Date(order.createdAt).toLocaleString()}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tracking</Text>
          <OrderTimeline status={order.status} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Products</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemMeta}>
                  Qty {item.quantity} · {formatCurrency(item.unitPrice)}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                {formatCurrency(Number(item.unitPrice) * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery</Text>
          <Text style={styles.copy}>{order.shippingAddress}</Text>
          <Text style={styles.copy}>{order.shippingPhone}</Text>
          <Text style={styles.copy}>Payment · {order.paymentMethod}</Text>
          <Text style={styles.total}>Total {formatCurrency(order.total)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 40 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: { ...Typography.label, color: Colors.gold },
  title: { ...Typography.title, color: Colors.ink },
  meta: { ...Typography.caption, color: Colors.inkMuted },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  cardTitle: { ...Typography.subtitle, color: Colors.ink, fontSize: 16 },
  item: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  itemName: { ...Typography.body, color: Colors.ink, fontWeight: '600' },
  itemMeta: { ...Typography.caption, color: Colors.inkMuted, marginTop: 2 },
  itemPrice: { ...Typography.body, color: Colors.inkSoft },
  copy: { ...Typography.body, color: Colors.inkMuted },
  total: { ...Typography.price, color: Colors.ink, marginTop: 8 },
});
