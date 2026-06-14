import React, { useEffect, useState } from 'react'

const icons = [
  ({ style }) => (
    <svg style={style} width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="8" y="18" width="40" height="28" rx="8" stroke="#1C1D21" strokeWidth="2" />
      <path d="M20 18v-4a4 4 0 014-4h8a4 4 0 014 4v4" stroke="#1C1D21" strokeWidth="2" />
      <line x1="8" y1="30" x2="48" y2="30" stroke="#1C1D21" strokeWidth="2" />
      <circle cx="36" cy="38" r="5" stroke="#0d9488" strokeWidth="2" />
      <line x1="39.5" y1="41.5" x2="43" y2="45" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  ({ style }) => (
    <svg style={style} width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="14" y="8" width="28" height="40" rx="6" stroke="#1C1D21" strokeWidth="2" />
      <line x1="20" y1="20" x2="36" y2="20" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="27" x2="36" y2="27" stroke="#1C1D21" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="34" x2="30" y2="34" stroke="#1C1D21" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  ({ style }) => (
    <svg style={style} width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="20" r="8" stroke="#1C1D21" strokeWidth="2" />
      <path d="M14 44c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#1C1D21" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="14" r="7" fill="#0d9488" />
      <path d="M37 14l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ({ style }) => (
    <svg style={style} width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="8" y="8" width="40" height="40" rx="8" stroke="#1C1D21" strokeWidth="2" />
      <polyline points="16,36 24,26 32,30 42,18" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="36" r="2" fill="#0d9488" />
      <circle cx="24" cy="26" r="2" fill="#0d9488" />
      <circle cx="32" cy="30" r="2" fill="#0d9488" />
      <circle cx="42" cy="18" r="2" fill="#0d9488" />
    </svg>
  ),
]

export default function LoadingScreen() {
  const [visible, setVisible] = useState([false, false, false, false])
  const [tagline, setTagline] = useState(0)
  const taglines = ['Finding your next opportunity...', 'Building your future...', 'Opening doors...']

  useEffect(() => {
    icons.forEach((_, i) => {
      setTimeout(() => setVisible(v => { const n = [...v]; n[i] = true; return n }), i * 200)
    })
    const interval = setInterval(() => setTagline(t => (t + 1) % taglines.length), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-ink-50 flex flex-col items-center justify-center z-50">
      <div className="mb-12 animate-fade-in">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-ink rounded-2xl flex items-center justify-center shadow-soft">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="6" width="14" height="10" rx="2" stroke="white" strokeWidth="1.4" />
              <path d="M6 6V5a3 3 0 016 0v1" stroke="white" strokeWidth="1.4" />
            </svg>
          </div>
          <span className="text-ink font-semibold text-lg tracking-tight">HirePortal</span>
        </div>
      </div>

      <div className="flex items-end gap-10 mb-14">
        {icons.map((Icon, i) => (
          <div
            key={i}
            style={{
              opacity: visible[i] ? 1 : 0,
              transform: visible[i] ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease',
              animation: visible[i] ? `float ${2.5 + i * 0.3}s ease-in-out infinite` : 'none',
              animationDelay: `${i * 0.15}s`,
            }}
          >
            <Icon style={{}} />
          </div>
        ))}
      </div>

      <p key={tagline} className="text-sm text-ink-400 animate-fade-in" style={{ minHeight: '20px' }}>
        {taglines[tagline]}
      </p>

      <div className="mt-8 w-48 h-1 bg-ink-100 rounded-full overflow-hidden shadow-soft">
        <div className="h-full bg-teal rounded-full" style={{ animation: 'progress 3s ease-out forwards' }} />
      </div>

      <style>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  )
}
