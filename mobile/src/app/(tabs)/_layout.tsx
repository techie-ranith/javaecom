import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Heart, Home, ShoppingBag, Store, UserRound } from 'lucide-react-native';
import { Colors, Typography } from '@/constants/theme';
import { Badge } from '@/components/common/Badge';
import { useCartCount } from '@/hooks/useStoreQueries';

export default function TabsLayout() {
  const cartCount = useCartCount();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.ink,
        tabBarInactiveTintColor: Colors.inkFaint,
        tabBarLabelStyle: { ...Typography.caption, fontSize: 11, fontWeight: '600' },
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <ShoppingBag color={color} size={size} />
              <Badge count={cartCount} style={styles.badge} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
  },
});
