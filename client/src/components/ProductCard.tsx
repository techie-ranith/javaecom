import { Heart, Plus, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../types/store'

type Props = { product: Product; onAdd: (product: Product) => void; onWishlist: (product: Product) => void }

export function ProductCard({ product, onAdd, onWishlist }: Props) {
  const sale = product.discountPrice && product.discountPrice < product.price
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {sale && <span className="sale-badge">-{Math.round((1 - product.discountPrice! / product.price) * 100)}%</span>}
        <button className="icon-button product-wish" aria-label={`Save ${product.name}`} onClick={() => onWishlist(product)}><Heart size={18} /></button>
        <Link to={`/product/${product.id}`}><img src={product.imageUrl} alt={product.name} /></Link>
        <Link className="quick-view" to={`/product/${product.id}`}>Quick view</Link>
      </div>
      <div className="product-info">
        <p className="eyebrow">{product.brand}</p>
        <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
        <div className="rating"><Star size={13} fill="currentColor" /> {product.rating} <span>({product.reviews})</span></div>
        <div className="product-bottom">
          <div><strong>LKR {(product.discountPrice ?? product.price).toLocaleString()}</strong>{sale && <del>LKR {product.price.toLocaleString()}</del>}</div>
          <button className="add-button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to cart`}><Plus size={18} /></button>
        </div>
      </div>
    </article>
  )
}
