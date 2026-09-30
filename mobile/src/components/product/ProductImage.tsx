import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Colors, Radius } from '@/constants/theme';

type Props = {
  uri?: string | null;
  aspectRatio?: number;
  rounded?: boolean;
};

export function ProductImage({ uri, aspectRatio = 0.85, rounded = true }: Props) {
  return (
    <View style={[styles.wrap, { aspectRatio }, rounded && styles.rounded]}>
      <Image
        source={{ uri: uri || undefined }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        accessibilityLabel="Product image"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: Colors.creamSoft,
    overflow: 'hidden',
  },
  rounded: { borderRadius: Radius.lg },
  image: { width: '100%', height: '100%' },
});
