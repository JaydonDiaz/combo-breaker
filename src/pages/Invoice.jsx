import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function formatDate(iso) {
  if (!iso) return '—'
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function generateInvoiceNumber() {
  const now = new Date()
  const seq = String(now.getMonth() * 31 + now.getDate()).padStart(3, '0')
  return `CB-${now.getFullYear()}-${seq}`
}

function computeTotals(items, taxRate) {
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const taxAmount = subtotal * (taxRate / 100)
  return { subtotal, taxAmount, total: subtotal + taxAmount }
}

const TODAY = new Date().toISOString().split('T')[0]
const IN_30 = new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0]
const BLANK_ITEM = { description: '', quantity: 1, unitPrice: 0 }

const COMMON_ITEMS = [
  'Boxing Gloves — 16oz',
  'MMA Shorts',
  'Muay Thai Shin Guards',
  'BJJ Gi — Adult A2',
  'Heavy Bag — 100lb',
  'Hand Wraps — 180" (2-pack)',
  'Rash Guard — Long Sleeve',
  'Mouthguard — Pro Series',
  'Jump Rope — Speed Cable',
  'Team Order — Custom Apparel',
  'Gym Equipment Bundle',
  'Fight Day Kit',
]

const PRINT_STYLES = `
@media print {
  body * { visibility: hidden !important; }
  #invoice-print, #invoice-print * { visibility: visible !important; }
  #invoice-print { position: fixed !important; inset: 0 !important; background: white !important; padding: 2rem !important; }
  .no-print { display: none !important; }
}
`

// ── Sub-components ────────────────────────────────────────────────────────────

function Label({ children }) {
  return (
    <label className="block text-xs font-semibold tracking-widest uppercase text-[#D4AF37] mb-1.5">
      {children}
    </label>
  )
}

function Field({ className = '', ...props }) {
  return (
    <input
      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#C41E3A] transition-colors ${className}`}
      {...props}
    />
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#0F0F0F] border border-white/8 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ n, label }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
        style={{ background: 'linear-gradient(135deg, #C41E3A, #9B1726)' }}>
        {n}
      </span>
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</h2>
    </div>
  )
}

function SuccessScreen({ invoiceNumber, clientName, total, onReset, onPrint }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ background: 'rgba(196,30,58,0.15)' }}>
        <svg className="w-8 h-8 text-[#C41E3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Invoice Ready</h2>
      <p className="text-gray-400 text-sm mb-1">
        Invoice <span className="font-semibold text-white font-mono">{invoiceNumber}</span> for
      </p>
      <p className="font-semibold mb-1" style={{ color: '#D4AF37' }}>{clientName}</p>
      <p className="text-gray-500 text-xs mb-8">Total: <span className="text-white font-semibold">{formatCurrency(total)}</span></p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button onClick={onPrint}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all"
          style={{ background: 'linear-gradient(135deg, #C41E3A, #9B1726)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save PDF
        </button>
        <button onClick={onReset}
          className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors">
          New Invoice
        </button>
      </div>
    </div>
  )
}

// ── Printable invoice layout ───────────────────────────────────────────────

function PrintView({ data }) {
  const { clientName, clientEmail, clientAddress, invoiceNumber, invoiceDate, dueDate, items, taxRate, notes, subtotal, taxAmount, total } = data
  return (
    <div id="invoice-print" className="hidden bg-white text-gray-900 p-10 font-sans">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="text-2xl font-black tracking-tight mb-1" style={{ color: '#C41E3A' }}>Combo Breaker</div>
          <div className="text-xs text-gray-400 tracking-widest uppercase">Fight Ready. Always.</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800 mb-1">INVOICE</div>
          <div className="font-mono text-sm text-gray-500">{invoiceNumber}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 border-t border-b border-gray-100 py-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Bill To</div>
          <div className="font-semibold text-gray-800">{clientName}</div>
          <div className="text-gray-500 text-sm">{clientEmail}</div>
          {clientAddress && <div className="text-gray-500 text-sm mt-1">{clientAddress}</div>}
        </div>
        <div className="text-right">
          <div className="flex justify-end gap-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Invoice Date</div>
              <div className="text-sm text-gray-700">{formatDate(invoiceDate)}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Due Date</div>
              <div className="text-sm text-gray-700">{formatDate(dueDate)}</div>
            </div>
          </div>
        </div>
      </div>

      <table className="w-full mb-6 text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 text-xs font-bold uppercase tracking-widest text-gray-400 pb-3">Description</th>
            <th className="text-center py-2 text-xs font-bold uppercase tracking-widest text-gray-400 pb-3 w-16">Qty</th>
            <th className="text-right py-2 text-xs font-bold uppercase tracking-widest text-gray-400 pb-3 w-28">Unit Price</th>
            <th className="text-right py-2 text-xs font-bold uppercase tracking-widest text-gray-400 pb-3 w-28">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-gray-50">
              <td className="py-3 text-gray-700">{item.description}</td>
              <td className="py-3 text-center text-gray-600">{item.quantity}</td>
              <td className="py-3 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
              <td className="py-3 text-right font-medium text-gray-800">{formatCurrency(item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-56 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax ({taxRate}%)</span><span>{formatCurrency(taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-gray-200 pt-2 text-base" style={{ color: '#C41E3A' }}>
            <span>Total Due</span><span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {notes && (
        <div className="border-t border-gray-100 pt-6">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Notes</div>
          <p className="text-sm text-gray-600 leading-relaxed">{notes}</p>
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Invoice() {
  const [clientName,    setClientName]    = useState('')
  const [clientEmail,   setClientEmail]   = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber)
  const [invoiceDate,   setInvoiceDate]   = useState(TODAY)
  const [dueDate,       setDueDate]       = useState(IN_30)
  const [items,         setItems]         = useState([{ ...BLANK_ITEM }])
  const [taxRate,       setTaxRate]       = useState(0)
  const [notes,         setNotes]         = useState('Payment due within 30 days. Thank you for choosing Combo Breaker.')
  const [status,        setStatus]        = useState('idle')
  const [submitted,     setSubmitted]     = useState(null)

  const updateItem = useCallback((idx, field, value) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }, [])
  const addItem    = () => setItems(prev => [...prev, { ...BLANK_ITEM }])
  const removeItem = idx => setItems(prev => prev.filter((_, i) => i !== idx))

  const { subtotal, taxAmount, total } = computeTotals(items, taxRate)

  const handleSubmit = e => {
    e.preventDefault()
    const data = { clientName, clientEmail, clientAddress, invoiceNumber, invoiceDate, dueDate, items, taxRate, notes, subtotal, taxAmount, total }
    setSubmitted(data)
    setStatus('done')
  }

  const reset = () => {
    setClientName(''); setClientEmail(''); setClientAddress('')
    setInvoiceNumber(generateInvoiceNumber())
    setInvoiceDate(TODAY); setDueDate(IN_30)
    setItems([{ ...BLANK_ITEM }]); setTaxRate(0)
    setNotes('Payment due within 30 days. Thank you for choosing Combo Breaker.')
    setStatus('idle'); setSubmitted(null)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{PRINT_STYLES}</style>
      {submitted && <PrintView data={submitted} />}

      {/* Top bar */}
      <header className="no-print border-b border-white/8 px-6 py-4 flex items-center justify-between bg-[#0A0A0A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C41E3A, #9B1726)' }}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm text-white tracking-wide" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>COMBO BREAKER</p>
            <p className="text-[10px] tracking-widest uppercase" style={{ color: '#D4AF37' }}>Invoice Tool</p>
          </div>
        </div>
        <Link to="/" className="text-gray-500 hover:text-gray-300 text-xs font-mono transition-colors">
          ← Back to site
        </Link>
      </header>

      <div className="no-print max-w-3xl mx-auto px-4 py-8">
        {status === 'done' && submitted ? (
          <SuccessScreen
            invoiceNumber={submitted.invoiceNumber}
            clientName={submitted.clientName}
            total={submitted.total}
            onReset={reset}
            onPrint={() => window.print()}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Client Info */}
            <Card>
              <SectionHeader n={1} label="Client Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Client Name *</Label>
                  <Field required value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Alex Johnson" />
                </div>
                <div>
                  <Label>Client Email *</Label>
                  <Field type="email" required value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@email.com" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Client Address</Label>
                  <Field value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder="456 Fighter's Row, Las Vegas, NV 89101" />
                </div>
              </div>
            </Card>

            {/* Invoice Details */}
            <Card>
              <SectionHeader n={2} label="Invoice Details" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Invoice Number *</Label>
                  <Field required value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="font-mono" />
                </div>
                <div>
                  <Label>Invoice Date *</Label>
                  <Field type="date" required value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                </div>
                <div>
                  <Label>Due Date *</Label>
                  <Field type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
              </div>
            </Card>

            {/* Line Items */}
            <Card>
              <SectionHeader n={3} label="Products / Services" />
              <div className="hidden sm:grid grid-cols-[1fr_72px_100px_80px_28px] gap-3 px-1 mb-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600">Description</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600 text-center">Qty</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600 text-right">Unit Price</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600 text-right">Total</span>
                <span />
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_72px_100px_80px_28px] gap-2 sm:gap-3 items-center">
                    <div>
                      <input list="cb-items" required value={item.description}
                        onChange={e => updateItem(idx, 'description', e.target.value)}
                        placeholder="Product or service"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#C41E3A] transition-colors" />
                    </div>
                    <input type="number" min="0.01" step="0.01" required value={item.quantity}
                      onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm text-center focus:outline-none focus:border-[#C41E3A] transition-colors" />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">$</span>
                      <input type="number" min="0" step="0.01" required value={item.unitPrice}
                        onChange={e => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-6 pr-3 py-3 text-white text-sm text-right focus:outline-none focus:border-[#C41E3A] transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-right text-gray-300 sm:pr-1">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </span>
                    <button type="button" onClick={() => removeItem(idx)} disabled={items.length === 1}
                      className="text-gray-600 hover:text-red-400 transition-colors text-lg font-bold disabled:opacity-20 text-center">
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <datalist id="cb-items">
                {COMMON_ITEMS.map(s => <option key={s} value={s} />)}
              </datalist>

              <button type="button" onClick={addItem}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                style={{ color: '#C41E3A' }}
                onMouseOver={e => e.currentTarget.style.color = '#D4AF37'}
                onMouseOut={e => e.currentTarget.style.color = '#C41E3A'}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add line item
              </button>
            </Card>

            {/* Totals + Tax */}
            <Card>
              <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
                <div className="sm:w-44">
                  <Label>Tax Rate (%)</Label>
                  <div className="relative">
                    <input type="number" min="0" max="100" step="0.1" value={taxRate}
                      onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pr-8 py-3 text-white text-sm text-right focus:outline-none focus:border-[#C41E3A] transition-colors" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">%</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2 border-t sm:border-t-0 sm:border-l border-white/8 pt-4 sm:pt-0 sm:pl-6">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-gray-200 font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  {taxRate > 0 && (
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Tax ({taxRate}%)</span>
                      <span className="text-gray-200 font-medium">{formatCurrency(taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold border-t border-white/8 pt-2 text-base" style={{ color: '#D4AF37' }}>
                    <span>Total Due</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notes */}
            <Card>
              <SectionHeader n={4} label="Notes & Terms" />
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#C41E3A] transition-colors resize-none"
                placeholder="Payment terms, order notes, or additional information..." />
            </Card>

            {/* Preview strip */}
            <div className="rounded-xl p-4 text-xs text-gray-400 leading-relaxed"
              style={{ background: 'rgba(196,30,58,0.06)', border: '1px solid rgba(196,30,58,0.2)' }}>
              <span className="font-semibold" style={{ color: '#C41E3A' }}>Preview — </span>
              Invoice <span className="font-mono font-medium text-white">{invoiceNumber}</span> for{' '}
              <span className="font-medium text-white">{clientName || '—'}</span> ·{' '}
              Due {formatDate(dueDate)} ·{' '}
              Total <span className="font-semibold" style={{ color: '#D4AF37' }}>{formatCurrency(total)}</span>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-2 pb-10">
              <span className="text-xs text-gray-600">Invoice will be ready to print or save as PDF</span>
              <button type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #C41E3A, #9B1726)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Invoice
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}
