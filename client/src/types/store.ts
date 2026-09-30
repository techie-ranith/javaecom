export type Product = {
  id: number
  name: string
  brand: string
  description: string
  imageUrl: string
  hoverImageUrl?: string
  gender: string
  price: number
  discountPrice?: number
  stock: number
  featured: boolean
  categoryName: string
  rating: number
  reviews: number
}

export type CartItem = Product & { quantity: number }
