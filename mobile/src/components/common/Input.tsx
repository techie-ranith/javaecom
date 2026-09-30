import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={Colors.inkFaint}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  label: { ...Typography.caption, color: Colors.inkSoft, fontWeight: '500' },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    color: Colors.ink,
    fontSize: 15,
  },
  inputError: { borderColor: Colors.danger },
  error: { ...Typography.caption, color: Colors.danger },
});
