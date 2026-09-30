import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';

export function LoadingSpinner({ full }: { full?: boolean }) {
  return (
    <View style={[styles.wrap, full && styles.full]}>
      <ActivityIndicator size="large" color={Colors.ink} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  full: { flex: 1 },
});
