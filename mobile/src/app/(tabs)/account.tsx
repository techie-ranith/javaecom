import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  Heart,
  LogOut,
  Package,
  UserRound,
} from 'lucide-react-native';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { QUERY_KEYS } from '@/constants/storage';
import { useAuth } from '@/context/AuthContext';
import { useCartQuery, useWishlistQuery } from '@/hooks/useStoreQueries';
import { orderService } from '@/services/orderService';

export default function AccountScreen() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const wishlistQuery = useWishlistQuery();
  const cartQuery = useCartQuery();

  const ordersQuery = useQuery({
    queryKey: [QUERY_KEYS.orders],
    queryFn: orderService.getOrders,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState
          icon={<UserRound size={40} color={Colors.inkFaint} />}
          title="Welcome to Aurelia"
          description="Sign in to manage orders, wishlist and your profile."
          actionLabel="Sign in"
          onAction={() => router.push('/(auth)/login')}
        />
        <View style={styles.guestActions}>
          <Button
            title="Create account"
            variant="secondary"
            onPress={() => router.push('/(auth)/register')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const orders = ordersQuery.data ?? [];
  const pending = orders.filter((order) => order.status === 'PENDING' || order.status === 'PROCESSING').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() ?? 'A'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <Stat label="Total Orders" value={String(orders.length)} />
          <Stat label="Pending" value={String(pending)} />
          <Stat label="Wishlist" value={String(wishlistQuery.data?.length ?? 0)} />
        </View>

        <View style={styles.menu}>
          <MenuItem
            icon={<Package size={18} color={Colors.ink} />}
            label="Orders"
            onPress={() => router.push('/orders')}
          />
          <MenuItem
            icon={<Heart size={18} color={Colors.ink} />}
            label="Wishlist"
            onPress={() => router.push('/(tabs)/wishlist')}
          />
          <MenuItem
            icon={<UserRound size={18} color={Colors.ink} />}
            label="Profile"
            onPress={() => router.push('/profile')}
          />
          <MenuItem
            icon={<LogOut size={18} color={Colors.danger} />}
            label="Logout"
            danger
            onPress={async () => {
              await logout();
              router.replace('/(tabs)');
            }}
          />
        </View>

        {(cartQuery.data?.items.length ?? 0) > 0 ? (
          <Button title="View cart" variant="secondary" onPress={() => router.push('/(tabs)/cart')} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress} accessibilityRole="button">
      <View style={styles.menuLeft}>
        {icon}
        <Text style={[styles.menuLabel, danger && { color: Colors.danger }]}>{label}</Text>
      </View>
      <ChevronRight size={18} color={Colors.inkFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 120 },
  guestActions: { paddingHorizontal: Spacing.lg },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '600' },
  name: { ...Typography.subtitle, color: Colors.ink },
  email: { ...Typography.caption, color: Colors.inkMuted, marginTop: 2 },
  stats: { flexDirection: 'row', gap: Spacing.md },
  stat: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 4,
    ...Shadows.card,
  },
  statValue: { ...Typography.subtitle, color: Colors.ink },
  statLabel: { ...Typography.caption, color: Colors.inkMuted },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  menuLabel: { ...Typography.body, color: Colors.ink, fontWeight: '500' },
});
