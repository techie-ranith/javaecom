import type { Product } from '../types/store'

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`

export const products: Product[] = [
  { id: 1, name: 'Nocturne Amber', brand: 'Aurelia', description: 'A warm, enveloping composition of amber, saffron and sandalwood.', imageUrl: image('photo-1594035910387-fea47794261f'), gender: 'Unisex', price: 16500, discountPrice: 13900, stock: 12, featured: true, categoryName: 'Signature', rating: 4.9, reviews: 48 },
  { id: 2, name: 'Velvet Bloom', brand: 'Maison Élise', description: 'A luminous floral with rose absolute, iris and soft musk.', imageUrl: image('photo-1541643600914-78b084683601'), gender: 'Women', price: 14800, discountPrice: 12500, stock: 8, featured: true, categoryName: 'Women', rating: 4.8, reviews: 36 },
  { id: 3, name: 'Cedar Coast', brand: 'Atelier Noma', description: 'Bright bergamot meets driftwood and vetiver in a modern classic.', imageUrl: image('photo-1592945403244-b3fbafd7f539'), gender: 'Men', price: 13200, stock: 20, featured: true, categoryName: 'Men', rating: 4.7, reviews: 29 },
  { id: 4, name: 'Silk Petals', brand: 'Aurelia', description: 'Peony, pear and cashmere woods made for slow afternoons.', imageUrl: image('photo-1563170351-be82bc888aa4'), gender: 'Women', price: 11900, discountPrice: 9900, stock: 4, featured: false, categoryName: 'Women', rating: 4.6, reviews: 21 },
  { id: 5, name: 'After Rain', brand: 'Noma Studio', description: 'Mineral notes, green fig and a trace of clean white cedar.', imageUrl: image('photo-1523293182086-7651a899d37f'), gender: 'Unisex', price: 15500, stock: 15, featured: false, categoryName: 'Unisex', rating: 4.8, reviews: 17 },
  { id: 6, name: 'Golden Hour', brand: 'Maison Élise', description: 'A radiant veil of neroli, vanilla and golden sandalwood.', imageUrl: image('photo-1590736704728-f4730bb30770'), gender: 'Women', price: 17900, discountPrice: 15500, stock: 6, featured: true, categoryName: 'New arrivals', rating: 4.9, reviews: 12 },
]

export const categories = [
  { name: 'Women', label: 'For her', image: image('photo-1541643600914-78b084683601') },
  { name: 'Men', label: 'For him', image: image('photo-1592945403244-b3fbafd7f539') },
  { name: 'Unisex', label: 'For everyone', image: image('photo-1523293182086-7651a899d37f') },
  { name: 'Gift sets', label: 'Thoughtful gifts', image: image('photo-1590736704728-f4730bb30770') },
]
