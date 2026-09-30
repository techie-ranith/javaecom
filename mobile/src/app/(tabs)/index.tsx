import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowRight,
  Check,
  Headphones,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react-native';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/common/Button';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { Brand, Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { QUERY_KEYS } from '@/constants/storage';
import { homeTestimonials } from '@/data/mock';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { slugify } from '@/utils/helpers';

export default function HomeScreen() {
  const router = useRouter();

  const categoriesQuery = useQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: categoryService.getCategories,
  });

  const bestSellersQuery = useQuery({
    queryKey: [QUERY_KEYS.products, 'featured'],
    queryFn: () => productService.getProducts({ featured: true, size: 8 }),
  });

  const newArrivalsQuery = useQuery({
    queryKey: [QUERY_KEYS.products, 'newest'],
    queryFn: () => productService.getProducts({ size: 8, sort: 'newest' }),
  });

  const heroProduct = bestSellersQuery.data?.content?.[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>{Brand.name}</Text>
            <Text style={styles.tagline}>{Brand.tagline}</Text>
          </View>
          <Pressable
            accessibilityLabel="Search"
            style={styles.iconButton}
            onPress={() => router.push('/search')}
          >
            <Search size={20} color={Colors.ink} />
          </Pressable>
        </View>

        <View style={styles.announcement}>
          <Sparkles size={14} color={Colors.goldDeep} />
          <Text style={styles.announcementText}>Islandwide Delivery Available</Text>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>THE ART OF SCENT</Text>
            <Text style={styles.heroTitle}>Find the scent that feels like you.</Text>
            <Text style={styles.heroText}>
              Thoughtfully sourced fragrances for the moments that become memories.
            </Text>
            <Button title="Shop Now" onPress={() => router.push('/(tabs)/shop')} />
          </View>
          {heroProduct ? (
            <Image source={{ uri: heroProduct.imageUrl }} style={styles.heroImage} contentFit="cover" />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]} />
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader eyebrow="DISCOVER" title="Shop by mood" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {(categoriesQuery.data ?? []).slice(0, 4).map((category) => (
              <Pressable
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push(`/category/${category.slug ?? slugify(category.name)}`)}
              >
                {category.imageUrl ? (
                  <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} contentFit="cover" />
                ) : (
                  <View style={[styles.categoryImage, styles.heroPlaceholder]} />
                )}
                <Text style={styles.categoryName}>{category.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeader
            eyebrow="THE EDIT"
            title="Best sellers"
            actionLabel="View all"
            onAction={() => router.push('/(tabs)/shop')}
          />
          <ProductCarousel
            products={bestSellersQuery.data?.content ?? []}
            loading={bestSellersQuery.isLoading}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader
            eyebrow="JUST IN"
            title="New arrivals"
            actionLabel="Explore"
            onAction={() => router.push('/(tabs)/shop')}
          />
          <ProductCarousel
            products={newArrivalsQuery.data?.content ?? []}
            loading={newArrivalsQuery.isLoading}
          />
        </View>

        <View style={styles.promo}>
          <Text style={styles.eyebrow}>A MOMENT, BOTTLED</Text>
          <Text style={styles.promoTitle}>Find Your Signature Scent</Text>
          <Text style={styles.promoText}>
            There is a fragrance for every chapter. Let us help you find yours.
          </Text>
          <Pressable style={styles.promoLink} onPress={() => router.push('/(tabs)/shop')}>
            <Text style={styles.promoLinkText}>Explore the collection</Text>
            <ArrowRight size={16} color={Colors.surface} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <SectionHeader eyebrow="WHY AURELIA" title="Why choose us" />
          <View style={styles.perks}>
            {[
              { icon: ShieldCheck, title: 'Authentic Products', text: 'Sourced from trusted partners.' },
              { icon: Truck, title: 'Islandwide Delivery', text: 'Carefully packed, delivered islandwide.' },
              { icon: Check, title: 'Secure Payments', text: 'Protected checkout every time.' },
              { icon: Headphones, title: 'Customer Support', text: 'Personal help when you need it.' },
            ].map((perk) => (
              <View key={perk.title} style={styles.perk}>
                <perk.icon size={20} color={Colors.goldDeep} />
                <Text style={styles.perkTitle}>{perk.title}</Text>
                <Text style={styles.perkText}>{perk.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { paddingBottom: Spacing['3xl'] }]}>
          <SectionHeader eyebrow="VOICES" title="What customers say" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewRow}>
            {homeTestimonials.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <Text style={styles.reviewStars}>{'★'.repeat(review.rating)}</Text>
                <Text style={styles.reviewText}>“{review.text}”</Text>
                <Text style={styles.reviewName}>{review.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { paddingBottom: 40 },
  topBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: { ...Typography.title, color: Colors.ink, letterSpacing: 2 },
  tagline: { ...Typography.label, color: Colors.gold, marginTop: 2 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  announcement: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.creamSoft,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  announcementText: { ...Typography.caption, color: Colors.inkSoft, fontWeight: '500' },
  hero: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.soft,
  },
  heroCopy: { padding: Spacing.xl, gap: Spacing.md },
  eyebrow: { ...Typography.label, color: Colors.gold },
  heroTitle: { ...Typography.hero, color: Colors.ink, fontSize: 28 },
  heroText: { ...Typography.body, color: Colors.inkMuted },
  heroImage: { width: '100%', height: 240 },
  heroPlaceholder: { backgroundColor: Colors.creamDeep },
  section: { marginTop: Spacing['2xl'] },
  categoryRow: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  categoryCard: { width: 120, gap: Spacing.sm },
  categoryImage: { width: 120, height: 140, borderRadius: Radius.lg, backgroundColor: Colors.creamSoft },
  categoryName: { ...Typography.caption, color: Colors.ink, fontWeight: '600', textAlign: 'center' },
  promo: {
    marginTop: Spacing['2xl'],
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.ink,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  promoTitle: { ...Typography.title, color: Colors.surface },
  promoText: { ...Typography.body, color: 'rgba(255,255,255,0.72)' },
  promoLink: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: Spacing.sm },
  promoLinkText: { color: Colors.surface, fontWeight: '600' },
  perks: {
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  perk: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  perkTitle: { ...Typography.caption, color: Colors.ink, fontWeight: '700' },
  perkText: { ...Typography.caption, color: Colors.inkMuted },
  reviewRow: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  reviewCard: {
    width: 260,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  reviewStars: { color: Colors.gold, letterSpacing: 2 },
  reviewText: { ...Typography.body, color: Colors.inkSoft },
  reviewName: { ...Typography.caption, color: Colors.ink, fontWeight: '600' },
});
