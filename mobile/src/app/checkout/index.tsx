import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { CHECKOUT_DRAFT_KEY } from '@/constants/storage';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(9, 'Enter a valid phone number'),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutIndex() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
  });

  useEffect(() => {
    reset({
      fullName: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    });
  }, [user, reset]);

  if (!isLoading && !isAuthenticated) {
    return <Redirect href={{ pathname: '/(auth)/login', params: { redirect: '/checkout' } }} />;
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const existing = await SecureStore.getItemAsync(CHECKOUT_DRAFT_KEY);
      const draft = existing ? JSON.parse(existing) : {};
      await SecureStore.setItemAsync(
        CHECKOUT_DRAFT_KEY,
        JSON.stringify({ ...draft, ...values }),
      );
    } catch {
      // ignore persistence errors
    }
    router.push('/checkout/shipping');
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.step}>STEP 1 OF 4</Text>
        <Text style={styles.title}>Customer information</Text>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Full name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.fullName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Phone"
              keyboardType="phone-pad"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.phone?.message}
            />
          )}
        />
        <Button title="Continue to shipping" onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { flex: 1, padding: Spacing.xl, gap: Spacing.lg },
  step: { ...Typography.label, color: Colors.gold },
  title: { ...Typography.title, color: Colors.ink, marginBottom: Spacing.sm },
});
