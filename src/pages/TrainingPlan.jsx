import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function computeEndDate(startDate, durationWeeks) {
  if (!startDate || !durationWeeks) return ''
  const [y, m, d] = startDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + durationWeeks * 7)
  return date.toISOString().split('T')[0]
}

function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

const TODAY = new Date().toISOString().split('T')[0]

const DISCIPLINES = [
  'Boxing', 'MMA', 'Muay Thai', 'BJJ', 'Wrestling',
  'Strength & Conditioning', 'Cardio', 'Nutrition',
]

const SESSION_DURATIONS = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' },
  { value: 90, label: '90 min' },
  { value: 120, label: '2 hrs' },
]

const COMMON_SERVICES = [
  'Personal Training Sessions',
  'Group Training Sessions',
  'Sparring Sessions',
  'Nutrition Planning',
  'Video Analysis & Feedback',
  'Progress Assessments',
  'Equipment Package',
  'Recovery & Mobility Sessions',
  'Online Support & Check-ins',
  'Custom Fight Camp',
]

function Label({ children }) {
  return (
    <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5"
      style={{ color: '#D4AF37' }}>
      {children}
    </label>
  )
}

function Field({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors ${className}`}
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      onFocus={e => (e.currentTarget.style.borderColor = '#C41E3A')}
      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
      {...props}
    />
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl p-6 ${className}`}
      style={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.08)' }}>
      {children}
    </div>
  )
}

function SectionHeader({ n, label }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
        style={{ background: 'linear-gradient(135deg,#C41E3A,#9B1726)' }}>
        {n}
      </span>
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</h2>
    </div>
  )
}

function SuccessScreen({ programName, clientEmail, total, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ background: 'rgba(196,30,58,0.15)' }}>
        <svg className="w-8 h-8" style={{ color: '#C41E3A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Program Sent!</h2>
      <p className="text-gray-400 text-sm mb-1">
        <span className="font-semibold text-white">{programName}</span> was emailed to
      </p>
      <p className="font-semibold mb-1" style={{ color: '#D4AF37' }}>{clientEmail}</p>
      <p className="text-gray-500 text-xs mb-8">
        Total Investment: <span className="text-white font-semibold">{formatCurrency(total)}</span>
      </p>
      <button onClick={onReset}
        className="px-6 py-3 rounded-xl text-white font-semibold text-sm"
        style={{ background: 'linear-gradient(135deg,#C41E3A,#9B1726)' }}>
        Create Another Program
      </button>
    </div>
  )
}

export default function TrainingPlan() {
  const [clientName,      setClientName]      = useState('')
  const [clientEmail,     setClientEmail]     = useState('')
  const [programName,     setProgramName]     = useState('')
  const [startDate,       setStartDate]       = useState(TODAY)
  const [durationWeeks,   setDurationWeeks]   = useState(8)
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3)
  const [sessionMinutes,  setSessionMinutes]  = useState(60)
  const [disciplines,     setDisciplines]     = useState(['Boxing'])
  const [services,        setServices]        = useState([{ description: '', price: 0 }])
  const [notes,           setNotes]           = useState('')
  const [status,          setStatus]          = useState('idle')
  const [errorMsg,        setErrorMsg]        = useState('')
  const [submitted,       setSubmitted]       = useState(null)

  const toggleDiscipline = (d) => {
    setDisciplines(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  const updateService = useCallback((idx, field, value) => {
    setServices(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }, [])

  const addService    = () => setServices(prev => [...prev, { description: '', price: 0 }])
  const removeService = (idx) => setServices(prev => prev.filter((_, i) => i !== idx))

  const total   = services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0)
  const endDate = computeEndDate(startDate, durationWeeks)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (disciplines.length === 0) {
      setErrorMsg('Select at least one discipline.')
      setStatus('error')
      return
    }
    setStatus('sending')
    setErrorMsg('')

    const data = {
      clientName,
      clientEmail,
      programName,
      startDate,
      durationWeeks:   parseInt(durationWeeks),
      sessionsPerWeek: parseInt(sessionsPerWeek),
      sessionMinutes:  parseInt(sessionMinutes),
      disciplines,
      services: services.map(s => ({ description: s.description, price: parseFloat(s.price) || 0 })),
      notes,
      total,
    }

    try {
      const res  = await fetch('/api/training-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Unknown error')
      setSubmitted(data)
      setStatus('done')
    } catch (err) {
      setErrorMsg(String(err))
      setStatus('error')
    }
  }

  const reset = () => {
    setClientName(''); setClientEmail(''); setProgramName('')
    setStartDate(TODAY); setDurationWeeks(8); setSessionsPerWeek(3); setSessionMinutes(60)
    setDisciplines(['Boxing']); setServices([{ description: '', price: 0 }]); setNotes('')
    setStatus('idle'); setErrorMsg(''); setSubmitted(null)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0A0A0A' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#C41E3A,#9B1726)' }}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm text-white tracking-wide">COMBO BREAKER</p>
            <p className="text-[10px] tracking-widest uppercase" style={{ color: '#D4AF37' }}>Training Program Builder</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/invoice" className="text-gray-500 hover:text-gray-300 text-xs font-mono transition-colors">
            Invoice Tool
          </Link>
          <Link to="/" className="text-gray-500 hover:text-gray-300 text-xs font-mono transition-colors">
            ← Back to site
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {status === 'done' && submitted ? (
          <SuccessScreen
            programName={submitted.programName}
            clientEmail={submitted.clientEmail}
            total={submitted.total}
            onReset={reset}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* 1 — Client Info */}
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
              </div>
            </Card>

            {/* 2 — Program Setup */}
            <Card>
              <SectionHeader n={2} label="Program Setup" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label>Program Name *</Label>
                  <Field required value={programName} onChange={e => setProgramName(e.target.value)} placeholder="8-Week Boxing Fundamentals" />
                </div>
                <div>
                  <Label>Start Date *</Label>
                  <Field type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div>
                  <Label>Duration *</Label>
                  <div className="relative">
                    <Field
                      type="number" min="1" max="52" required
                      value={durationWeeks}
                      onChange={e => setDurationWeeks(e.target.value)}
                      style={{ paddingRight: '3.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs pointer-events-none">weeks</span>
                  </div>
                </div>
              </div>
              {endDate && (
                <p className="text-xs text-gray-500 font-mono mt-3">
                  Ends <span className="text-gray-300">{formatDate(endDate)}</span>
                </p>
              )}
            </Card>

            {/* 3 — Schedule */}
            <Card>
              <SectionHeader n={3} label="Training Schedule" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label>Sessions / Week *</Label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7].map(n => (
                      <button key={n} type="button" onClick={() => setSessionsPerWeek(n)}
                        className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                        style={{
                          background: sessionsPerWeek === n ? 'linear-gradient(135deg,#C41E3A,#9B1726)' : 'rgba(255,255,255,0.05)',
                          color: sessionsPerWeek === n ? '#fff' : '#9CA3AF',
                          border: sessionsPerWeek === n ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Session Duration *</Label>
                  <select value={sessionMinutes} onChange={e => setSessionMinutes(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {SESSION_DURATIONS.map(d => (
                      <option key={d.value} value={d.value} style={{ background: '#0F0F0F' }}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* 4 — Disciplines */}
            <Card>
              <SectionHeader n={4} label="Training Focus" />
              <div className="flex flex-wrap gap-2">
                {DISCIPLINES.map(d => (
                  <button key={d} type="button" onClick={() => toggleDiscipline(d)}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background:  disciplines.includes(d) ? 'rgba(196,30,58,0.2)' : 'rgba(255,255,255,0.05)',
                      color:       disciplines.includes(d) ? '#C41E3A' : '#6B7280',
                      border:      disciplines.includes(d) ? '1px solid rgba(196,30,58,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    }}>
                    {d}
                  </button>
                ))}
              </div>
              {disciplines.length === 0 && (
                <p className="text-xs text-red-400 mt-2">Select at least one discipline.</p>
              )}
            </Card>

            {/* 5 — Services */}
            <Card>
              <SectionHeader n={5} label="What's Included" />
              <div className="hidden sm:grid grid-cols-[1fr_100px_28px] gap-3 px-1 mb-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600">Description</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600 text-right">Price</span>
                <span />
              </div>
              <div className="space-y-2">
                {services.map((svc, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_28px] gap-2 sm:gap-3 items-center">
                    <input
                      list="cb-services"
                      required
                      value={svc.description}
                      onChange={e => updateService(idx, 'description', e.target.value)}
                      placeholder="e.g. Personal Training Sessions"
                      className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">$</span>
                      <input
                        type="number" min="0" step="0.01" required
                        value={svc.price}
                        onChange={e => updateService(idx, 'price', e.target.value)}
                        className="w-full rounded-xl pl-6 pr-3 py-3 text-white text-sm text-right focus:outline-none transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    </div>
                    <button type="button" onClick={() => removeService(idx)} disabled={services.length === 1}
                      className="text-gray-600 hover:text-red-400 transition-colors text-xl font-bold disabled:opacity-20 text-center">
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <datalist id="cb-services">
                {COMMON_SERVICES.map(s => <option key={s} value={s} />)}
              </datalist>
              <div className="flex items-center justify-between mt-4">
                <button type="button" onClick={addService}
                  className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  style={{ color: '#C41E3A' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add item
                </button>
                <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>
                  Total: {formatCurrency(total)}
                </span>
              </div>
            </Card>

            {/* 6 — Notes */}
            <Card>
              <SectionHeader n={6} label="Program Notes" />
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Training goals, expectations, special instructions, or anything else the client should know..."
                className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </Card>

            {/* Preview strip */}
            {programName && clientName && (
              <div className="rounded-xl p-4 text-xs text-gray-400 leading-relaxed"
                style={{ background: 'rgba(196,30,58,0.06)', border: '1px solid rgba(196,30,58,0.2)' }}>
                <span className="font-semibold" style={{ color: '#C41E3A' }}>Preview — </span>
                <span className="font-medium text-white">{programName}</span>
                {' '}for{' '}
                <span className="font-medium text-white">{clientName}</span>
                {startDate && endDate && ` · ${formatDate(startDate)} – ${formatDate(endDate)}`}
                {' · '}
                <span className="font-semibold" style={{ color: '#D4AF37' }}>{formatCurrency(total)}</span>
              </div>
            )}

            {/* Error */}
            {status === 'error' && (
              <div className="rounded-xl px-4 py-3 text-sm"
                style={{ background: 'rgba(196,30,58,0.1)', border: '1px solid rgba(196,30,58,0.3)', color: '#F87171' }}>
                <strong>Error:</strong> {errorMsg}
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-between pt-2 pb-10">
              <span className="text-xs text-gray-600">PDF generated and emailed via Gmail</span>
              <button type="submit" disabled={status === 'sending'}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#C41E3A,#9B1726)' }}>
                {status === 'sending' ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Generating &amp; Sending…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Training Program
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
