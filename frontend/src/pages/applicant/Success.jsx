import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const STEPS = [
  'Application received and logged',
  'Initial screening in progress',
  "You'll hear from us within 7 days",
]

export default function Success() {
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 100) }, [])

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-4">
      <div
        className={`text-center max-w-md w-full transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div
            className="absolute inset-0 bg-teal-muted rounded-3xl opacity-40 animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <div className="relative w-20 h-20 bg-teal rounded-3xl flex items-center justify-center shadow-lift border border-teal-dark/20">
            <CheckCircle2 size={36} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-ink mb-2 tracking-tight">Application Submitted!</h1>
        <p className="text-sm text-ink-400 mb-2 leading-relaxed">
          Thank you for applying. Our team will review your application and get back to you within 5–7 business days.
        </p>
        <p className="text-xs text-ink-300 mb-8">Check your email for a confirmation.</p>

        <div className="rounded-3xl border border-ink-100 bg-white p-5 mb-8 text-left shadow-card space-y-3">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0 border ${
                  i === 0 ? 'bg-teal border-teal text-white' : 'border-ink-200 bg-ink-50 text-ink-300'
                }`}
              >
                {i === 0 ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-medium">{i + 1}</span>
                )}
              </div>
              <p className={`text-xs leading-relaxed ${i === 0 ? 'text-ink font-medium' : 'text-ink-400'}`}>{step}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="btn-outline flex-1 text-center text-xs py-3">Back to Home</Link>
          <Link
            to="/apply"
            className="btn-primary flex-1 text-center text-xs py-3 flex items-center justify-center gap-1.5"
          >
            Apply Again <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}
