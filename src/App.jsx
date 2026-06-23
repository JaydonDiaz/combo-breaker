import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Target, Zap, Flame, Shield, Trophy, Package,
  ChevronRight, Menu, X, Upload, CheckCircle,
  Star, Award, Truck, RotateCcw, HeadphonesIcon,
  ArrowRight, Play
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Gear', href: '#features' },
  { label: 'Why Us', href: '#pillars' },
  { label: 'How It Works', href: '#protocol' },
  { label: 'Shop', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1546711076-85a7923432ab?auto=format&fit=crop&w=2400&q=80',
  'https://images.unsplash.com/photo-1611077479643-5b3c01381f9e?auto=format&fit=crop&w=2400&q=80',
  'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&w=2400&q=80',
  'https://images.unsplash.com/photo-1708134028754-5ba43093fedf?auto=format&fit=crop&w=2400&q=80',
  'https://images.unsplash.com/photo-1688141401462-d2ef7c292b0e?auto=format&fit=crop&w=2400&q=80',
]

const PRODUCTS = [
  { icon: Target, name: 'Boxing Arsenal', desc: 'Gloves, wraps, headgear & bags engineered for the sweet science', tag: 'BOXING' },
  { icon: Zap, name: 'MMA Combat Gear', desc: 'Shorts, rash guards, shin guards & submission gloves built cage-ready', tag: 'MMA' },
  { icon: Flame, name: 'Muay Thai Collection', desc: 'Authentic Thai shorts, shin pads, and clinch-grade heavy bags', tag: 'MUAY THAI' },
  { icon: Shield, name: 'BJJ & Grappling', desc: 'Premium gi, no-gi sets, spats, and mat-tested knee guards', tag: 'BJJ' },
  { icon: Trophy, name: 'Fight Apparel', desc: 'Compression wear, hoodies, and fight-day fit that performs at every level', tag: 'APPAREL' },
  { icon: Package, name: 'Training Essentials', desc: 'Jump ropes, resistance bands, mouth guards & recovery tools', tag: 'TRAINING' },
]

const PROTOCOL_STEPS = [
  {
    step: '01',
    title: 'Choose Your Discipline',
    desc: 'From first-timer to seasoned competitor — filter by sport, skill level, and weight class to find gear built for your fight.',
    img: 'https://images.unsplash.com/photo-1509563268879-5c990cda3b35?auto=format&fit=crop&w=1200&q=80',
  },
  {
    step: '02',
    title: 'Configure Your Kit',
    desc: 'Mix and match weights, sizes, and materials. Every product ships with a fit guarantee — wrong size, free exchange, no questions.',
    img: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    step: '03',
    title: 'Train. Compete. Repeat.',
    desc: 'Gear delivered in 2–3 days. Built to last thousands of rounds. When it wears out, your performance loyalty discount is already waiting.',
    img: 'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?auto=format&fit=crop&w=1200&q=80',
  },
]

const TRUST_SIGNALS = [
  { icon: Award, title: 'Pro-Grade Standards', desc: 'Every product tested by active competitors and coaches across all combat disciplines.' },
  { icon: Truck, title: '2–3 Day Delivery', desc: 'Fast domestic shipping on all orders. Free on everything over $75.' },
  { icon: RotateCcw, title: '30-Day Fight Guarantee', desc: 'Train in it, spar in it — if the fit or feel is wrong, we make it right.' },
]

const STRIKE_NAMES = ['JAB', 'CROSS', 'HOOK', 'UPPERCUT', 'BODY SHOT', 'SPINNING BACK FIST', 'TEEP']

// ─── FightStriker Signature Animation ────────────────────────────────────────

function FightStriker() {
  const [activeStrike, setActiveStrike] = useState(0)
  const [sparks, setSparks] = useState([])
  const intervalRef = useRef(null)
  const sparkIdRef = useRef(0)

  const SPARK_ANGLES = [-30, -15, 0, 15, 30, -45, 45]
  const SPARK_COLORS = ['#C41E3A', '#D4AF37', '#E53E52', '#F5D060', '#9B1726', '#FFE082', '#C41E3A']

  const triggerStrike = useCallback(() => {
    const newSparks = SPARK_ANGLES.map((angle, i) => ({
      id: ++sparkIdRef.current,
      angle,
      color: SPARK_COLORS[i],
      delay: i * 40,
    }))
    setSparks(newSparks)
    setTimeout(() => setSparks([]), 900)
    setActiveStrike(prev => (prev + 1) % STRIKE_NAMES.length)
  }, [])

  useEffect(() => {
    const t = setTimeout(triggerStrike, 800)
    intervalRef.current = setInterval(triggerStrike, 2200)
    return () => { clearTimeout(t); clearInterval(intervalRef.current) }
  }, [triggerStrike])

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#0A0A0A] rounded-2xl overflow-hidden">
      {/* Dark grid bg */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(196,30,58,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(196,30,58,0.3) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Corner glow */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #C41E3A 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Heavy bag SVG */}
        <div className="relative" style={{ animation: 'bag-sway 1.8s ease-in-out infinite' }}>
          {/* Chain */}
          <svg width="20" height="28" viewBox="0 0 20 28" className="mx-auto mb-0">
            <line x1="10" y1="0" x2="10" y2="28" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="10" cy="8" rx="5" ry="3" fill="none" stroke="#6B6B6B" strokeWidth="2" />
            <ellipse cx="10" cy="18" rx="5" ry="3" fill="none" stroke="#6B6B6B" strokeWidth="2" />
          </svg>
          {/* Bag body */}
          <div className="relative flex items-center">
            <svg width="88" height="140" viewBox="0 0 88 140">
              <defs>
                <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1A1A1A" />
                  <stop offset="40%" stopColor="#2A2A2A" />
                  <stop offset="100%" stopColor="#111111" />
                </linearGradient>
                <linearGradient id="bagStrap" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C41E3A" />
                  <stop offset="100%" stopColor="#9B1726" />
                </linearGradient>
              </defs>
              {/* Main bag */}
              <rect x="4" y="8" width="80" height="124" rx="18" fill="url(#bagGrad)" />
              {/* Shine */}
              <rect x="14" y="16" width="18" height="80" rx="9" fill="rgba(255,255,255,0.05)" />
              {/* Stitching lines */}
              <line x1="20" y1="8" x2="20" y2="132" stroke="#333" strokeWidth="1.5" />
              <line x1="68" y1="8" x2="68" y2="132" stroke="#333" strokeWidth="1.5" />
              {/* Red stripe bands */}
              <rect x="4" y="44" width="80" height="10" rx="2" fill="url(#bagStrap)" opacity="0.9" />
              <rect x="4" y="86" width="80" height="10" rx="2" fill="url(#bagStrap)" opacity="0.9" />
              {/* Logo text */}
              <text x="44" y="72" textAnchor="middle" fill="#C41E3A" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="2" opacity="0.7">CB</text>
              {/* Bottom cap */}
              <ellipse cx="44" cy="132" rx="36" ry="6" fill="#1A1A1A" />
            </svg>

            {/* Impact rings — right side of bag */}
            <div className="absolute" style={{ right: '-8px', top: '50%', transform: 'translateY(-50%)' }}>
              {sparks.length > 0 && [0, 1, 2].map(i => (
                <div key={`ring-${i}-${sparkIdRef.current}`}
                  className="absolute rounded-full border-2 border-[#C41E3A]"
                  style={{
                    width: 32 + i * 16,
                    height: 32 + i * 16,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: `impact-ring 0.6s ease-out ${i * 80}ms forwards`,
                    opacity: 0,
                  }}
                />
              ))}
            </div>

            {/* Sparks — shooting right */}
            <div className="absolute" style={{ right: '-12px', top: '50%', transform: 'translateY(-50%)' }}>
              {sparks.map(spark => (
                <div key={spark.id}
                  className="absolute"
                  style={{
                    width: '60px',
                    height: '3px',
                    top: '50%',
                    left: '0',
                    transformOrigin: 'left center',
                    transform: `rotate(${spark.angle}deg)`,
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '3px',
                      borderRadius: '2px',
                      background: `linear-gradient(90deg, ${spark.color}, transparent)`,
                      animation: `spark-shoot 0.55s ease-out ${spark.delay}ms forwards`,
                      transformOrigin: 'left center',
                      opacity: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strike name label */}
        <div className="h-8 flex items-center justify-center">
          <span key={activeStrike}
            className="font-mono text-xs tracking-[0.3em] uppercase"
            style={{
              color: '#D4AF37',
              animation: 'strike-label 2.2s ease-in-out forwards',
            }}
          >
            {STRIKE_NAMES[activeStrike]}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── ProductShuffler ──────────────────────────────────────────────────────────

function ProductShuffler() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveIdx(p => (p + 1) % PRODUCTS.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#0A0A0A] rounded-2xl overflow-hidden p-6">
      <div className="absolute inset-0 opacity-10 grid-bg" />
      <div className="relative w-full max-w-xs">
        {PRODUCTS.map((p, i) => {
          const offset = (i - activeIdx + PRODUCTS.length) % PRODUCTS.length
          const zIndex = PRODUCTS.length - offset
          const isTop = offset === 0
          const isSecond = offset === 1
          const isThird = offset === 2
          const Icon = p.icon

          return (
            <div key={p.name}
              className="absolute inset-0 flex flex-col gap-3 p-5 rounded-xl border transition-all duration-700"
              style={{
                transform: isTop ? 'scale(1) translateY(0)' : isSecond ? 'scale(0.95) translateY(12px)' : 'scale(0.90) translateY(24px)',
                opacity: isTop ? 1 : isSecond ? 0.6 : isThird ? 0.3 : 0,
                zIndex,
                background: isTop ? 'rgba(196,30,58,0.08)' : 'rgba(20,20,20,0.9)',
                borderColor: isTop ? 'rgba(196,30,58,0.4)' : 'rgba(255,255,255,0.06)',
                filter: isTop ? 'none' : `blur(${offset * 1.5}px)`,
                pointerEvents: isTop ? 'auto' : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(196,30,58,0.15)' }}>
                  <Icon size={20} color="#C41E3A" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase">{p.tag}</span>
              </div>
              <h3 className="font-display text-white font-bold text-lg leading-tight">{p.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              <button className="mt-auto flex items-center gap-2 text-[#C41E3A] text-sm font-semibold hover:text-[#D4AF37] transition-colors">
                Shop Now <ArrowRight size={14} />
              </button>
            </div>
          )
        })}

        {/* Spacer so container has height */}
        <div className="invisible p-5 rounded-xl flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg" />
            <span className="text-[10px]">tag</span>
          </div>
          <h3 className="font-display text-lg">placeholder</h3>
          <p className="text-sm">desc</p>
          <button className="mt-auto text-sm">shop</button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {PRODUCTS.map((_, i) => (
          <div key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === activeIdx ? '20px' : '6px',
              height: '6px',
              background: i === activeIdx ? '#C41E3A' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── CountUp ─────────────────────────────────────────────────────────────────

function CountUp({ target, suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) setStarted(true)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  return (
    <span ref={ref} style={{ animation: started ? 'count-up-pop 0.4s ease-out forwards' : 'none' }}>
      {val.toLocaleString()}{suffix}
    </span>
  )
}

// ─── ContactForm ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [status, setStatus] = useState('idle')
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', zip: '', message: '' })

  const handleSubmit = e => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 2000)
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {status === 'sent' ? (
        <div className="text-center py-16 space-y-4">
          <CheckCircle size={56} className="mx-auto text-[#C41E3A]" style={{ animation: 'count-up-pop 0.5s ease-out' }} />
          <h3 className="font-display text-2xl font-bold text-white">Message Received</h3>
          <p className="text-gray-400">Our team will reach out within 24 hours. Stay fight ready.</p>
          <button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', zip: '', message: '' }); setFile(null) }}
            className="mt-4 px-6 py-2 rounded-full border border-[#C41E3A] text-[#C41E3A] text-sm font-semibold hover:bg-[#C41E3A] hover:text-white transition-all">
            Send Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['name', 'Full Name'], ['email', 'Email Address'], ['phone', 'Phone Number'], ['zip', 'ZIP / Postal Code']].map(([k, label]) => (
              <div key={k} className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] tracking-[0.2em] text-gray-500 uppercase">{label}</label>
                <input
                  type={k === 'email' ? 'email' : 'text'}
                  required={k === 'name' || k === 'email'}
                  value={form[k]}
                  onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#C41E3A] transition-colors"
                  placeholder={label}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] tracking-[0.2em] text-gray-500 uppercase">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#C41E3A] transition-colors resize-none"
              placeholder="Tell us what you're training for, what gear you need, or any questions…"
            />
          </div>

          {/* File drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className="rounded-xl border-2 border-dashed transition-colors py-6 px-4 text-center cursor-pointer"
            style={{ borderColor: dragging ? '#C41E3A' : 'rgba(255,255,255,0.1)', background: dragging ? 'rgba(196,30,58,0.05)' : 'transparent' }}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input id="file-input" type="file" className="hidden" onChange={e => setFile(e.target.files[0])} accept=".jpg,.jpeg,.png,.pdf" />
            <Upload size={20} className="mx-auto mb-2 text-gray-500" />
            {file ? (
              <p className="text-sm text-[#D4AF37] font-mono">{file.name}</p>
            ) : (
              <p className="text-sm text-gray-500">Drop a photo or PDF, or <span className="text-[#C41E3A]">browse</span></p>
            )}
          </div>

          <button type="submit" disabled={status === 'sending'}
            className="magnetic-btn w-full py-4 rounded-full font-display font-bold text-white text-base tracking-wide transition-all"
            style={{ background: status === 'sending' ? '#6B6B6B' : 'linear-gradient(135deg, #C41E3A 0%, #9B1726 100%)' }}>
            {status === 'sending' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Sending…
              </span>
            ) : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const heroRef = useRef(null)
  const heroContentRef = useRef(null)
  const pillarsRef = useRef(null)
  const protocolRef = useRef(null)

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hero image rotation
  useEffect(() => {
    const t = setInterval(() => setActiveImg(p => (p + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  // GSAP hero entrance
  useEffect(() => {
    if (!heroContentRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-stagger', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.3,
      })
    }, heroContentRef)
    return () => ctx.revert()
  }, [])

  // GSAP protocol sticky stack
  useEffect(() => {
    if (!protocolRef.current) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card')
      cards.forEach((card, i) => {
        if (i === 0) return
        gsap.fromTo(card, { y: 60, scale: 0.96, opacity: 0 }, {
          y: 0, scale: 1, opacity: 1,
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            end: 'top 40%',
            scrub: 1,
          },
        })
      })
    }, protocolRef)
    return () => ctx.revert()
  }, [])

  // GSAP features + trust fade-in
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.fade-up').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  const scrollTo = href => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] font-body overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav className="w-full max-w-6xl px-6 py-3 rounded-2xl flex items-center justify-between transition-all duration-500"
          style={{
            background: scrolled ? 'rgba(10,10,10,0.85)' : 'rgba(10,10,10,0.5)',
            backdropFilter: 'blur(16px)',
            border: scrolled ? '1px solid rgba(196,30,58,0.25)' : '1px solid rgba(255,255,255,0.08)',
          }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C41E3A, #9B1726)' }}>
              <Zap size={16} color="white" />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">Combo Breaker</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <button key={l.label} onClick={() => scrollTo(l.href)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white font-medium rounded-xl hover:bg-white/8 transition-all">
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => scrollTo('#contact')}
              className="hidden md:flex magnetic-btn items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #C41E3A, #9B1726)' }}>
              Get Geared Up <ArrowRight size={14} />
            </button>
            <button onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 text-white" aria-label="Toggle menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col pt-24 px-6 pb-8"
          style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)' }}>
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map(l => (
              <button key={l.label} onClick={() => scrollTo(l.href)}
                className="text-left py-4 px-4 rounded-xl text-white font-display font-semibold text-2xl hover:bg-white/5 transition-colors border-b border-white/5">
                {l.label}
              </button>
            ))}
          </div>
          <button onClick={() => scrollTo('#contact')}
            className="mt-auto w-full py-4 rounded-2xl font-display font-bold text-white text-lg"
            style={{ background: 'linear-gradient(135deg, #C41E3A, #9B1726)' }}>
            Get Geared Up
          </button>
        </div>
      )}

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} id="hero" className="relative min-h-dvh flex items-center justify-center overflow-hidden">
        {/* Background images — crossfade */}
        {HERO_IMAGES.map((src, i) => (
          <img key={src} src={src} alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === activeImg ? 1 : 0,
              transition: 'opacity 1.4s ease-in-out',
              zIndex: 0,
            }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.8) 100%)' }} />

        {/* Red vignette accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 z-[1]"
          style={{ background: 'linear-gradient(to top, rgba(196,30,58,0.2), transparent)' }} />

        {/* Content */}
        <div ref={heroContentRef} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="hero-stagger inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border"
            style={{ background: 'rgba(196,30,58,0.15)', borderColor: 'rgba(196,30,58,0.4)' }}>
            <div className="w-2 h-2 rounded-full bg-[#C41E3A] ring-pulse" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase">Premium Combat Sports Gear</span>
          </div>

          <h1 className="hero-stagger font-display font-black text-white leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(3.2rem, 10vw, 7.5rem)', letterSpacing: '-0.03em' }}>
            Fight Ready.<br />
            <span className="gradient-text">Always.</span>
          </h1>

          <p className="hero-stagger font-body text-gray-200 max-w-xl mx-auto leading-relaxed mb-10"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
            Premium gear engineered for <span className="text-[#D4AF37]">every discipline</span> — Boxing, MMA, Muay Thai, BJJ, and beyond. Built to take punishment. Built to give it.
          </p>

          <div className="hero-stagger flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => scrollTo('#services')}
              className="magnetic-btn flex items-center gap-2 px-8 py-4 rounded-2xl font-display font-bold text-white text-base"
              style={{ background: 'linear-gradient(135deg, #C41E3A, #9B1726)' }}>
              Shop All Gear <ArrowRight size={18} />
            </button>
            <button onClick={() => scrollTo('#protocol')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-display font-semibold text-white text-base border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
              <Play size={16} /> See How It Works
            </button>
          </div>

          {/* Discipline pills */}
          <div className="hero-stagger flex flex-wrap justify-center gap-2 mt-10">
            {['Boxing', 'MMA', 'Muay Thai', 'BJJ', 'Wrestling', 'Kickboxing'].map(d => (
              <span key={d} className="px-3 py-1 rounded-full text-xs font-mono tracking-wider text-gray-300"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-up">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#C41E3A] uppercase mb-3">What We Offer</p>
            <h2 className="font-display font-black text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Gear Built to <span className="gradient-text">Dominate</span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto leading-relaxed">Every product designed with active fighters. Every material tested in training. Zero compromises.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Card 1 — Product Shuffler */}
            <div className="fade-up lg:col-span-1 rounded-2xl overflow-hidden" style={{ height: '420px' }}>
              <ProductShuffler />
            </div>

            {/* Card 2 — FightStriker signature animation */}
            <div className="fade-up rounded-2xl overflow-hidden" style={{ height: '420px' }}>
              <FightStriker />
            </div>

            {/* Card 3 — Free shipping calculator */}
            <div className="fade-up rounded-2xl bg-[#0F0F0F] border border-white/8 p-7 flex flex-col justify-between" style={{ height: '420px' }}>
              <div>
                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.15)' }}>
                  <Truck size={20} color="#D4AF37" />
                </div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase mb-2">Free Shipping</p>
                <h3 className="font-display text-white font-bold text-2xl mb-3">Zero friction to your door</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Every order over $75 ships free. Under $75? Flat $7.99. Track your gear from warehouse to gym.</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Standard (3–5 days)', price: 'Free over $75' },
                  { label: 'Express (1–2 days)', price: '$12.99' },
                  { label: 'Fight Day Rush', price: '$24.99' },
                ].map(opt => (
                  <div key={opt.label} className="flex items-center justify-between py-3 px-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-gray-300 text-sm">{opt.label}</span>
                    <span className="font-mono text-[#D4AF37] text-sm font-semibold">{opt.price}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3 rounded-xl font-display font-bold text-sm transition-all"
                style={{ background: 'rgba(196,30,58,0.15)', color: '#C41E3A', border: '1px solid rgba(196,30,58,0.3)' }}>
                Questions? Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ────────────────────────────────────────────────────────── */}
      <section ref={pillarsRef} id="pillars" className="py-24 px-6 bg-[#F8F8F8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-up">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#C41E3A] uppercase mb-3">By The Numbers</p>
            <h2 className="font-display font-black text-[#0A0A0A]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Trusted By <span className="gradient-text">Fighters</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { stat: 12000, suffix: '+', label: 'Active Fighters Equipped', sub: 'Across 40+ countries worldwide' },
              { stat: 98, suffix: '%', label: 'Satisfaction Rate', sub: 'Based on verified purchase reviews' },
              { stat: 50000, suffix: '+', label: 'Orders Delivered', sub: 'Since 2019, zero inventory delays' },
            ].map((item, i) => (
              <div key={i} className="fade-up text-center p-10 rounded-3xl bg-white shadow-sm border border-[#E5E5E5] hover:shadow-md transition-shadow">
                <div className="font-display font-black text-[#C41E3A] mb-2"
                  style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', lineHeight: 1 }}>
                  <CountUp target={item.stat} suffix={item.suffix} />
                </div>
                <div className="font-display font-bold text-[#0A0A0A] text-lg mb-1">{item.label}</div>
                <div className="font-mono text-[10px] tracking-[0.15em] text-gray-500 uppercase">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Protocol ───────────────────────────────────────────────────────── */}
      <section ref={protocolRef} id="protocol" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-up">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#C41E3A] uppercase mb-3">The Process</p>
            <h2 className="font-display font-black text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Three Steps to <span className="gradient-text">Fight Ready</span>
            </h2>
          </div>

          <div className="space-y-6">
            {PROTOCOL_STEPS.map((step, i) => (
              <div key={step.step}
                className="protocol-card rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border"
                style={{ background: 'rgba(20,20,20,0.9)', borderColor: 'rgba(196,30,58,0.15)' }}>
                <div className="p-10 flex flex-col justify-center">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-[#C41E3A] uppercase mb-3">Step {step.step}</span>
                  <h3 className="font-display text-white font-black text-3xl mb-4 leading-tight">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">{step.desc}</p>
                  <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-semibold">
                    <div className="w-8 h-px bg-[#D4AF37]" />
                    Step {i + 1} of {PROTOCOL_STEPS.length}
                  </div>
                </div>
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img src={step.img} alt={step.title}
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.8) contrast(1.1)' }} />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.4), transparent)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ──────────────────────────────────────────────────── */}
      <section id="services" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-up">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#C41E3A] uppercase mb-3">Shop By Category</p>
            <h2 className="font-display font-black text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Find Your <span className="gradient-text">Category</span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto leading-relaxed">Every discipline. Every skill level. Gear engineered for the way you fight.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden">
            {PRODUCTS.map((product, i) => {
              const Icon = product.icon
              return (
                <div key={product.name}
                  className="group relative bg-[#0A0A0A] p-8 cursor-pointer transition-all duration-300 hover:bg-[#141414] fade-up">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, rgba(196,30,58,0.06), transparent)' }} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ background: 'rgba(196,30,58,0.12)', border: '1px solid rgba(196,30,58,0.2)' }}>
                      <Icon size={22} color="#C41E3A" />
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.25em] text-[#D4AF37] uppercase mb-2">{product.tag}</div>
                    <h3 className="font-display text-white font-bold text-xl mb-2 leading-tight">{product.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{product.desc}</p>
                    <div className="flex items-center gap-2 text-[#C41E3A] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Trust Signals ──────────────────────────────────────────────────── */}
      <section id="trust" className="py-24 px-6 bg-[#F8F8F8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 fade-up">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#C41E3A] uppercase mb-3">Our Commitment</p>
            <h2 className="font-display font-black text-[#0A0A0A]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Why Fighters <span className="gradient-text">Choose Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRUST_SIGNALS.map((t, i) => {
              const Icon = t.icon
              return (
                <div key={t.title} className="fade-up p-8 rounded-3xl bg-white border border-[#E5E5E5] hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center"
                    style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.15)' }}>
                    <Icon size={22} color="#C41E3A" />
                  </div>
                  <h3 className="font-display font-bold text-[#0A0A0A] text-xl mb-3">{t.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{t.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Social proof row */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 fade-up">
            {[
              '"Best gloves I\'ve used in 8 years of boxing." — Marcus T., Amateur Champion',
              '"Shipped overnight before my regional. Absolute legends." — Priya R., MMA Fighter',
              '"My whole gym orders from Combo Breaker now." — Coach D., NYC Fight Club',
            ].map((q, i) => (
              <div key={i} className="max-w-sm p-6 rounded-2xl bg-white border border-[#E5E5E5]">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#D4AF37" color="#D4AF37" />)}
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="fade-up">
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#C41E3A] uppercase mb-3">Get In Touch</p>
              <h2 className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.05 }}>
                Talk to a Gear<br /><span className="gradient-text">Expert</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
                Not sure what gear fits your style? Training for a competition? Our team of active fighters is here to help you build the perfect kit.
              </p>

              <div className="space-y-4">
                {[
                  { label: 'Email', val: 'info@combobreaker.com' },
                  { label: 'Phone', val: '(888) 726-6263' },
                  { label: 'Hours', val: 'Mon–Fri 9am–6pm ET' },
                ].map(item => (
                  <div key={item.label} className="flex gap-4 items-center">
                    <span className="font-mono text-[9px] tracking-[0.2em] text-[#D4AF37] uppercase w-12 shrink-0">{item.label}</span>
                    <span className="text-gray-300 text-sm">{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 rounded-2xl"
                style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
                <p className="font-mono text-[10px] tracking-[0.2em] text-[#C41E3A] uppercase mb-1">Team Orders & Bulk</p>
                <p className="text-gray-400 text-sm leading-relaxed">Outfitting a gym or a team? Ask about bulk pricing and custom branding on gloves, shorts, and apparel.</p>
              </div>
            </div>

            <div className="fade-up">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#050505] border-t border-white/5 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #C41E3A, #9B1726)' }}>
                  <Zap size={16} color="white" />
                </div>
                <span className="font-display font-bold text-white text-lg">Combo Breaker</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-5">
                Premium combat sports gear and apparel. Built by fighters, for fighters — across every discipline.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C41E3A] ring-pulse" />
                <span className="font-mono text-[10px] tracking-[0.15em] text-gray-500 uppercase">Shipping Daily</span>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-500 uppercase mb-4">Shop</h4>
              <ul className="space-y-2.5">
                {PRODUCTS.map(p => (
                  <li key={p.name}>
                    <button onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-gray-400 text-sm hover:text-white transition-colors">{p.name}</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-mono text-[10px] tracking-[0.2em] text-gray-500 uppercase mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'About', href: '#' },
                  { label: 'Careers', href: '#' },
                  { label: 'Blog', href: '#' },
                  { label: 'Press', href: '#' },
                  { label: 'Contact', href: '#contact' },
                ].map(l => (
                  <li key={l.label}>
                    <button onClick={() => l.href.startsWith('#') ? document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' }) : null}
                      className="text-gray-400 text-sm hover:text-white transition-colors">{l.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-xs font-mono">© {new Date().getFullYear()} Combo Breaker. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-gray-600 hover:text-gray-300 text-xs font-mono transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-600 hover:text-gray-300 text-xs font-mono transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
