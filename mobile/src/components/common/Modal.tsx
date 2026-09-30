import React from 'react';
import { Modal as RNModal, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ visible, onClose, children }: Props) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
  },
});
