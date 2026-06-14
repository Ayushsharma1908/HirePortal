import React from 'react'
import { STATUS_COLORS } from '../../utils/constants'

export default function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS['New']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse-dot`} />
      {status}
    </span>
  )
}
