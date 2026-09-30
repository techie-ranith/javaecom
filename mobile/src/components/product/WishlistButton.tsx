import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '@/constants/theme';
import { QUERY_KEYS } from '@/constants/storage';
import { useToast } from '@/context/ToastContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useIsWishlisted } from '@/hooks/useStoreQueries';
import { wishlistService } from '@/services/wishlistService';
import { getErrorMessage } from '@/utils/helpers';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function WishlistButton({ productId, size = 20 }: { productId: number; size?: number }) {
  const active = useIsWishlisted(productId);
  const requireAuth = useRequireAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const scale = useSharedValue(1);

  const mutation = useMutation({
    mutationFn: async () => {
      if (active) return wishlistService.remove(productId);
      return wishlistService.add(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.wishlist] });
      showToast(active ? 'Removed from wishlist' : 'Saved to wishlist', 'success');
    },
    onError: (error) => showToast(getErrorMessage(error), 'error'),
  });

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remove from wishlist' : 'Add to wishlist'}
      hitSlop={10}
      style={[styles.button, animatedStyle]}
      onPress={() => {
        requireAuth(() => {
          scale.value = withSequence(withSpring(1.25), withSpring(1));
          mutation.mutate();
        });
      }}
    >
      <Heart
        size={size}
        color={active ? Colors.danger : Colors.ink}
        fill={active ? Colors.danger : 'transparent'}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
