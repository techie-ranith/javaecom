import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

type Props = {
  eyebrow?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ eyebrow, title, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button">
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  copy: { flex: 1, gap: 4 },
  eyebrow: { ...Typography.label, color: Colors.gold, textTransform: 'uppercase' },
  title: { ...Typography.title, color: Colors.ink },
  action: { ...Typography.caption, color: Colors.inkSoft, fontWeight: '600' },
});
