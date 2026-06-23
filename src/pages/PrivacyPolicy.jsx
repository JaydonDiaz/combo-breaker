import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-6 py-16 font-body">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-[#C41E3A] hover:text-[#D4AF37] transition-colors text-sm font-mono tracking-wider uppercase mb-8 inline-block">
          ← Back to Combo Breaker
        </Link>
        <h1 className="font-display text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-8 text-sm">Last updated: June 2026</p>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>Combo Breaker ("we", "us", or "our") operates this website. This page informs you of our policies regarding the collection, use, and disclosure of personal information.</p>
          <h2 className="text-white font-display text-xl font-semibold pt-4">Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you fill out a contact form, place an order, or subscribe to communications. This may include your name, email address, phone number, and shipping address.</p>
          <h2 className="text-white font-display text-xl font-semibold pt-4">How We Use Your Information</h2>
          <p>We use the information we collect to process orders, respond to inquiries, send promotional communications (with your consent), and improve our services.</p>
          <h2 className="text-white font-display text-xl font-semibold pt-4">Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:info@combobreaker.com" className="text-[#C41E3A] hover:text-[#D4AF37] transition-colors">info@combobreaker.com</a>.</p>
        </div>
      </div>
    </div>
  )
}
