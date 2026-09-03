import { Target, Zap, Flame, Shield, Trophy, Package } from 'lucide-react'

export const CATEGORIES = [
  {
    slug: 'boxing',
    icon: Target,
    name: 'Boxing Arsenal',
    tag: 'BOXING',
    desc: 'Gloves, wraps, headgear & bags engineered for the sweet science',
  },
  {
    slug: 'mma',
    icon: Zap,
    name: 'MMA Combat Gear',
    tag: 'MMA',
    desc: 'Shorts, rash guards, shin guards & submission gloves built cage-ready',
  },
  {
    slug: 'muay-thai',
    icon: Flame,
    name: 'Muay Thai Collection',
    tag: 'MUAY THAI',
    desc: 'Authentic Thai shorts, shin pads, and clinch-grade heavy bags',
  },
  {
    slug: 'bjj',
    icon: Shield,
    name: 'BJJ & Grappling',
    tag: 'BJJ',
    desc: 'Premium gi, no-gi sets, spats, and mat-tested knee guards',
  },
  {
    slug: 'apparel',
    icon: Trophy,
    name: 'Fight Apparel',
    tag: 'APPAREL',
    desc: 'Compression wear, hoodies, and fight-day fit that performs at every level',
  },
  {
    slug: 'training',
    icon: Package,
    name: 'Training Essentials',
    tag: 'TRAINING',
    desc: 'Jump ropes, resistance bands, mouth guards & recovery tools',
  },
]

export const PRODUCTS_BY_CATEGORY = {
  boxing: [
    { name: 'Pro Sparring Gloves', price: 89, img: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Fight Night Gloves', price: 94, img: 'https://images.unsplash.com/photo-1622599518895-be813cc42628?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Hand Wrap Set', price: 14, img: 'https://images.unsplash.com/photo-1770734265410-0c686b750f0f?auto=format&fit=crop&w=1200&q=80' },
  ],
  mma: [
    { name: 'Cage Fighter Shorts', price: 54, img: 'https://images.unsplash.com/photo-1785441309938-c7ab7e58b9ad?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Contact Training Gloves', price: 69, img: 'https://images.unsplash.com/photo-1642267308245-6f490209f81e?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Focus Mitts (Pair)', price: 59, img: 'https://images.unsplash.com/photo-1622599504752-14e0a7eba919?auto=format&fit=crop&w=1200&q=80' },
  ],
  'muay-thai': [
    { name: 'Authentic Thai Shorts', price: 49, img: 'https://images.unsplash.com/photo-1525680996651-0222228be6f0?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Fight Camp Kit', price: 129, img: 'https://images.unsplash.com/photo-1565852841746-79286ef8fa0a?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Thai Pads (Pair)', price: 79, img: 'https://images.unsplash.com/photo-1711825051967-f8ba8c0845e7?auto=format&fit=crop&w=1200&q=80' },
  ],
  bjj: [
    { name: 'Competition BJJ Gi', price: 139, img: 'https://images.unsplash.com/photo-1542937307-e90d0cc07237?auto=format&fit=crop&w=1200&q=80' },
    { name: 'No-Gi Grappling Spats', price: 59, img: 'https://images.unsplash.com/photo-1764908912174-cf465d433f0f?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Rank Belt (All Sizes)', price: 24, img: 'https://images.unsplash.com/photo-1525198104776-f6e8a873f9b7?auto=format&fit=crop&w=1200&q=80' },
  ],
  apparel: [
    { name: 'Fight Camp Hoodie', price: 64, img: 'https://images.unsplash.com/photo-1737381508529-a110d717d5a7?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Performance Zip Hoodie', price: 69, img: 'https://images.unsplash.com/photo-1748484340841-fbbae8fea41b?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Compression Tank', price: 34, img: 'https://images.unsplash.com/photo-1606889463862-a8fc57a706ce?auto=format&fit=crop&w=1200&q=80' },
  ],
  training: [
    { name: 'Speed Jump Rope', price: 19, img: 'https://images.unsplash.com/photo-1514994667787-b48ca37155f0?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Weightlifting Belt', price: 44, img: 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Adjustable Dumbbell Set', price: 149, img: 'https://images.unsplash.com/photo-1598268030450-7a476f602bf6?auto=format&fit=crop&w=1200&q=80' },
  ],
}
