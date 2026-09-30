import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ORDER_TIMELINE } from '@/constants/storage';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { OrderStatus } from '@/types';

const steps = [...ORDER_TIMELINE];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === 'CANCELLED') {
    return (
      <View style={styles.cancelled}>
        <Text style={styles.cancelledText}>This order was cancelled.</Text>
      </View>
    );
  }

  const currentIndex = Math.max(0, steps.indexOf(status as (typeof steps)[number]));

  return (
    <View style={styles.wrap}>
      {steps.map((step, index) => {
        const done = index <= currentIndex;
        const current = index === currentIndex;
        return (
          <View key={step} style={styles.row}>
            <View style={styles.rail}>
              <View style={[styles.dot, done && styles.dotDone, current && styles.dotCurrent]} />
              {index < steps.length - 1 ? (
                <View style={[styles.line, index < currentIndex && styles.lineDone]} />
              ) : null}
            </View>
            <View style={styles.copy}>
              <Text style={[styles.label, done && styles.labelDone]}>{formatStep(step)}</Text>
              {current ? <Text style={styles.caption}>Current status</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function formatStep(step: string) {
  return step.charAt(0) + step.slice(1).toLowerCase();
}

const styles = StyleSheet.create({
  wrap: { gap: 0 },
  row: { flexDirection: 'row', gap: Spacing.md, minHeight: 56 },
  rail: { alignItems: 'center', width: 20 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.creamDeep,
    backgroundColor: Colors.surface,
  },
  dotDone: { borderColor: Colors.ink, backgroundColor: Colors.ink },
  dotCurrent: { borderColor: Colors.gold, backgroundColor: Colors.gold },
  line: { flex: 1, width: 2, backgroundColor: Colors.creamDeep, marginVertical: 4 },
  lineDone: { backgroundColor: Colors.ink },
  copy: { flex: 1, paddingBottom: Spacing.lg },
  label: { ...Typography.body, color: Colors.inkFaint, fontWeight: '600' },
  labelDone: { color: Colors.ink },
  caption: { ...Typography.caption, color: Colors.goldDeep },
  cancelled: {
    backgroundColor: Colors.creamSoft,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
  cancelledText: { ...Typography.body, color: Colors.danger },
});
