import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Button } from '@/components/common/Button';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  message = 'Unable to load data. Please try again.',
  onRetry,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button title="Try again" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: Spacing.xl,
    gap: Spacing.md,
    alignItems: 'center',
  },
  title: { ...Typography.subtitle, color: Colors.ink },
  message: { ...Typography.body, color: Colors.inkMuted, textAlign: 'center' },
});
