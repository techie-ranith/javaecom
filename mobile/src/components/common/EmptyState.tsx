import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Button } from '@/components/common/Button';

type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button title={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['3xl'],
    gap: Spacing.md,
  },
  title: { ...Typography.subtitle, color: Colors.ink, textAlign: 'center' },
  description: { ...Typography.body, color: Colors.inkMuted, textAlign: 'center' },
  action: { width: '100%', marginTop: Spacing.sm },
});
