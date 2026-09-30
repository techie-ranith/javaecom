import React from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = TextInputProps & {
  onClear?: () => void;
  onSubmitSearch?: () => void;
};

export function SearchBar({ value, onClear, onSubmitSearch, style, ...rest }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <Search size={18} color={Colors.inkMuted} />
      <TextInput
        value={value}
        placeholderTextColor={Colors.inkFaint}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmitSearch}
        accessibilityLabel="Search fragrances"
        {...rest}
      />
      {value ? (
        <Pressable onPress={onClear} hitSlop={10} accessibilityLabel="Clear search">
          <X size={18} color={Colors.inkMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.creamSoft,
    paddingHorizontal: Spacing.lg,
  },
  input: {
    flex: 1,
    color: Colors.ink,
    fontSize: 15,
    paddingVertical: Spacing.sm,
  },
});
