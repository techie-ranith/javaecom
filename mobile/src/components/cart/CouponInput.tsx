import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Spacing } from '@/constants/theme';

type Props = {
  onApply: (code: string) => void;
  loading?: boolean;
};

export function CouponInput({ onApply, loading }: Props) {
  const [code, setCode] = useState('');

  return (
    <View style={styles.wrap}>
      <View style={styles.input}>
        <Input
          label="Coupon code"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          placeholder="WELCOME10"
        />
      </View>
      <Button
        title="Apply"
        fullWidth={false}
        loading={loading}
        style={styles.button}
        onPress={() => onApply(code.trim())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm },
  input: { flex: 1 },
  button: { minWidth: 96, marginBottom: 1 },
});
