import React from 'react'
import { TICKER_ITEMS } from '../../utils/constants'

export default function TickerStrip() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="relative overflow-hidden py-3 bg-white border-y border-ink-100 shadow-soft">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      <div className="flex animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center mx-3 px-4 py-1.5 text-xs text-ink-600 rounded-full border border-ink-100 bg-ink-50/80 shadow-outline"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
