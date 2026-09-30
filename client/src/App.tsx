import { useMemo, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, Heart, Menu, Search, ShoppingBag, Sparkles, Truck, UserRound, X } from 'lucide-react'
import { categories, products } from './data/products'
import { ProductCard } from './components/ProductCard'
import { RequireStaff } from './staff/RequireStaff'
import { StaffLoginForm } from './staff/StaffLoginForm'
import { StaffLoginPage } from './staff/StaffLoginPage'
import { StaffRoutes } from './staff/StaffRoutes'
import type { CartItem, Product } from './types/store'
import './App.css'

function App() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [, setWishlist] = useState<number[]>([])
  const addToCart = (product: Product) => setCart(items => {
    const existing = items.find(item => item.id === product.id)
    return existing ? items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }]
  })
  const toggleWishlist = (product: Product) => setWishlist(ids => ids.includes(product.id) ? ids.filter(id => id !== product.id) : [...ids, product.id])
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/staff/login" element={<StaffLoginPage />} />
        <Route
          path="/staff/*"
          element={
            <RequireStaff>
              <StaffRoutes />
            </RequireStaff>
          }
        />
        <Route
          path="*"
          element={
            <StoreLayout cartCount={cartCount}>
              <Routes>
                <Route path="/" element={<Home addToCart={addToCart} toggleWishlist={toggleWishlist} />} />
                <Route path="/shop" element={<Shop addToCart={addToCart} toggleWishlist={toggleWishlist} />} />
                <Route path="/category/:slug" element={<Shop addToCart={addToCart} toggleWishlist={toggleWishlist} />} />
                <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
                <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
                <Route path="*" element={<Home addToCart={addToCart} toggleWishlist={toggleWishlist} />} />
              </Routes>
            </StoreLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

function StoreLayout({ children, cartCount }: { children: React.ReactNode; cartCount: number }) {
  const [menu, setMenu] = useState(false)
  return <><div className="announcement"><Sparkles size={14} /> Complimentary delivery on orders over LKR 20,000 <Link to="/shop">Explore now <ArrowRight size={13} /></Link></div>
    <header className="navbar"><div className="container nav-inner"><button className="mobile-menu icon-button" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button><Link to="/" className="logo">AURELIA<span>PARFUMS</span></Link>
      <nav className={menu ? 'nav-links open' : 'nav-links'}><Link to="/">Home</Link><Link to="/shop">Shop</Link><Link to="/category/Men">Men</Link><Link to="/category/Women">Women</Link><Link to="/category/Unisex">Unisex</Link><Link to="/category/Gift sets">Gift sets</Link></nav>
      <div className="nav-actions"><Link to="/shop" className="icon-button" aria-label="Search"><Search size={19} /></Link><Link to="/account" className="icon-button" aria-label="Account"><UserRound size={19} /></Link><Link to="/cart" className="icon-button cart-icon" aria-label="Cart"><ShoppingBag size={20} />{cartCount > 0 && <b>{cartCount}</b>}</Link></div>
    </div></header>{children}<Footer /></>
}

function Home({ addToCart, toggleWishlist }: { addToCart: (p: Product) => void; toggleWishlist: (p: Product) => void }) {
  return <main><section className="hero-section"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow gold">THE ART OF SCENT</p><h1>Find the scent<br /><em>that feels like you.</em></h1><p className="hero-text">Thoughtfully sourced fragrances for the moments that become memories. Discover a more personal kind of luxury.</p><div className="hero-actions"><Link className="button button-dark" to="/shop">Shop collection <ArrowRight size={16} /></Link><Link className="text-link" to="/category/Unisex">Explore signature scents</Link></div></div><div className="hero-art"><div className="hero-orb" /><img src={products[0].imageUrl} alt="Nocturne Amber fragrance" /><div className="hero-note">NOCTURNE AMBER <span>EAU DE PARFUM · 50ML</span></div></div></div></section>
    <section className="section container"><SectionHeading eyebrow="DISCOVER YOURS" title="Made for every mood." /><div className="category-grid">{categories.map(category => <Link to={`/category/${category.name}`} className="category-card" key={category.name}><img src={category.image} alt="" /><div><span>{category.label}</span><h3>{category.name}</h3><ArrowRight size={17} /></div></Link>)}</div></section>
    <section className="section section-tint"><div className="container"><SectionHeading eyebrow="THE EDIT" title="Loved by many." action="View all" /><div className="product-grid">{products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} onAdd={addToCart} onWishlist={toggleWishlist} />)}</div></div></section>
    <section className="statement container"><div><p className="eyebrow gold">A MOMENT, BOTTLED</p><h2>Discover your<br /><em>signature.</em></h2><p>There is a fragrance for every chapter. Let us help you find yours.</p><Link className="button button-light" to="/shop">Explore the collection <ArrowRight size={16} /></Link></div><div className="statement-image"><img src={products[4].imageUrl} alt="Fragrance bottle in soft light" /></div></section>
    <section className="perks"><div className="container perks-grid">{[['Authentic, always', 'Every bottle is sourced from trusted partners.', Check], ['Thoughtful delivery', 'Carefully packed, islandwide.', Truck], ['A little help', 'Personal recommendations, anytime.', Heart]].map(([title, text, Icon]) => <div className="perk" key={String(title)}><span><Icon size={19} /></span><div><h3>{title as string}</h3><p>{text as string}</p></div></div>)}</div></section>
    <StaffLoginSection />
    <section className="newsletter"><div className="container newsletter-inner"><div><p className="eyebrow gold">THE AURELIA LETTER</p><h2>Notes worth opening.</h2><p>New arrivals, quiet rituals and fragrance stories, once a month.</p></div><form onSubmit={e => e.preventDefault()}><input type="email" placeholder="Your email address" aria-label="Email address" /><button className="button button-dark">Subscribe <ArrowRight size={16} /></button></form></div></section>
  </main>
}

function StaffLoginSection() {
  const navigate = useNavigate()
  return (
    <section className="staff-login" id="staff-login">
      <div className="container staff-login-inner">
        <div>
          <p className="eyebrow gold">STAFF ACCESS</p>
          <h2>Store team sign in</h2>
          <p>For Aurelia staff managing inventory, orders, and the collection.</p>
          <Link className="text-link" to="/staff/login" style={{ marginTop: 12, display: 'inline-flex' }}>
            Open full staff login <ArrowRight size={14} />
          </Link>
        </div>
        <StaffLoginForm onSuccess={() => navigate('/staff/dashboard')} />
      </div>
    </section>
  )
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) { return <div className="section-heading"><div><p className="eyebrow gold">{eyebrow}</p><h2>{title}</h2></div>{action && <Link className="text-link" to="/shop">{action} <ArrowRight size={15} /></Link>}</div> }

function Shop({ addToCart, toggleWishlist }: { addToCart: (p: Product) => void; toggleWishlist: (p: Product) => void }) {
  const { slug } = useParams(); const [search, setSearch] = useState(''); const [sort, setSort] = useState('Featured')
  const filtered = useMemo(() => products.filter(p => (!slug || p.gender.toLowerCase() === slug.toLowerCase() || p.categoryName.toLowerCase() === slug.toLowerCase()) && `${p.name} ${p.brand}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort === 'Price: low to high' ? a.price - b.price : sort === 'Price: high to low' ? b.price - a.price : Number(b.featured) - Number(a.featured)), [search, slug, sort])
  return <main className="shop-page container"><div className="page-intro"><p className="eyebrow gold">THE COLLECTION</p><h1>{slug ? slug : 'All fragrances'}</h1><p>Find the one that lingers. Explore our considered collection of modern classics.</p></div><div className="shop-toolbar"><label className="search-field"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search fragrances" /></label><label className="sort-field">Sort by <select value={sort} onChange={e => setSort(e.target.value)}><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select><ChevronDown size={15} /></label></div>{filtered.length ? <div className="product-grid shop-grid">{filtered.map(product => <ProductCard key={product.id} product={product} onAdd={addToCart} onWishlist={toggleWishlist} />)}</div> : <div className="empty"><Search size={32} /><h2>Nothing found</h2><p>Try a different search.</p></div>}</main>
}

function ProductDetails({ addToCart }: { addToCart: (p: Product) => void }) {
  const { id } = useParams()
  const product = products.find(p => p.id === Number(id)) ?? products[0]
  return <main className="container detail-page"><Link className="back-link" to="/shop">← Back to collection</Link><div className="detail-grid"><div className="detail-image"><img src={product.imageUrl} alt={product.name} /></div><div className="detail-copy"><p className="eyebrow gold">{product.brand}</p><h1>{product.name}</h1><div className="rating">★ {product.rating} <span>({product.reviews} reviews)</span></div><p className="detail-description">{product.description}</p><div className="detail-price">LKR {(product.discountPrice ?? product.price).toLocaleString()} {product.discountPrice && <del>LKR {product.price.toLocaleString()}</del>}</div><p className="stock"><span /> In stock · ready to ship</p><button className="button button-dark wide-button" onClick={() => addToCart(product)}>Add to bag <ShoppingBag size={17} /></button><div className="detail-meta"><p><strong>Notes</strong> Amber, saffron, sandalwood</p><p><strong>Shipping</strong> Complimentary over LKR 20,000</p><p><strong>Returns</strong> Easy returns within 14 days</p></div></div></div></main>
}

function Cart({ cart, setCart }: { cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>> }) {
  const navigate = useNavigate(); const total = cart.reduce((sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity, 0)
  return <main className="container cart-page"><div className="page-intro left"><p className="eyebrow gold">YOUR SELECTION</p><h1>Shopping bag</h1></div>{cart.length === 0 ? <div className="empty"><ShoppingBag size={36} /><h2>Your bag is waiting.</h2><p>Explore the collection and find something memorable.</p><Link className="button button-dark" to="/shop">Continue shopping</Link></div> : <div className="cart-grid"><div>{cart.map(item => <div className="cart-row" key={item.id}><img src={item.imageUrl} alt="" /><div><p className="eyebrow">{item.brand}</p><h3>{item.name}</h3><p>LKR {(item.discountPrice ?? item.price).toLocaleString()}</p><div className="quantity"><button onClick={() => setCart(items => items.map(i => i.id === item.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))}>−</button><span>{item.quantity}</span><button onClick={() => setCart(items => items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))}>+</button></div></div><button className="remove" onClick={() => setCart(items => items.filter(i => i.id !== item.id))}><X size={17} /></button></div>)}</div><aside className="order-summary"><p className="eyebrow gold">SUMMARY</p><h2>Your order</h2><div><span>Subtotal</span><strong>LKR {total.toLocaleString()}</strong></div><div><span>Delivery</span><strong>{total >= 20000 ? 'Complimentary' : 'LKR 650'}</strong></div><hr /><div className="total"><span>Total</span><strong>LKR {(total + (total >= 20000 ? 0 : 650)).toLocaleString()}</strong></div><button className="button button-dark wide-button" onClick={() => navigate('/checkout')}>Checkout <ArrowRight size={16} /></button></aside></div>}</main>
}

function Footer() { return <footer><div className="container footer-grid"><div><Link to="/" className="logo">AURELIA<span>PARFUMS</span></Link><p>Fragrance for the beautifully<br />unhurried.</p></div><div><h4>Explore</h4><Link to="/shop">All fragrances</Link><Link to="/category/Women">For her</Link><Link to="/category/Men">For him</Link></div><div><h4>Care</h4><Link to="/account">Your account</Link><Link to="/cart">Shopping bag</Link><a href="mailto:hello@aurelia.lk">Contact us</a></div><div><h4>Find us</h4><p>Colombo, Sri Lanka</p><p>hello@aurelia.lk</p><p>+94 11 234 5678</p></div></div><div className="container footer-bottom"><span>© 2026 Aurelia Parfums</span><span>Made with intention.</span></div></footer> }

export default App
