import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

type ToastType = 'success' | 'error' | 'info';

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>('info');
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (nextMessage: string, nextType: ToastType = 'info') => {
      if (timer.current) clearTimeout(timer.current);
      setMessage(nextMessage);
      setType(nextType);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
          setMessage(null);
        });
      }, 2600);
    },
    [opacity],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              opacity,
              backgroundColor:
                type === 'error' ? Colors.danger : type === 'success' ? Colors.ink : Colors.inkSoft,
            },
          ]}
        >
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: 110,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    zIndex: 100,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
