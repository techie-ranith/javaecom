import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
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

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string }>();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
      showToast('Welcome back', 'success');
      if (params.redirect) {
        router.replace(params.redirect as never);
      } else {
        router.replace('/(tabs)/account');
      }
    } catch (error) {
      showToast(getErrorMessage(error, 'Unable to sign in'), 'error');
    }
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.brand}>{Brand.name}</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue your fragrance journey.</Text>

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
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              secureTextEntry
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />

        <Button title="Sign in" loading={isSubmitting} onPress={onSubmit} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here?</Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text style={styles.link}>Create an account</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { flex: 1, padding: Spacing.xl, gap: Spacing.lg, justifyContent: 'center' },
  brand: { ...Typography.label, color: Colors.gold, letterSpacing: 2 },
  title: { ...Typography.hero, color: Colors.ink, fontSize: 30 },
  subtitle: { ...Typography.body, color: Colors.inkMuted, marginBottom: Spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: Spacing.sm },
  footerText: { ...Typography.body, color: Colors.inkMuted },
  link: { ...Typography.body, color: Colors.ink, fontWeight: '700' },
});
