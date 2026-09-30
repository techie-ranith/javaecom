import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { CHECKOUT_DRAFT_KEY } from '@/constants/storage';

const schema = z.object({
  address: z.string().min(5, 'Enter your address'),
  city: z.string().min(2, 'Enter your city'),
  province: z.string().min(2, 'Enter your province'),
  postalCode: z.string().min(3, 'Enter postal code'),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutShipping() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: '',
      city: '',
      province: '',
      postalCode: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const existing = await SecureStore.getItemAsync(CHECKOUT_DRAFT_KEY);
      const draft = existing ? JSON.parse(existing) : {};
      await SecureStore.setItemAsync(
        CHECKOUT_DRAFT_KEY,
        JSON.stringify({ ...draft, ...values }),
      );
    } catch {
      // ignore
    }
    router.push('/checkout/payment');
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.step}>STEP 2 OF 4</Text>
        <Text style={styles.title}>Shipping address</Text>
        {(
          [
            ['address', 'Address'],
            ['city', 'City'],
            ['province', 'Province'],
            ['postalCode', 'Postal code'],
          ] as const
        ).map(([name, label]) => (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={label}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors[name]?.message}
              />
            )}
          />
        ))}
        <Button title="Continue to payment" onPress={onSubmit} />
        <Button title="Back" variant="ghost" onPress={() => router.back()} />
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
