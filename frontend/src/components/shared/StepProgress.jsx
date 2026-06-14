import React from 'react'

const STEPS = ['Personal', 'Education', 'Skills', 'Documents', 'Review']

export default function StepProgress({ current }) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {STEPS.map((label, i) => {
          const done = i < current
          const active = i === current
          return (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-2 min-w-0">
                <div
                  className={`w-8 h-8 flex items-center justify-center text-xs font-medium transition-all duration-300 rounded-2xl border shadow-soft
                    ${done ? 'bg-ink border-ink text-white' : active ? 'bg-white border-teal text-teal shadow-outline-teal' : 'bg-white border-ink-200 text-ink-400'}`}
                >
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-xs whitespace-nowrap transition-colors duration-300 truncate max-w-[52px] sm:max-w-none ${
                    active ? 'text-ink font-medium' : done ? 'text-teal-dark' : 'text-ink-300'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`step-connector mb-5 rounded-full ${i < current ? 'active' : ''}`} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
