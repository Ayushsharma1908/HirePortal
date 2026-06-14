import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useFormCtx } from '../../context/FormContext'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Loader2, RefreshCw, ShieldCheck } from 'lucide-react'

// ─── Canvas CAPTCHA ────────────────────────────────────────────────────────────
function generateCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function CaptchaCanvas({ code }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    // Background — off-white with slight noise feel
    ctx.fillStyle = '#f5f5f7'
    ctx.fillRect(0, 0, W, H)

    // Random background noise dots
    for (let i = 0; i < 120; i++) {
      ctx.beginPath()
      ctx.arc(
        Math.random() * W,
        Math.random() * H,
        Math.random() * 1.5,
        0, Math.PI * 2
      )
      ctx.fillStyle = `rgba(28,29,33,${Math.random() * 0.12})`
      ctx.fill()
    }

    // Random interference lines
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * W, Math.random() * H)
      ctx.bezierCurveTo(
        Math.random() * W, Math.random() * H,
        Math.random() * W, Math.random() * H,
        Math.random() * W, Math.random() * H
      )
      ctx.strokeStyle = `rgba(13,148,136,${Math.random() * 0.25 + 0.05})`
      ctx.lineWidth = Math.random() * 1.5 + 0.5
      ctx.stroke()
    }

    // Draw each character with random tilt, size, color, position jitter
    const fonts = ['bold', '600', '500']
    const colors = ['#1C1D21', '#0d9488', '#854F0B', '#4c1d95', '#0F6E56', '#185FA5']
    const charW = W / (code.length + 1)

    code.split('').forEach((ch, i) => {
      const x = charW * (i + 0.8) + (Math.random() * 6 - 3)
      const y = H / 2 + (Math.random() * 10 - 5)
      const angle = (Math.random() * 30 - 15) * (Math.PI / 180)
      const size = Math.floor(Math.random() * 8 + 20)

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.font = `${fonts[Math.floor(Math.random() * fonts.length)]} ${size}px Poppins, sans-serif`
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]

      // Subtle shadow for depth
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      ctx.fillText(ch, 0, 0)
      ctx.restore()
    })

    // Top noise layer over text — very light
    for (let i = 0; i < 40; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * W, Math.random() * H, Math.random(), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(28,29,33,${Math.random() * 0.08})`
      ctx.fill()
    }
  }, [code])

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={64}
      className="border border-ink-200 select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    />
  )
}

function CaptchaBox({ onVerify }) {
  const [code, setCode] = useState(() => generateCode())
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('idle') // idle | success | error
  const [attempts, setAttempts] = useState(0)

  const refresh = () => {
    setCode(generateCode())
    setInput('')
    setStatus('idle')
    onVerify(false)
  }

  const verify = () => {
    if (input.trim() === code) {
      setStatus('success')
      onVerify(true)
    } else {
      setStatus('error')
      setAttempts(a => a + 1)
      onVerify(false)
      // Auto-refresh after 2 failed attempts
      if (attempts >= 1) {
        setTimeout(() => {
          setCode(generateCode())
          setInput('')
          setStatus('idle')
          setAttempts(0)
        }, 900)
      }
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); verify() }
  }

  return (
    <div className="border border-ink-200 p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-ink uppercase tracking-wide flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-teal" />
          Human Verification
        </p>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-1 text-xs text-ink-400 hover:text-ink transition-colors"
          title="Generate new CAPTCHA"
        >
          <RefreshCw size={11} /> New code
        </button>
      </div>

      {/* Canvas */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <CaptchaCanvas code={code} />
          {status === 'success' && (
            <div className="absolute inset-0 bg-teal/10 border border-teal flex items-center justify-center">
              <ShieldCheck size={22} className="text-teal" />
            </div>
          )}
        </div>
        <p className="text-xs text-ink-300 leading-relaxed max-w-[100px]">
          Type the characters shown — case-sensitive
        </p>
      </div>

      {/* Input + verify */}
      {status !== 'success' && (
        <div className="flex gap-2">
          <input
            className={`input flex-1 text-sm tracking-widest font-medium transition-colors ${
              status === 'error' ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder="Enter code here"
            value={input}
            maxLength={8}
            onChange={e => { setInput(e.target.value); if (status === 'error') setStatus('idle') }}
            onKeyDown={handleKey}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={verify}
            disabled={!input.trim()}
            className="btn-primary px-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Verify
          </button>
        </div>
      )}

      {/* Feedback */}
      {status === 'error' && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          ✗ Incorrect — try again
          {attempts >= 1 && <span className="text-ink-300">(refreshing…)</span>}
        </p>
      )}
      {status === 'success' && (
        <p className="text-xs text-teal mt-1.5 flex items-center gap-1 font-medium">
          ✓ Verified successfully
        </p>
      )}
    </div>
  )
}

// ─── Review Row ────────────────────────────────────────────────────────────────
function ReviewRow({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className="flex gap-3 py-2.5 border-b border-ink-100 last:border-0">
      <span className="text-xs text-ink-400 w-36 flex-shrink-0">{label}</span>
      <span className="text-xs text-ink font-medium">
        {Array.isArray(value) ? value.join(', ') : value}
      </span>
    </div>
  )
}

// ─── Main Step ─────────────────────────────────────────────────────────────────
export default function StepReview({ onBack }) {
  const { formData, clearForm } = useFormCtx()
  const [verified, setVerified] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!verified) { toast.error('Please complete the CAPTCHA verification first'); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      const { resume, profileImage, ...rest } = formData
      fd.append('data', JSON.stringify(rest))
      if (resume) fd.append('resume', resume)
      if (profileImage) fd.append('profileImage', profileImage)

      await api.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      clearForm()
      navigate('/apply/success')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-base font-semibold text-ink mb-1">Review & Submit</h2>
      <p className="text-xs text-ink-400 mb-6">Verify your information before submitting</p>

      <div className="border border-ink-100 p-4 mb-4">
        <p className="text-xs uppercase tracking-wide font-medium text-ink-400 mb-2">Personal</p>
        <ReviewRow label="Name"        value={`${formData.firstName} ${formData.lastName}`} />
        <ReviewRow label="Email"       value={formData.email} />
        <ReviewRow label="Phone"       value={formData.phone} />
        <ReviewRow label="Location"    value={`${formData.city}, ${formData.state}`} />
        <ReviewRow label="Applying For" value={`${formData.jobRole} — ${formData.department}`} />
        <ReviewRow label="Experience"  value={formData.experienceLevel} />
      </div>

      <div className="border border-ink-100 p-4 mb-4">
        <p className="text-xs uppercase tracking-wide font-medium text-ink-400 mb-2">Education</p>
        <ReviewRow label="Institution" value={formData.institution} />
        <ReviewRow label="Degree"      value={`${formData.degree}, ${formData.fieldOfStudy}`} />
        <ReviewRow label="Grade"       value={formData.grade} />
        <ReviewRow label="Year"        value={`${formData.startYear} – ${formData.endYear}`} />
      </div>

      <div className="border border-ink-100 p-4 mb-4">
        <p className="text-xs uppercase tracking-wide font-medium text-ink-400 mb-2">Skills</p>
        <ReviewRow label="Technical"     value={formData.technicalSkills} />
        <ReviewRow label="Soft Skills"   value={formData.softSkills} />
        <ReviewRow label="Certifications" value={formData.certifications} />
      </div>

      <div className="border border-ink-100 p-4 mb-5">
        <p className="text-xs uppercase tracking-wide font-medium text-ink-400 mb-2">Documents</p>
        <ReviewRow label="Resume"   value={formData.resume?.name || 'Attached'} />
        {formData.githubUrl    && <ReviewRow label="GitHub"    value={formData.githubUrl} />}
        {formData.linkedinUrl  && <ReviewRow label="LinkedIn"  value={formData.linkedinUrl} />}
      </div>

      <div className="mb-6">
        <CaptchaBox onVerify={setVerified} />
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-outline" disabled={submitting}>
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!verified || submitting}
          className="btn-teal flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? <><Loader2 size={14} className="animate-spin" /> Submitting...</>
            : 'Submit Application'}
        </button>
      </div>
    </div>
  )
}