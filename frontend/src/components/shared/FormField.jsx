import React from 'react'
import { AlertCircle } from 'lucide-react'

export default function FormField({ label, required, error, hint, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label}
          {required && ' *'}
        </label>
      )}
      {children}
      {error && (
        <p className="error-msg" role="alert">
          <AlertCircle size={12} className="flex-shrink-0" />
          {error}
        </p>
      )}
      {hint && !error && <p className="text-xs text-ink-300 mt-1.5">{hint}</p>}
    </div>
  )
}
