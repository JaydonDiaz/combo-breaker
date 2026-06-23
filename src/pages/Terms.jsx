import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-6 py-16 font-body">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-[#C41E3A] hover:text-[#D4AF37] transition-colors text-sm font-mono tracking-wider uppercase mb-8 inline-block">
          ← Back to Combo Breaker
        </Link>
        <h1 className="font-display text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-8 text-sm">Last updated: June 2026</p>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>By accessing and using the Combo Breaker website, you accept and agree to be bound by these Terms of Service.</p>
          <h2 className="text-white font-display text-xl font-semibold pt-4">Use of Site</h2>
          <p>This website is for informational and commercial purposes related to Combo Breaker's combat sports gear and apparel. You agree not to misuse the site or attempt to access it using methods other than the interface provided.</p>
          <h2 className="text-white font-display text-xl font-semibold pt-4">Products & Orders</h2>
          <p>All product descriptions, prices, and availability are subject to change without notice. We reserve the right to cancel any order for any reason, including product unavailability or suspected fraudulent activity.</p>
          <h2 className="text-white font-display text-xl font-semibold pt-4">Returns & Refunds</h2>
          <p>Items may be returned within 30 days of purchase in original, unworn condition. Contact us to initiate a return. Customized or personalized items are final sale.</p>
          <h2 className="text-white font-display text-xl font-semibold pt-4">Contact Us</h2>
          <p>Questions about these terms? Reach us at <a href="mailto:info@combobreaker.com" className="text-[#C41E3A] hover:text-[#D4AF37] transition-colors">info@combobreaker.com</a>.</p>
        </div>
      </div>
    </div>
  )
}
