import React from 'react'

export default function SkillChip({ label, onRemove, suggested, onAdd, variant = 'tech' }) {
  if (suggested) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className="px-3 py-1.5 text-xs rounded-full border border-dashed border-ink-200 text-ink-400 hover:border-teal hover:text-teal hover:bg-teal-muted/30 transition-all"
      >
        + {label}
      </button>
    )
  }

  const styles = variant === 'soft'
    ? 'bg-ink-50 text-ink border-ink-200'
    : 'bg-ink text-white border-ink'

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border shadow-soft ${styles}`}>
      {label}
      <button type="button" onClick={onRemove} className="hover:opacity-70 transition-opacity leading-none">×</button>
    </span>
  )
}
