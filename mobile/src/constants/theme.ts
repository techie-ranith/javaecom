export const Colors = {
  ink: '#1C1917',
  inkSoft: '#44403C',
  inkMuted: '#78716C',
  inkFaint: '#A8A29E',
  cream: '#FAF9F7',
  creamSoft: '#F3F1EE',
  creamDeep: '#E8E4DE',
  gold: '#A89060',
  goldSoft: '#C4B08A',
  goldDeep: '#8A7348',
  surface: '#FFFFFF',
  danger: '#B42318',
  success: '#067647',
  border: '#E7E5E4',
  overlay: 'rgba(28, 25, 23, 0.45)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const Shadows = {
  soft: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  card: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
} as const;

export const Typography = {
  hero: { fontSize: 32, lineHeight: 40, fontWeight: '600' as const, letterSpacing: -0.5 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '600' as const, letterSpacing: -0.3 },
  subtitle: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const, letterSpacing: 1.2 },
  price: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
};

export const Brand = {
  name: 'Aurelia',
  tagline: 'PARFUMS',
  currency: 'LKR',
  freeDeliveryThreshold: 20000,
  deliveryFee: 650,
};
