import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Zap, LayoutGrid, Sun, Moon } from 'lucide-react'
import { CATEGORIES, PRODUCTS_BY_CATEGORY } from '../lib/catalog.js'
import { useTheme } from '../hooks/useTheme.js'

function formatPrice(n) {
  return `$${n.toFixed(2).replace(/\.00$/, '')}`
}

export default function Shop() {
  const { discipline } = useParams()
  const navigate = useNavigate()
  const [theme, toggleTheme] = useTheme()
  const category = discipline ? CATEGORIES.find(c => c.slug === discipline) : null

  const products = category
    ? (PRODUCTS_BY_CATEGORY[category.slug] || []).map(p => ({ ...p, tag: category.tag }))
    : CATEGORIES.flatMap(c => (PRODUCTS_BY_CATEGORY[c.slug] || []).map(p => ({ ...p, tag: c.tag })))

  const Icon = category ? category.icon : LayoutGrid

  return (
    <div className="min-h-screen bg-[var(--cb-bg)] text-[var(--cb-text)] font-body">
      {/* Header */}
      <div className="border-b border-[var(--cb-border)] px-6 py-6">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C41E3A, #9B1726)' }}>
              <Zap size={16} color="white" />
            </div>
            <span className="font-display font-bold text-[var(--cb-text)] text-lg">Combo Breaker</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[#C41E3A] hover:text-[#D4AF37] transition-colors text-sm font-mono tracking-wider uppercase">
              ← Back to Home
            </Link>
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-[var(--cb-border-2)] text-[var(--cb-text)] transition-colors hover:border-[#C41E3A] hover:text-[#C41E3A]"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="px-6 pt-8">
        <div className="max-w-[1440px] mx-auto">
          <label htmlFor="category-filter" className="block font-mono text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase mb-2">
            Filter by Category
          </label>
          <select
            id="category-filter"
            value={category ? category.slug : ''}
            onChange={(e) => navigate(e.target.value ? `/shop/${e.target.value}` : '/shop')}
            className="w-full sm:w-72 rounded-xl px-4 py-3 text-sm font-medium bg-[var(--cb-input-bg)] border border-[var(--cb-border-2)] text-[var(--cb-text)] focus:outline-none focus:border-[#C41E3A] transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category hero */}
      <div className="px-6 pt-10 pb-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center"
            style={{ background: 'rgba(196,30,58,0.12)', border: '1px solid rgba(196,30,58,0.2)' }}>
            <Icon size={22} color="#C41E3A" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase mb-3">
            {category ? category.tag : 'All Gear'}
          </p>
          <h1 className="font-display font-black text-[var(--cb-text)]" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            {category ? category.name : 'Every Discipline. One Shop.'}
          </h1>
          <p className="mt-4 text-[var(--cb-muted)] max-w-xl leading-relaxed">
            {category ? category.desc : 'Browse the full Combo Breaker catalog, or narrow it down with the filter above.'}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="px-6 pb-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.name}
              className="group rounded-2xl overflow-hidden border border-[var(--cb-border)] bg-[var(--cb-card)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#C41E3A]/50 hover:shadow-[0_20px_40px_rgba(196,30,58,0.2)]">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={product.img} alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="font-mono text-[9px] tracking-[0.2em] text-[#D4AF37] uppercase mb-2">{product.tag}</p>
                <h3 className="font-display font-bold text-lg mb-2 text-[var(--cb-text)]">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-mono text-[var(--cb-text)] font-semibold">{formatPrice(product.price)}</span>
                  <a href="/#contact"
                    className="flex items-center gap-1 text-[#C41E3A] text-sm font-semibold hover:text-[#D4AF37] transition-colors">
                    Inquire <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
