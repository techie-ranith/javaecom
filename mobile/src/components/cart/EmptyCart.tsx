import React from 'react';
import { ShoppingBag } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/common/EmptyState';
import { Colors } from '@/constants/theme';

export function EmptyCart() {
  const router = useRouter();
  return (
    <EmptyState
      icon={<ShoppingBag size={40} color={Colors.inkFaint} />}
      title="Your bag is waiting"
      description="Explore the collection and find a scent that feels like you."
      actionLabel="Continue shopping"
      onAction={() => router.push('/(tabs)/shop')}
    />
  );
}
