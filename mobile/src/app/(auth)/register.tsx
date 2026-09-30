import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Brand, Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getErrorMessage } from '@/utils/helpers';

const schema = z
  .object({
    name: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().min(9, 'Enter a valid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterScreen() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      showToast('Account created', 'success');
      router.replace('/(tabs)/account');
    } catch (error) {
      showToast(getErrorMessage(error, 'Unable to create account'), 'error');
    }
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>{Brand.name}</Text>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join Aurelia for a more personal shopping experience.</Text>

        {(
          [
            ['name', 'Full name'],
            ['email', 'Email'],
            ['phone', 'Phone'],
            ['password', 'Password'],
            ['confirmPassword', 'Confirm password'],
          ] as const
        ).map(([name, label]) => (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={label}
                autoCapitalize={name === 'email' ? 'none' : 'words'}
                keyboardType={name === 'email' ? 'email-address' : name === 'phone' ? 'phone-pad' : 'default'}
                secureTextEntry={name === 'password' || name === 'confirmPassword'}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors[name]?.message}
              />
            )}
          />
        ))}

        <Button title="Create account" loading={isSubmitting} onPress={onSubmit} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.link}>Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.xl, gap: Spacing.lg, paddingBottom: 40 },
  brand: { ...Typography.label, color: Colors.gold, letterSpacing: 2 },
  title: { ...Typography.hero, color: Colors.ink, fontSize: 30 },
  subtitle: { ...Typography.body, color: Colors.inkMuted, marginBottom: Spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  footerText: { ...Typography.body, color: Colors.inkMuted },
  link: { ...Typography.body, color: Colors.ink, fontWeight: '700' },
});
