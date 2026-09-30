import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ProfileScreen() {
  const { user, isAuthenticated, isLoading, updateLocalProfile, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        address: user.address ?? '',
      });
    }
  }, [user, reset]);

  if (!isLoading && !isAuthenticated) {
    return <Redirect href={{ pathname: '/(auth)/login', params: { redirect: '/profile' } }} />;
  }

  const onSubmit = handleSubmit(async (values) => {
    await updateLocalProfile(values);
    showToast('Profile updated', 'success');
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityLabel="Go back">
          <ArrowLeft size={20} color={Colors.ink} />
        </Pressable>
        <Text style={styles.eyebrow}>ACCOUNT</Text>
        <Text style={styles.title}>Profile</Text>

        {(
          [
            ['name', 'Name'],
            ['email', 'Email'],
            ['phone', 'Phone'],
            ['address', 'Shipping address'],
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
                editable={name !== 'email'}
                error={errors[name]?.message}
              />
            )}
          />
        ))}

        <Button title="Save changes" loading={isSubmitting} onPress={onSubmit} />
        <Button
          title="Logout"
          variant="danger"
          onPress={async () => {
            await logout();
            router.replace('/(tabs)');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 40 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: { ...Typography.label, color: Colors.gold },
  title: { ...Typography.title, color: Colors.ink },
});
