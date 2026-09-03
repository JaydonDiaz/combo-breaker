import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Zap } from 'lucide-react'
import { CATEGORIES, PRODUCTS_BY_CATEGORY } from '../lib/catalog.js'

function formatPrice(n) {
  return `$${n.toFixed(2).replace(/\.00$/, '')}`
}

export default function Shop() {
  const { discipline } = useParams()
  const category = CATEGORIES.find(c => c.slug === discipline) || CATEGORIES[0]
  const products = PRODUCTS_BY_CATEGORY[category.slug] || []
  const Icon = category.icon

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-body">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C41E3A, #9B1726)' }}>
              <Zap size={16} color="white" />
            </div>
            <span className="font-display font-bold text-white text-lg">Combo Breaker</span>
          </Link>
          <Link to="/" className="text-[#C41E3A] hover:text-[#D4AF37] transition-colors text-sm font-mono tracking-wider uppercase">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Category switcher */}
      <div className="px-6 pt-8">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <Link
              key={c.slug}
              to={`/shop/${c.slug}`}
              className="px-3 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-colors"
              style={c.slug === category.slug
                ? { background: 'rgba(196,30,58,0.15)', color: '#C41E3A', border: '1px solid rgba(196,30,58,0.4)' }
                : { background: 'rgba(255,255,255,0.05)', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {c.tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Category hero */}
      <div className="px-6 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center"
            style={{ background: 'rgba(196,30,58,0.12)', border: '1px solid rgba(196,30,58,0.2)' }}>
            <Icon size={22} color="#C41E3A" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase mb-3">{category.tag}</p>
          <h1 className="font-display font-black" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>{category.name}</h1>
          <p className="mt-4 text-gray-400 max-w-xl leading-relaxed">{category.desc}</p>
        </div>
      </div>

      {/* Products */}
      <div className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.name}
              className="group rounded-2xl overflow-hidden border border-white/10 bg-[#0F0F0F] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#C41E3A]/50 hover:shadow-[0_20px_40px_rgba(196,30,58,0.2)]">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={product.img} alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="font-mono text-[9px] tracking-[0.2em] text-[#D4AF37] uppercase mb-2">{category.tag}</p>
                <h3 className="font-display font-bold text-lg mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-mono text-white font-semibold">{formatPrice(product.price)}</span>
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
