import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Brand } from '@/constants/theme';
import { formatCurrency } from '@/utils/helpers';

type Props = {
  subtotal: number;
  discount?: number;
  delivery: number;
  total: number;
};

export function CartSummary({ subtotal, discount = 0, delivery, total }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>ORDER SUMMARY</Text>
      <Row label="Subtotal" value={formatCurrency(subtotal)} />
      {discount > 0 ? <Row label="Discount" value={`- ${formatCurrency(discount)}`} /> : null}
      <Row
        label="Delivery"
        value={delivery === 0 ? 'Complimentary' : formatCurrency(delivery)}
      />
      {delivery > 0 ? (
        <Text style={styles.hint}>
          Free delivery over {formatCurrency(Brand.freeDeliveryThreshold)}
        </Text>
      ) : null}
      <View style={styles.divider} />
      <Row label="Total" value={formatCurrency(total)} bold />
    </View>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.value, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  eyebrow: { ...Typography.label, color: Colors.gold, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
  label: { ...Typography.body, color: Colors.inkMuted },
  value: { ...Typography.body, color: Colors.ink },
  bold: { fontWeight: '700', color: Colors.ink },
  hint: { ...Typography.caption, color: Colors.inkFaint },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
});
