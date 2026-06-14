import React from 'react'

export default function StatCard({ label, value, icon: Icon, color = 'ink', live = false }) {
  const colorMap = {
    ink: 'text-ink bg-ink-50 border-ink-100',
    teal: 'text-teal bg-teal-muted border-teal/20',
    amber: 'text-amber-700 bg-amber-muted border-amber/20',
    green: 'text-green-700 bg-green-50 border-green-100',
  }

  return (
    <div className="card flex items-center gap-4 animate-fade-in">
      <div className={`w-10 h-10 flex items-center justify-center border ${colorMap[color]}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-ink">{value}</span>
          {live && <span className="w-2 h-2 rounded-full bg-teal animate-pulse-dot" title="Live" />}
        </div>
        <p className="text-xs text-ink-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}
