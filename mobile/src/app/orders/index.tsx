import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Package } from 'lucide-react-native';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Skeleton } from '@/components/common/Skeleton';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { QUERY_KEYS } from '@/constants/storage';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/helpers';

export default function OrdersScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const ordersQuery = useQuery({
    queryKey: [QUERY_KEYS.orders],
    queryFn: orderService.getOrders,
    enabled: isAuthenticated,
  });

  if (!isLoading && !isAuthenticated) {
    return <Redirect href={{ pathname: '/(auth)/login', params: { redirect: '/orders' } }} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityLabel="Go back">
          <ArrowLeft size={20} color={Colors.ink} />
        </Pressable>
        <Text style={styles.title}>Orders</Text>
      </View>

      {ordersQuery.isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          <Skeleton height={96} />
          <Skeleton height={96} />
        </View>
      ) : ordersQuery.isError ? (
        <ErrorState message="Unable to load orders." onRetry={() => ordersQuery.refetch()} />
      ) : (
        <FlatList
          data={ordersQuery.data ?? []}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon={<Package size={40} color={Colors.inkFaint} />}
              title="No orders yet"
              description="When you place an order, it will appear here."
              actionLabel="Start shopping"
              onAction={() => router.push('/(tabs)/shop')}
            />
          }
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push(`/orders/${item.id}`)}>
              <View style={styles.row}>
                <Text style={styles.orderId}>#{item.id}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.meta}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.total}>{formatCurrency(item.total)}</Text>
            </Pressable>
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
    gap: Spacing.md,
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
  title: { ...Typography.title, color: Colors.ink },
  list: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { ...Typography.subtitle, color: Colors.ink, fontSize: 16 },
  badge: {
    backgroundColor: Colors.creamSoft,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { ...Typography.caption, color: Colors.inkSoft, fontWeight: '600' },
  meta: { ...Typography.caption, color: Colors.inkMuted },
  total: { ...Typography.price, color: Colors.ink, marginTop: 4 },
});
